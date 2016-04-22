var chalk = require('chalk');
var google = require('googleapis');
var got = require('got');
var authorize = require('./auth');
var types = require('./types');

var drive = google.drive('v2');

function fetch(args, callback) {
  if (!Array.isArray(args)) {
    args = [args];
  }

  authorize(function(client) {
    args.forEach(function(opts) {
      var exportParams = getExportString(opts.type, opts.filetype);

      var req = {
        fileId: opts.fileid,
        auth: client
      };

      getFile(req, exportParams, opts, callback);
    });
  });
}

function getFile(req, exportParams, opts, callback) {
  drive.files.get(req, function(err, res) {
    if (err) { return callback(err); }

    console.log(chalk.bold('Retrieving `' + res.title + '`. (' + req.fileId + ')'));

    var exportUrl = res.exportLinks[exportParams.key];
    downloadGoogleDriveFile(exportUrl, exportParams.encoding, req.auth.credentials.access_token, opts, callback);
  });
}

function downloadGoogleDriveFile(exportUrl, encoding, accessToken, opts, callback) {
  var options = {
    encoding: encoding,
    headers: {
      authorization: 'Bearer ' + accessToken
    }
  };

  got(exportUrl, options, function(err, file) {
    if (err) { return callback(err); }

    callback(null, file, opts);
  });
}

function getExportString(documentType, exportType) {
  var typeset;

  if (documentType in types) {
    typeset = types[documentType];
  } else {
    throw new Error('Provided document type is not valid: ' + documentType);
  }

  if (exportType in typeset) {
    return typeset[exportType];
  } else {
    throw new Error('Provided `' + documentType + '` export type was not found: ' + exportType);
  }
}

module.exports = fetch;
