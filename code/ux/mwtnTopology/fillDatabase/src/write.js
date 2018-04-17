/* Basic initializationn
*/

var fs = require('fs');
var util = require('./util.js');
var database = require('./config.json');
var subFolders = ['../data'];

var createHit = function(item, i, done) {
  util.createEntry(database, item._type, item._id, item._source, function(status, data) {
    if (status !== 'OK') {
      console.log(item._type, item._id, 'created', status, JSON.stringify(data));
    }
    done();
  });
};

var modifyDatabase = function(database) {
   subFolders.map(function(subFolder) {
     fs.readdir([__dirname, subFolder].join('/'), function(err, files) {
       if (err) {
         console.error(err);
         return;
       }
      files.filter(function(file) {
        return file.slice(-5) === '.json';
      }).map(function(file) {
        var filename = [__dirname, subFolder, file].join('/');
        console.log('File: ',filename);
        fs.readFile(filename, 'utf-8', function(err, contents) {
          var json = JSON.parse(contents);
          for (t = 0; t < Object.keys(json).length; t++ ) {
              docType = Object.keys(json)[t];
              workOn = '    -> File: '+file+'->'+docType+' Elements:'+Object.keys(json[docType]).length;
              console.log(workOn);
              modifyDatabaseOneType(workOn, json, docType );
          }
        });
      });
    });
  });
};

var modifyDatabaseOneType = function(toDo, json, docType) {

    var array = Object.keys(json[docType]).map(function(key) {
      return {
        _id : key,
        _type : docType,
        _source : json[docType][key] };
    });
    util.doSynchronousLoop(array, createHit, function() {
      console.log(toDo,' -> done');
    });

}


util.checkDatabase(database, function(dbStatus) {
  console.log('Work with database', database.host, 'DB status: ',dbStatus);
  if (dbStatus === 'OK') {
    util.checkIndex(database, function(response) {
      console.log('index', database.index, response.statusMessage, ' (created if not found)');
      if (response.statusMessage  === 'OK') {
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
