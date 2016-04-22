const url = require('url');
const path = require('path');
const gulp = require('gulp');
const u = require('gulp-util');
const gulpLoadPlugins = require('gulp-load-plugins');

const browserSync = require('browser-sync');
const del = require('del');
const map = require('vinyl-map');
const nunjucks = require('nunjucks');
const quaff = require('quaff');
const runSequence = require('run-sequence');
const stripAnsi = require('strip-ansi');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const yargs = require('yargs');

const $ = gulpLoadPlugins();
const args = yargs.argv;
const bs = browserSync.create();

const webpackConfig = require('./webpack.config');

if (args.production) {
  webpackConfig.debug = false;
  webpackConfig.devtool = 'source-map';
  webpackConfig.plugins = webpackConfig.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]);
}

const webpackBundle = webpack(webpackConfig);

webpackBundle.plugin('done', (stats) => {
  if (stats.hasErrors() || stats.hasWarnings()) {
    return bs.sockets.emit('fullscreen:message', {
      title: 'Webpack Error:',
      body: stripAnsi(stats.toString()),
      timeout: 100000
    });
  }

  bs.reload();
});

gulp.task('scripts', (cb) => {
  webpackBundle.run((err, stats) => {
    if (err) throw new u.PluginError('webpack', err);
    u.log('[webpack]', stats.toString({colors: true}));

    cb();
  });
});

const package = require('./package');
const data = quaff('./data');

const basePath = args.production ? url.resolve('/', package.config.slug) + '/' : '/';
data.PATH_PREFIX = basePath;

const fullPath = url.format({
  protocol: 'http',
  host: package.config.s3_bucket,
  pathname: package.config.slug
}) + '/';

data.PATH_FULL = fullPath;

const env = nunjucks.configure('./app/templates', {
  autoescape: false,
  noCache: true,
});

env.addGlobal('PATH_PREFIX', data.PATH_PREFIX);

gulp.task('templates', () => {
  const nunjuckify = map((code, filename) => {
    return env.renderString(code.toString(), {data: data});
  });

  // All .html files are valid, unless they are found in templates
  return gulp.src(['./app/**/*.html', '!./app/templates/**/*'])
    .pipe(nunjuckify)
    .pipe($.rename((file) => {
      if (file.basename !== 'index') {
        file.dirname = path.join(file.dirname, file.basename);
        file.basename = 'index';
      }
    }))
    .pipe(gulp.dest('./.tmp'))
    .pipe($.if(args.production, $.htmlmin({collapseWhitespace: true})))
    .pipe($.if(args.production, gulp.dest('./dist')))
    .pipe($.size({title: 'templates', showFiles: true}));
});

gulp.task('templates-watch', ['templates'], bs.reload);

gulp.task('styles', () => {
  return gulp.src('./app/styles/*.scss')
    .pipe($.newer('./.tmp/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: ['node_modules'],
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.cssnano({
      autoprefixer: {
        browsers: ['last 2 versions']
      },
      discardComments: {
        removeAll: true
      }
    }))
    .pipe($.sourcemaps.write(args.production ? '.' : undefined))
    .pipe(gulp.dest('./.tmp/styles'))
    .pipe($.if(args.production, gulp.dest('./dist/styles')))
    .pipe(bs.stream({match: '**/*.css'}))
    .pipe($.size({title: 'styles'}));
});

gulp.task('images', () => {
  return gulp.src('./app/assets/images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./dist/assets/images'))
    .pipe($.size({title: 'images'}));
});

gulp.task('fonts', function () {
  return gulp.src('./app/assets/fonts/**/*')
    .pipe(gulp.dest('./dist/assets/fonts'))
    .pipe($.size({title: 'fonts'}));
});

gulp.task('data', function () {
  return gulp.src('./app/assets/data/**/*')
    .pipe(gulp.dest('./dist/assets/data'))
    .pipe($.size({title: 'data'}));
});

gulp.task('clean', cb => {
  return del(['./.tmp/**', './dist/**', '!dist/.git'], {dot: true}, cb);
});

gulp.task('serve', ['styles', 'templates'], () => {
  bs.init({
    logConnections: true,
    logPrefix: 'NEWSAPPS',
    middleware: [
      webpackDevMiddleware(webpackBundle, {
        publicPath: webpackConfig.output.publicPath,
        stats: {colors: true}
      })
    ],
    notify: false,
    open: false,
    plugins: ['bs-fullscreen-message'],
    port: 3000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });

  gulp.watch(['./app/styles/**/*.scss'], ['styles']);
  gulp.watch('./app/**/*.html', ['templates-watch']);
});

gulp.task('rev', () => {
  return gulp.src(['./dist/**/*.css', './dist/**/*.js', './dist/assets/images/**/*', './dist/assets/data/**/*'], { base: './dist' })
    .pipe($.rev())
    .pipe(gulp.dest('./dist'))
    .pipe($.rev.manifest())
    .pipe(gulp.dest('./dist'));
});

gulp.task('revreplace', ['rev'], () => {
  var manifest = gulp.src('./dist/rev-manifest.json');

  return gulp.src('./dist/**/*.html')
    .pipe($.revReplace({manifest: manifest}))
    .pipe(gulp.dest('./dist'));
});


gulp.task('default', ['clean'], (cb) => {
  runSequence(['fonts', 'images', 'data', 'scripts', 'styles', 'templates'], ['revreplace'], cb);
});

gulp.task('build', ['default']);
