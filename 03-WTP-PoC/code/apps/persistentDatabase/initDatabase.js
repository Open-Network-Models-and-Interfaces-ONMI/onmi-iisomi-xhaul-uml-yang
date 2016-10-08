var fs = require('fs');
var util = require('./util.js');
var database = require('./config.json');

var addToDB = true;

var modifyDatabase = function(database) {
    util.searchEntries(database, 'schema-information',  function(searchStatus, data) {

      console.log('search', searchStatus, JSON.stringify(data));
      
      if (!addToDB) {
        data.hits.hits.map(function(hit) {
          console.log(JSON.stringify(hit));
          util.removeEntry(database, hit._id, function(removeStatus) {
            // console.log('remove', removeStatus);
          });
          
        });
      }

      
      if (addToDB)
      fs.readdir([__dirname, database.in].join('/'), function(err, files) {
        if (err) {
          console.error(err);
          return;
        }
        files.filter(function(file) {
          return file.slice(-5) === '.json';
        }).map(function(file) {
          filename = [__dirname, database.in, file].join('/');
          console.log();
          console.log(filename);
          fs.readFile(filename, 'utf-8', function(err, contents) {
            var json = JSON.parse(contents);
            var docType = Object.keys(json)[0];
            Object.keys(json[docType]).map(function(key) {
              var value = json[docType][key];
              // console.log(JSON.stringify(value));
              util.createEntry(database, key, value);
            });
          });
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
        modifyDatabase(database);
      } else {
        util.createIndex(database, function(success){
          if (success) {
            modifyDatabase(database);
          } else {
            console.log('The index mwtn could not be created within the DB.');
          }   
        });
      }
    });
  }
});
