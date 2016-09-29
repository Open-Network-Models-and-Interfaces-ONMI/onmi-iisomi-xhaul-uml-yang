var fs = require('fs');
var http = require('http');

var addToDB = true; // if false all schema info will be delete.
var dataDir = 'data';

var database = {
//  host : '192.168.178.32',
  host : '127.0.0.1',
  port : 9200,
  index : 'mwtn',
  docType : 'schema-information'
};

var checkDatabase = function(db, callback) {

  return http.get({
    host : db.host,
    port : db.port,
    path : '/'
  }, function(response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      // var parsed = JSON.parse(body);
      callback(response.statusMessage);
    });
    response.on('error', function() {
      // var parsed = JSON.parse(body);
      callback(response.statusMessage);
    });
  });
};

var checkIndex = function(db, callback) {

  return http.get({
    host : db.host,
    port : db.port,
    path : '/' + db.index
  }, function(response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      // var parsed = JSON.parse(body);
      callback(response.statusMessage);
    });
    response.on('error', function() {
      // var parsed = JSON.parse(body);
      callback(response.statusMessage);
    });
  });
};

var searchEntries = function(db, callback) {

  var body = {
      size: 999,
      query: {match_all:{}}
  };
  var bodyString = JSON.stringify(body);
  
  var headers = {
      'Content-Type': 'application/json',
      'Content-Length': bodyString.length
  };

  var opts = {
      host : db.host,
      port : db.port,
      method : 'POST',
      path : '/' + db.index + '/' + db.docType + '/_search',
      headers : headers
  };

  var req = http.request(opts, function(response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      var data = JSON.parse(body);
      callback(response.statusMessage, data);
    });
  });  
  req.on('error', function(e) {
    console.log("Got error: " + e.message);
  });
  req.write(bodyString);
  req.end();
};

var removeEntry = function(db, id, callback) {

  var headers = {
      'Content-Type': 'application/json'
  };

  var opts = {
    host : db.host,
    port : db.port,
    method : 'DELETE',
    path : '/' + db.index + '/' + db.docType + '/' + id,
    headers : headers
  };

  var req = http.request(opts, function(response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      var data = JSON.parse(body);
      // console.log('remove ok11');
      callback(response.statusMessage, data);
    });
  });
  req.on('error', function(e) {
    console.log("Got error: " + e.message);
  });
  req.end();
};

var createEntry = function(db, key, value) {

  var bodyString = JSON.stringify(value);
  
  var headers = {
      'Content-Type': 'application/json',
      'Content-Length': bodyString.length
  };

  var opts = {
    host : db.host,
    port : db.port,
    method : 'PUT',
    path : '/' + db.index + '/' + db.docType + '/' + key + '/_create',
    headers : headers
  };

  var req = http.request(opts, function(response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      var data = JSON.parse(body);
      // callback(response.statusMessage, data);
    });
  });  
  req.on('error', function(e) {
    console.log("Got error: " + e.message);
  });
  req.write(bodyString);
  req.end();
};

//createEntry(database, 'key', {value:'value'}, function(createStatus){
//  console.log('create', createStatus);
//});

checkDatabase(database, function(dbStatus) {
  console.log('database', dbStatus);
  if (dbStatus === 'OK') {
    checkIndex(database, function(status) {
      console.log('index', status);
      if (status === 'OK') {
        searchEntries(database, function(searchStatus, data) {

          console.log('search', searchStatus, JSON.stringify(data));
          
          if (!addToDB) {
            data.hits.hits.map(function(hit) {
              console.log(JSON.stringify(hit));
              removeEntry(database, hit._id, function(removeStatus) {
                // console.log('remove', removeStatus);
              });
              
            });
          }

          
          if (addToDB)
          fs.readdir([__dirname, dataDir].join('/'), function(err, files) {
            if (err) {
              console.error(err);
              return;
            }
            files.filter(function(file) {
              return file.slice(-5) === '.json';
            }).map(function(file) {
              filename = [__dirname, dataDir, file].join('/');
              console.log();
              console.log(filename);
              fs.readFile(filename, 'utf-8', function(err, contents) {
                var json = JSON.parse(contents);
                Object.keys(json[database.docType]).map(function(key) {
                  var value = json[database.docType][key];
                  // console.log(JSON.stringify(value));
                  createEntry(database, key, value);
                });
              });
            });
          });
        });
      }
    });
  }
});
