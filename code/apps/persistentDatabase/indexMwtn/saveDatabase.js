var fs = require('fs');
var util = require('./util.js');
var database = require('../activeConfig/config.json');

var save = function() {
  database.docTypes.map(function(docType){

    var filename = [__dirname, database.out, docType+'.json'].join('/');
    var content = {};
    content[docType] = {};
    util.searchEntries(database, docType,  function(searchStatus, data) {
      data.hits.hits.map(function(hit) {
        // console.log(JSON.stringify(hit));
        content[docType][hit._id] = hit._source;  
      });
      fs.writeFile(filename, JSON.stringify(content, null, ' '), function(err) {
        if(err) {
          return console.log(err);
        }
        console.log('The file was saved! (' + Object.keys(content[docType]).length + ')');
      }); 
    });
  });
};

util.checkDatabase(database, function(dbStatus) {
  console.log('database', dbStatus);
  if (dbStatus === 'OK') {
    util.checkIndex(database, function(status) {
      console.log('index', status);
      if (status === 'OK') {
        save();
      } else {
        console.log('Required index does not exist in database, nothing to save.');
      }
    });
  }
});
