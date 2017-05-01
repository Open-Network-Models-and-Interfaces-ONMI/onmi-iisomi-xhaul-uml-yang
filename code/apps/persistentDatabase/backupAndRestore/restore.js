var fs = require('fs');
var util = require('./util.js');
var database = require('../activeConfig/config.json');

var createHit = function(item, i, done) {
  var db = JSON.parse(JSON.stringify(database));
  db.index = item._index;
  util.createEntry(db, item._type, item._id, item._source, function(status, data) {
    // console.log(item._index, item._type, item._id, 'created', status);
    done();
  });
};

util.checkDatabase(database, function(dbStatus) {
  console.log('database', database.host, dbStatus);
  if (dbStatus === 'OK') {
    // perform some checks
    var restoreDir = [__dirname, '..', 'activeFromDB', restore'].join('/');
    var restoreDataDir = [__dirname, '..', 'activeFromDB', restore', 'data'].join('/');
    var restoreMappingFile = [__dirname, '..', 'activeFromDB', restore', 'mapping.json'].join('/');

    fs.stat(restoreDir, function(err, stats) {
      if (err) {
        console.error(err);
        console.info('ERROR: Please rename a previous backuped folder to "restore".');
        return;
      };

      fs.stat(restoreDataDir, function(err, stats) {
        if (err) {
          console.error(err);
          console.info('ERROR: Please rename a previous backuped folder to "restore". The "restore" folder must include a "data" folder');
          return;
        };
      });

      fs.stat(restoreMappingFile, function(err, stats) {
        if (err) {
          console.error(err);
          console.info('ERROR: Please rename a previous backuped folder to "restore". The "restore" folder must include a "mapping.json" file');
          return;
        };
      });
    });

    var restoreData = function() {
      fs.readdir(restoreDataDir, function(err, files) {
        if (err) {
          console.error(err);
          return;
        }
        files.filter(function(file) {
          return file.slice(-5) === '.json';
        }).map(function(file) {
          var filename = [restoreDataDir, file].join('/');
          console.log(file, 'restoring...');

          fs.readFile(filename, 'utf-8', function(err, contents) {
            var array = JSON.parse(contents);
            util.doSynchronousLoop(array, createHit, function(){
              console.log('done');
            });
          }); 
        });
      });
    };

    fs.readFile(restoreMappingFile, 'utf8', function(err, data) {  
      if (err) throw err;
      var mapping = JSON.parse(data);
      var indexes = Object.keys(mapping);
      indexes.map(function(index){
        var check = JSON.parse(JSON.stringify(database));
        check.index = index;
        util.checkIndex(check, function(status) {
          console.log('index', check.index, status);
          if (status !== 'OK') {
            util.createIndex(check, function(success){
              if (!success) {
                console.log('The index mwtn could not be created within the DB.');
                return;
              }   
           });
         }
        });
      });
      restoreData();
    });
  }
});
