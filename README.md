# The News Apps App Kit — Price of Admission Template

This package helps jump start special Tribune features and series that are built outside the regular CMS. It's Tribune-centric, but easy to update and transform to fit your needs. If you're working on a single-page graphic and plan to embed it with an iframe, use the [News Apps Graphic Kit](https://github.com/texastribune/newsapps-graphic-kit).

## Quickstart

Run this command in your project's folder:

```sh
curl -fsSL https://github.com/texastribune/newsapps-app-kit/archive/price-of-admission-template.tar.gz | tar -xz --strip-components=1
```

Next, `npm install`.

If this is your first time to ever use the kit, you need to follow the steps in your terminal for Google authorization, i.e. go to the given link and paste the token into the terminal.

## Creating Templates with Google Docs & Spreadsheets

This kit allows you to pull in content from Google Docs and Spreadsheets. To use the story.html template file, you'll need to set up a Google doc using our [basic template](https://docs.google.com/document/d/1iSsqopd2QLhlQDx0gVX9rYoUp-akX1tdZMF6910BhaU) and follow these steps.

#### Set up `config.js`

Update the `config.js`, and add the unique Google Tokens for your  document(s) and spreadsheet(s). For spreadsheets, you'll need to designate how to process the data, as either a `keyvalue` or `objectlist`. You'll also need to assign a "name" in the `config.js` for each doc/sheet, which will become the name of a json file in your `/data` folder with the data pulled in from that document. You'll then be able to refer to that name throughout your project to pull data from that file.

#### Update project data with `npm run data/fetch`

To pull or update the data from your docs/sheets in your project, run the command `npm run data/fetch`. You can double-check the `/data` folder to make sure your files and data are updated.

#### Create index.html / additional story pages

All of the hard work to build your story page occurs in `/templates/layouts/story.html`. To create a new page, add an HTMl file inside `/app`, starting with `index.html` and insert the following code:

```
{% extends 'layouts/story.html' %}
{% set context = data.story_one %}

{% block styles %}
{{ super() }}
{% endblock %}

{% block script %}
{{ super()}}
{% endblock %}
```

The line `{% set context = data.story_one %}` tells the project which data file to pull in to build the template. In this case, the file will look for the `story_one.json` file, which hopefully you just set up in your `config.js` with the name `story_name` and pulled in with the command `npm run data/fetch`.

Additional HTML pages set up in your app will set the name of the file as the slug. For example, when you deploy, `index.html` will be `bucket.org/project-name` and `story-two.html` will be `bucket.org/project-name/story-two/`.

#### [Sample Google Doc ArchieML template](https://docs.google.com/document/d/1iSsqopd2QLhlQDx0gVX9rYoUp-akX1tdZMF6910BhaU)

+ *id* — This is the Part Number for the series. It's used to set up the story navigation in the `.nav__aside` and `.nav__footer` modules found in `/app/styles/_nav.scss`. It's also used to indicate which lead art class to use, which you define in `/app/styles/_utils/` > `@mixin story-header`.
+ *script* — Sets which script file to load in the `base.html`. You don't need to include the extension `.js`. Default: `main`
+ *headline* - Your story headline. Appears in the `.storytop`, `.nav__aside` and `.nav__footer`
+ *pub_date* - Publish date. Use AP style :)
+ *slug* - URL slug for your story. It must match the filename of the HTML file for that story.
+ *short_head* - Shorter headline, in case you need it.
+ *[authors]* - Currently supports up 2 individual author names. If you include email, the name will be linked. See `/app/templates/macros/authors.html`
+ *{lead_art}*
  - photo_url: test.jpg // file name with extension type. Looks for file in `/app/assets/images`
  - thumbnail_url: test.jpg // for thumbnail version in `.nav__aside`
  - caption: Vestibulum ullamcorper mauris at ligula. Sed hendrerit. // Photo caption
  -credit: Person McPhotographer // Credit
+ *fb_art* - Specific image file for Facebook OG meta data. Include extension; looks for file in `/app/assets/images`
+ *summary* - Summary description for Facebook OG meta description.
+ *twitter_text* - Text for Twitter share button
+ *[+prose]* — ALL THE MAGIC STUFF. This will convert regular story text into HTML. Paragraphs in prose must be separated by an empty return space to be read as new `<p>`. Hyperlinked text will automatically become `<a href="link.html">`. Inside `[+prose]` you can also add ad units, the nav__aside, and a variety of other components. See full list and make additional components in `/app/template/macros/prose.html`.
  - *{.ad}* - Insert ad unit into prose.
    + type - Options: inside [468, 60], sidebar [350, 200], banner [728, 90].
    + id - Define ad units in `/app/scripts/includes/adLoader.js` and set id to indicate which ad unit
    + alignment - Optional. Will add alignment class. Options: right-lock, left-lock, basic.
  - subhead - Insert subheader into story text with bold styles.
  - *{.image}* - Insert image.
    + photo_url - file.jpg // Include file type extension. Looks for file in `/app/assets/images`
    + caption - Photo caption text
    + credit - Photo credit
    + alignment - Options: basic (full width), right-lock (float right on Desktop), left-lock(float left on Desktop)
  - *disclosure* - Italicizes text / adds `.disclosure` styles.
  - *republish* - Adds prompt/link to additional republish page. Requires you to separately set up an HTML page with the `story_republish.html` template.

## Webpack

This kit uses the [webpack module bundler](https://webpack.github.io/). You can see an example of how to import files in `app/scripts/main.js` - as the kit comes preloaded with an import of the `app/scripts/includes/adLoader.js` partial script. If you're using a big library like JQuery or D3, we recommend downloading the node module, and adding it to the `webpack.config.js` file as a plugin.
Here's an example:

```
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      d3: 'd3'
    })
  ],
```

Then you can set global variables in your `/app/scripts/main.js` and reference the libraries throughout your project. When you compile the project later for deployment, it will include the libraries.

## Development

Run the following command to start the development server:

```sh
npm run serve
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
npm run build
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
