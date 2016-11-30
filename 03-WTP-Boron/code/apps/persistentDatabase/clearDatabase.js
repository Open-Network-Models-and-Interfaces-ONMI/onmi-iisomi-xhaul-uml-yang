var fs = require('fs');
var util = require('./util.js');
var database = require('./config.json');


var deleteHit = function(item, index, done) {
  util.removeEntry(database, item._type, item._id, function(status, data){
    console.log(item._type, item._id, 'deleted', status);
    done();
  });
};

var deleteDatabase = function(database) {
  database.docTypes.map(function(docType){
    util.searchEntries(database, docType,  function(searchStatus, data) {
      util.doSynchronousLoop(data.hits.hits, deleteHit, function(){
        console.log('done', docType);
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
        deleteDatabase(database);
      } else {
        console.log('Nothing to clear ;)');
      }
    });
  }
});
