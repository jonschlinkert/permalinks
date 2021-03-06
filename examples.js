'use strict';

var path = require('path');
var moment = require('moment');
var Permalinks = require('./');

/**
 * Examples
 */

var permalinks = new Permalinks();

permalinks.helper('date', function(format) {
  return moment(this.file.data.date || new Date()).format(format || 'YYYY/MM/DD');
});

permalinks.helper('file', function(file, data) {
  if (file.data.date) {
    var re = /^(\d{4})-(\d{2})-(\d{2})/;
    var match = re.exec(file.data.date);
    console.log(match)
  }
});

var File = require('vinyl');
var file = new File({path: 'src/content/first-blog-post.md'});
file.data = {
  permalink: {
    structure: ':site/:stem/index.html',
  },
  site: 'foo',
  root: 'blog',
  date: '2015-01-21',
  slug: 'first-post',
  ext: '.html'
};

permalinks.preset('post', '{{#each segs}}{{this}}/{{/each}}{{date "YYYY/MM/DD"}}/{{stem}}.html');
file.data.permalink = permalinks.format('post', file, {
  segs: file.path.split('').filter(s => s !== '/')
});

permalinks.preset('post', '{{root}}/{{date "YYYY/MM/DD"}}/{{stem}}/index.html');
file.data.permalink = permalinks.format(file);
console.log(file.data.permalink);

permalinks.preset('post', ':root/:date("YYYY/MM/DD")/:stem/index:ext');
var res = permalinks.format('post', file);
console.log(res);

var file = { path: 'src/about.tmpl', data: {date: '2017-01-01'}};
console.log(permalinks.format(':date("")/:stem/index.html', file));
//=> '2017/01/01/about/index.html'

permalinks.data.prefix = 'somePrefix';

permalinks.helper('date1', function(file, format) {
 return moment(file.data.date).format(format);
});

permalinks.helper('date2', function(format) {
 return moment(this.file.data.date).format(format || 'YYYY');
});

permalinks.helper('prefix', function(str) {
  return path.join(this.context.prefix, str);
});

permalinks.helper('upper', function(str) {
  return str.toUpperCase();
});

var structure1 = ':date1(file, "YYYY/MM/DD")/:stem/index.html';
var file1 = permalinks.format(structure1, {
  data: {date: '2017-01-01'},
  path: 'src/about.tmpl'
});

var structure2 = ':prefix((upper stem))/index.html';
var file2 = permalinks.format(structure2, {
  data: {date: '2017-01-01'},
  path: 'src/about.tmpl'
});

var structure3 = ':date2("YYYY/MM/DD")/:stem/index.html';
var file3 = permalinks.format(structure3, {
  data: {date: '2017-01-01'},
  path: 'src/about.tmpl'
});

console.log(file1);
//=> '2017/01/01/about/index.html'

console.log(file2);
//=> '2017/01/01/about/index.html'

console.log(file3);
//=> '2017/01/01/about/index.html'


console.log(permalinks.format(':name/index.html', {path: 'src/about.hbs'}));
//=> 'about/index.html'

console.log(permalinks.normalizeFile({path: 'foo.hbs'}))


console.log(permalinks.format(':name/index.html', 'src/about.hbs'));
console.log(permalinks.format(':name/index.html', {name: 'foo'}));

var permalinks = new Permalinks();
permalinks.preset('pretty', 'blog/:slugify(name)/index.html');

console.log(permalinks.format(':pretty', 'foo/bar/baz.hbs'));
//=> 'blog/baz/index.html'
console.log(permalinks.format(':pretty', 'foo/bar/qux.hbs'));
//=> 'blog/qux/index.html'
