// Taken from http://stackoverflow.com/questions/18968677/how-do-i-render-all-pages-in-a-page-collection-on-one-page

var glob = require('glob');
var fs = require('fs');
var yamlFront = require('yaml-front-matter');

module.exports.register = function(Handlebars, options) {

  // Customize this helper
  Handlebars.registerHelper('md-pages', function(str, options) {

    var files = glob.sync(str);
    var out = '';
    var context = {};
    var data = null;
    var template = null;

    var _i;
    for(_i = 0; _i < files.length; _i++) {
      data = yamlFront.loadFront(fs.readFileSync(files[_i]), 'src');

      template = Handlebars.compile(data.src); // Compile the source

      context = data; // Copy front matter data to Handlebars context
      context.body = template(data); // render template

      out += options.fn(context);
    }

    return out;
  });

};
