import fs from 'fs';
import url from 'url';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import autoprefixer from 'autoprefixer-core';
import browserSync from 'browser-sync';
import del from 'del';
import nunjucks from 'nunjucks';
import map from 'vinyl-map';
import runSequence from 'run-sequence';
import yargs from 'yargs';

const $ = gulpLoadPlugins();
const args = yargs.argv;
const bs = browserSync.create();

gulp.task('jshint', () => {
  return gulp.src('./app/scripts/**/*.js')
    .pipe(bs.reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!bs.active, $.jshint.reporter('fail')))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('images', () => {
  gulp.src('./app/assets/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('./dist/assets/images'))
    .pipe($.size({title: 'images'}));
});

gulp.task('fonts', () => {
  gulp.src(['./app/assets/fonts/**/*'])
    .pipe(gulp.dest('./dist/assets/fonts'))
    .pipe($.size({title: 'fonts'}));
});

gulp.task('assets', () => {
  return gulp.src(['app/assets/*', '!app/assets/images', '!app/assets/fonts'])
  .pipe(gulp.dest('./dist/assets'))
  .pipe($.size({title: 'assets'}));
});

gulp.task('templates', () => {
  let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  let config = JSON.parse(fs.readFileSync('./config.json'));
  let deployConfig = config.deploy;

  let fullPath = url.format({
    protocol: 'http',
    host: deployConfig.s3_bucket,
    pathname: deployConfig.slug
  }) + '/';
  data.PATH_FULL = fullPath;

  // disable watching or it'll hang forever
  let env = nunjucks.configure('./app/templates', {watch: false});

  let nunjuckify = map((code, filename) => {
    return env.renderString(code.toString(), data);
  });

  return gulp.src(['./app/**/{*,!_*}.html', '!app/**/_*.html'])
    .pipe(nunjuckify)
    .pipe(gulp.dest('./.tmp'))
    .pipe($.if(args.production, $.minifyHtml()))
    .pipe($.if(args.production, gulp.dest('./dist')))
    .pipe($.size({title: 'templates'}));
});

gulp.task('styles', () => {
  return gulp.src(['./app/styles/*.scss'])
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: ['node_modules'],
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      autoprefixer({
        browsers: ['last 2 versions']
      })
    ]))
    .pipe($.if(args.production, $.minifyCss({
      keepSpecialComments: 0
    })))
    .pipe($.sourcemaps.write(args.production ? '.' : undefined))
    .pipe(gulp.dest('./.tmp/styles/'))
    .pipe($.if(args.production, gulp.dest('./dist/styles')))
    .pipe(bs.stream({
      match: '**/*.css'
    }))
    .pipe($.size({title: 'styles'}));
});

gulp.task('serve', ['templates', 'styles'], () => {
  bs.init({
    notify: false,
    logConnections: true,
    logPrefix: 'NEWSAPPS',
    open: false,
    server: {
      baseDir: ['./.tmp', './app'],
      routes: {
        '/node_modules': 'node_modules',
      }
    }
  });

  gulp.watch(['./app/styles/**/*.scss'], ['styles']);
  gulp.watch(['./app/scripts/**/*.js'], ['jshint']);
  gulp.watch(['./app/**/*.html'], ['templates', bs.reload]);
});

gulp.task('clean', cb => {
  return del(['./.tmp/**', './dist/**', '!dist/.git'], {dot: true}, cb);
});

gulp.task('rev', () => {
  return gulp.src(['./dist/**/*.css', './dist/**/*.js', './dist/assets/images/**/*'], { base: './dist' })
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

gulp.task('gzip', () => {
  return gulp.src('./dist/**/*.{html,js,css,json,eot,ttf,svg}')
    .pipe($.gzip({append: false}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['clean'], cb => {
  runSequence(['assets', 'fonts', 'images', 'jshint', 'styles', 'templates'], ['revreplace'], ['gzip'], cb);
});

gulp.task('default', ['build']);
