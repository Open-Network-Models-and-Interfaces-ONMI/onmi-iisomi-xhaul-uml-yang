var http = require('http');

module.exports = {

  checkDatabase : function(db, callback) {

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
  },
  checkIndex : function(db, callback) {

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
  },
  searchEntries : function(db, docType, callback) {

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
      path : '/' + db.index + '/' + docType + '/_search',
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
  },
  removeEntry : function(db, docType, id, callback) {

    var headers = {
      'Content-Type': 'application/json'
    };

    var opts = {
      host : db.host,
      port : db.port,
      method : 'DELETE',
      path : '/' + db.index + '/' + docType + '/' + id,
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
  },
  createEntry : function(db, docType, key, value, callback) {

    var bodyString = JSON.stringify(value);
  
    var headers = {
      'Content-Type': 'application/json',
      'Content-Length': bodyString.length
    };

    var opts = {
      host : db.host,
      port : db.port,
      method : 'PUT',
      path : '/' + db.index + '/' + docType + '/' + key,
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
  },

  doSynchronousLoop : function (data, processData, done) {
    if (data.length > 0) {
      var loop = function(data, i, processData, done) {
        processData(data[i], i, function() {
          if (++i < data.length) {
            loop(data, i, processData, done);
          } else {
            done();
          }
        });
      };
      loop(data, 0, processData, done);
    } else {
      done();
    }
  },         

  createIndex : function(db, callback) {
    var settings = {
      "settings" : {
        "index" : {
          "number_of_shards" : 5, 
          "number_of_replicas" : 1 
        }
      }
    };

    var bodyString = JSON.stringify(settings);

    var headers = {
      'Content-Type': 'application/json',
      'Content-Length': bodyString.length
    };

    var opts = {
      host : db.host,
      port : db.port,
      method : 'PUT',
      path : '/' + db.index + '/',
      headers : headers
    };

    var req = http.request(opts, function(response) {
      var body = '';
      response.on('data', function(d) {
        body += d;
      });
      response.on('end', function() {
        var data = JSON.parse(body);
        callback(true);
      });
    });  
    req.on('error', function(e) {
      callback(false);
      console.log("Got error: " + e.message);
    });
    req.write(bodyString);
    req.end();
  }
};
