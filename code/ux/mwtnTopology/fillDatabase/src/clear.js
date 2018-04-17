var fs = require('fs');
var util = require('./util.js');
var database = require('./config.json');

var deleteDatabase = function (database) {
  util.deleteIndex(database, function (dbStatus) {
      console.log(database.host, database.index, "deleted!");  
  });
};

util.checkDatabase(database, function (dbStatus) {
  console.log('database', dbStatus);
  if (dbStatus === 'OK') {
    util.checkIndex(database, function (response) {
      console.log('index', response.statusMessage);
      if (response.statusMessage === 'OK') {
        deleteDatabase(database);
      } else {
        console.log('Nothing to clear ;)');
      }
    });
  }
});
