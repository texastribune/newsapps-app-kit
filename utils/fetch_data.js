var fs = require('fs');

var chalk = require('chalk');
var copytext = require('copytext');

var fetchDocs = require('./fetch');
var docHandler = require('./handler');

var config = require('../config').data;

if (config.docs) {
  console.log(chalk.bold('Fetching document files...'));

  var prep = config.docs.map(function(d) {
    d.type = 'doc';
    d.filetype = 'html';

    return d;
  });

  fetchDocs(prep, function(err, data, opts) {
    if (err) { throw err; }

    var fileLocation = './data/' + opts.name + '.json';

    docHandler(data, function(parsed) {
      fs.writeFileSync(fileLocation, JSON.stringify(parsed, null, 2));
    });
  });
}

if (config.sheets) {
  console.log(chalk.bold('Fetching spreadsheet files...'));

  var prep = config.sheets.map(function(d) {
    d.type = 'sheet';
    d.filetype = 'xlsx';

    return d;
  });

  fetchDocs(prep, function(err, data, opts) {
    if (err) { throw err; }

    var fileLocation = './data/' + opts.name + '.json';

    var parsed = copytext(data, opts.copytext);
    fs.writeFileSync(fileLocation, JSON.stringify(parsed, null, 2));
  });
}
