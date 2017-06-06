var fs = require('fs');
var util = require('../util.js');
var basicDB = {host:'localhost', port:9200, index:"mwtn"};

var createHit = function(item, i, done) {
  util.createEntry(basicDB, item._type, item._id, item._source, function(status, data) {
    console.log(item._type, item._id, item._source['order-number'], 'created', status);
    done();
  });
};

fs.readdir(__dirname, (err, files) => {
  files.filter(function (file) {
    return file.endsWith('.schema-information.json');
  }).map(function (file) {
    return JSON.parse(fs.readFileSync([__dirname, file].join('/'), 'utf8'));
  }).map(function (json) {
    var docType = 'schema-information';
    var array = Object.keys(json[docType]).map(function (key) {
      return {
        _id: key,
        _type: docType,
        _source: json[docType][key]
      };
    });
    util.doSynchronousLoop(array, createHit, function () {
      console.log(' -> done');
      console.log(JSON.stringify(JSON));
    });
  });
})
