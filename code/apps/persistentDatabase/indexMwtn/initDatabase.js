/* Basic initialization of index mwtn
*/

var activeConfig='../activeConfigExamples/sdnpoc4'
var fs = require('fs');
var util = require('./util.js');
var database = require(activeConfig+'/config.json');
var basicDB = {host:database.host, port:database.port, index:"mwtn"};
var modelFolder = ['modelDescription'];
var docs =  database.docTypes;

var subFolders = modelFolder;

for (var i = 0; i < docs.length; i++) {
    subFolders.push( activeConfig+'/'+docs[i]);
}

var createHit = function(item, i, done) {
  util.createEntry(basicDB, item._type, item._id, item._source, function(status, data) {
    // console.log(item._type, item._id, 'created', status);
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
              //console.log(workOn);
              modifyDatabaseOneType(workOn, json, docType );
              /*
              var array = Object.keys(json[docType]).map(function(key) {
                return {
                  _id : key,
                  _type : docType,
                  _source : json[docType][key] };
              });
              util.doSynchronousLoop(array, createHit, function(){
                console.log(' -> done');
              });
              */
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
    util.checkIndex(database, function(status) {
      console.log('index', database.index, status, ' (created if not found)');
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
