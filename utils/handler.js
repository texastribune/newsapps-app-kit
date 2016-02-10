var url = require('url');

var Entities = require('html-entities').AllHtmlEntities;
var htmlparser = require('htmlparser2');
var archieml = require('archieml');


function cleanHtml(rawHtml, callback) {
  var handler = new htmlparser.DomHandler(function(err, dom) {
    if (err) { throw err; }

    var body = dom[0].children[1];

    var tagHandlers = {
      base: function (tag) {
        var str = '';
        tag.children.forEach(function(child) {
          if (tagHandlers[child.name || child.type]) {
            var func = tagHandlers[child.name || child.type];
            str += func(child);
          }
        });
        return str;
      },
      text: function (textTag) {
        return textTag.data;
      },
      span: function (spanTag) {
        return tagHandlers.base(spanTag);
      },
      p: function (pTag) {
        return tagHandlers.base(pTag) + '\n';
      },
      a: function (aTag) {
        var href = aTag.attribs.href;

        if (href === undefined) {
          return '';
        }

        // extract real URLs from Google's tracking
        // from: http://www.google.com/url?q=http%3A%2F%2Fwww.nytimes.com...
        // to: http://www.nytimes.com...
        if (aTag.attribs.href && url.parse(aTag.attribs.href,true).query && url.parse(aTag.attribs.href,true).query.q) {
          href = url.parse(aTag.attribs.href,true).query.q;
        }

        var str = '<a href="' + href + '">';
        str += tagHandlers.base(aTag);
        str += '</a>';
        return str;
      },
      li: function (tag) {
        return '* ' + tagHandlers.base(tag) + '\n';
      }
    };

    ['ul', 'ol'].forEach(function(tag) {
      tagHandlers[tag] = tagHandlers.span;
    });
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function(tag) {
      tagHandlers[tag] = tagHandlers.p;
    });

    var parsedText = tagHandlers.base(body);
    var entities = new Entities();
    parsedText = entities.decode(parsedText);

    parsedText = parsedText.replace(/<[^<>]*>/g, function(match) {
      return match.replace(/”|“/g, '"').replace(/‘|’/g, '\'');
    });

    callback(archieml.load(parsedText));
  });

  var parser = new htmlparser.Parser(handler);
  parser.write(rawHtml);
  parser.done();
}


module.exports = cleanHtml;
