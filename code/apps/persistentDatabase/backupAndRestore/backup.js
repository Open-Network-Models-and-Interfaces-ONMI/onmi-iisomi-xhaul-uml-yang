var fs = require('fs');
var util = require('./util.js');
var database = require('../activeConfig/config.json');

var folderName = new Date().toISOString();
var folderPath = [__dirname, '..', 'activeFromDB', folderName].join('/');

console.log(folderPath);
fs.mkdirSync(folderPath);
fs.mkdirSync(folderPath + '/data');

util.checkDatabase(database, function(dbStatus) {
  console.info('database', database.host, dbStatus);
  if (dbStatus === 'OK') {

    util.readStructure(database, function(data) {

      // save mapping
      var filename = [folderPath, 'mapping.json'].join('/');
      fs.writeFile(filename, JSON.stringify(data, null, ' '), function(err) {
        if(err) {
          return console.log(err);
        }
        console.log('The file mapping.json was saved!');
      }); 

      var indexes = Object.keys(data);
      console.info('indexes', indexes);
  
      indexes.sort().map(function(index){
        var docTypes = Object.keys(data[index].mappings)
        console.info('  docTypes', index, docTypes.sort());
    
        docTypes.map(function(docType){
          console.info('    ' + docType);
          var item = {
            database: database,
            index: index,
            docType: docType
          };
          util.readEntries(item, function(response) {
            // saveing data for index/docType
            var filename = [response.index, response.docType, 'json'].join('.');
            var path = [folderPath, 'data', filename].join('/');
            fs.writeFile(path, 
                         JSON.stringify(response.hits, null, ' '), function(err) {
              if(err) {
                return console.log(err);
              }
              console.log('saved:', filename, response.hits.length);
            });
          });
        });
      });
    });
  }
});
