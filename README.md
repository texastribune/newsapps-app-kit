# The News Apps App Kit

This package helps jump start special Tribune features and series that are built outside the regular CMS. It's Tribune-centric, but easy to update and transform to fit your needs. If you're working on a graphic, use the [News Apps Graphic Kit](https://github.com/texastribune/newsapps-graphic-kit).

## Features

- Live reloading and viewing powered by [BrowserSync](http://www.browsersync.io/)
- Compiling of Sass/SCSS with [LibSass](http://sass-lang.com/libsass)
- CSS prefixing with [autoprefixer](https://github.com/postcss/autoprefixer)
- CSS sourcemaps with [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)
- CSS compression with [cssnano](https://github.com/ben-eb/cssnano)
- JavaScript compression with [uglifyjs](https://github.com/mishoo/UglifyJS2)
- Template compiling with [nunjucks](http://mozilla.github.io/nunjucks/)
- Image compression with [gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin)
- Asset revisioning with [gulp-rev](https://github.com/sindresorhus/gulp-rev) and [gulp-rev-replace](https://github.com/jamesknelson/gulp-rev-replace)

## Quickstart

Run this command in your project's folder:

```sh
curl -fsSL https://github.com/texastribune/newsapps-app-kit/archive/master.tar.gz | tar -xz --strip-components=1
```

Next, `npm install`.

If this is your first time to ever use the kit, you need to follow the steps in your terminal for Google authorization, i.e. go to the given link and paste the token into the terminal.

Update the `config.js`, and add the unique Google Tokens for your  document(s) and spreadsheet(s). For spreadsheets, you'll need to designate how to process the data, as either a `keyvalue` or `objectlist`.

Now get to work!

## Development

Run the following command to start the development server:

```sh
gulp serve
```

Then visit [http://localhost:3000]() to see your work.

## Connect to S3

To use the commands to deploy your project to Amazon S3, you'll need to add a profile to your ~/.aws/config. It should look something like this:

```
[profile newsapps]
aws_access_key_id=YOUR_UNIQUE_ID
aws_secret_access_key=YOUR_SECRET_ACCESS_KEY
```

## Deployment

Run these commands to build and deploy:

```
gulp
npm run deploy
```

The project will deploy using the S3 bucket and slug found in your `config.js`.

## Assets

The graphics kit comes with an empty app/assets folder for you to store images, fonts and data files. The kit works best if you add these files to app/assets/images, app/assets/fonts and app/assets/data. These files will automatically be ignored by git hub, if added to the proper folders, to prevent a storage overload and to keep files locally that may have sensitive information in an open source project.

## Available Commands

```sh
npm run data/fetch
```
Pulls down the project's spreadsheet and/or documents and creates data files in the data folder. Will authenticate you with your Google account if needed.

```sh
npm run serve
```
Starts the development server.

```sh
npm run build
```
Build the project for production.

```sh
npm run deploy/dev
```
Deploys the project.
