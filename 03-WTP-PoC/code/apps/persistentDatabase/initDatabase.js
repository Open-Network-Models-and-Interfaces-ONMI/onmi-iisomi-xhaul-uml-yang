var fs = require('fs');
var util = require('./util.js');
var database = require('./config.json');


var createHit = function(item, i, done) {
  util.createEntry(database, item._type, item._id, item._source, function(status, data) {
    // console.log(item._type, item._id, 'created', status);
    done();
  });
};

var modifyDatabase = function(database) {

   fs.readdir([__dirname, database.in].join('/'), function(err, files) {
    if (err) {
      console.error(err);
      return;
    }
    files.filter(function(file) {
      return file.slice(-5) === '.json';
    }).map(function(file) {
      filename = [__dirname, database.in, file].join('/');
      console.log(filename);
      fs.readFile(filename, 'utf-8', function(err, contents) {
        var json = JSON.parse(contents);
        var docType = Object.keys(json)[0];
        console.log(docType);
        var array = Object.keys(json[docType]).map(function(key){
          return {
            _id : key,
            _type : docType,
            _source : json[docType][key]          };
        });
        util.doSynchronousLoop(array, createHit, function(){
          console.log('done');
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
