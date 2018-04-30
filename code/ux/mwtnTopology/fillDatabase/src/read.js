var fs = require('fs');
var util = require('./util.js');
var database = require('./config.json');

var show = function(response, data) {
  var docTypes = Object.keys(data[database.index].mappings);
  var content = {};
  docTypes.map(function(docType){

    content[docType] = {};
    util.searchEntries(database, docType, function(searchStatus, data) {
      data.hits.hits.map(function(hit) {
        // console.log(JSON.stringify(hit));
        content[docType][hit._id] = hit._source;  
      });
      console.log(JSON.stringify(content[docType], null, ' '));
    });
  });
};

util.checkDatabase(database, function(dbStatus) {
  console.log('database', dbStatus);
  if (dbStatus === 'OK') {
    util.checkIndex(database, function(response, data) {
      console.log('index', response.statusMessage);
      if (response.statusMessage === 'OK') {
        show(response, data);
      } else {
        console.log('Required index does not exist in database, nothing to show.');
      }
    });
  }
});
