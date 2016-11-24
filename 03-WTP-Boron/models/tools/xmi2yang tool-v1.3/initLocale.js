var fs = require('fs');


var i = 0;
var files = fs.readdirSync(__dirname + '/project');
var attributes = [];
var locale = {};

files.filter(function(file) {
  return file.slice(-5) === '.json' && file.indexOf('locale-en_US.json') === -1;
}).map(function(file) {
  filename = [__dirname, 'project',file].join('/');
  console.log();
  console.log(filename);
  var json = JSON.parse(fs.readFileSync(filename, 'utf-8'));
  Object.keys(json['schema-information']).map(function(key){
    attributes.push(key);
  });
});

attributes.sort(function(a,b){
  if (a.toUpperCase() > b.toUpperCase()) return 1;
  if (a.toUpperCase() < b.toUpperCase()) return -1
  return 1;
});
console.log(attributes);
console.log(attributes.length);

attributes.map(function(attribute){
  var labelId = ['mwtn', attribute].join('_').toUpperCase();
  locale[labelId] = attribute;
});

fs.writeFile(__dirname + '/project/locale-en_US.json', JSON.stringify(locale, null, ' '), function(err) {
  if(err) {
      return console.log(err);
  }

  console.log("The file was saved!");
}); 
console.log(JSON.stringify(locale, null, ' '));
