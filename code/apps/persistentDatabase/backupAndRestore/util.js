if (!String.prototype.isJsonString) {
  String.prototype.isJsonString = function() {
    try {
        JSON.parse(this);
    } catch (e) {
        console.log('check', this);
        return false;
    }
    return true;
  }
};

if (!String.prototype.toUrlValue) {
  String.prototype.toUrlValue = function() {
    // https://en.wikipedia.org/wiki/Percent-encoding
    var mapping = [
      {ascii: ' ', url: '%20'},
      {ascii: '!', url: '%21'},
      {ascii: '"', url: '%22'},
      {ascii: '#', url: '%23'},
      {ascii: '$', url: '%24'},
      {ascii: '%', url: '%25'},
      {ascii: '&', url: '%26'},
      {ascii: "'", url: '%27'},
      // {ascii: '(', url: '%28'},
      // {ascii: ')', url: '%29'},
      // {ascii: '*', url: '%2A'},
      // {ascii: '+', url: '%2B'},
      {ascii: ',', url: '%2C'},
      {ascii: '/', url: '%2F'},
      {ascii: ':', url: '%3A'},
      {ascii: ';', url: '%3B'},
      {ascii: '=', url: '%3D'},
      // {ascii: '?', url: '%3F'},
      {ascii: '@', url: '%40'},
      // {ascii: '[', url: '%5B'},
      // {ascii: '\', url: '%5C'},
      {ascii: ']', url: '%5D'},
      {ascii: '{', url: '%7B'},
      {ascii: '|', url: '%7C'},
      {ascii: '}', url: '%7D'}
    ];
    var str = this + '';
    mapping.map(function(tuple){
      var regex = new RegExp(tuple.ascii, 'g');
      str = str.replace(regex, tuple.url);
    });
    return str;
  }
};

//

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
        var data;
        if (body.isJsonString()) {
          data = JSON.parse(body);
        } else {
          data = body;
        }
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
  },

  readStructure : function(db, callback) {

    return http.get({
      host : db.host,
      port : db.port,
      path : '/_mapping'
    }, function(response) {
      var body = '';
      response.on('data', function(d) {
        body += d;
      });
      response.on('end', function() {
        var parsed = JSON.parse(body);
        callback(parsed);
      });
      response.on('error', function() {
        var parsed = JSON.parse(body);
        callback(parsed);
      });
    });
  },

  readEntries : function(options, callback) {

    var readBlockFromDatabase = function(options, callback) {
      var body = {
          from: options.from,
          size: options.size,
          query: {match_all:{}}
      };
      var bodyString = JSON.stringify(body);
    
      var headers = {
        'Content-Type': 'application/json',
        'Content-Length': bodyString.length
      };
  
      var opts = {
        host : options.database.host,
        port : options.database.port,
        method : 'POST',
        path : '/' + options.index + '/' + options.docType + '/_search',
        headers : headers,
        options : options
      };

      var req = http.request(opts, function(response) {
        var body = '';
        response.on('data', function(d) {
          body += d;
        });
        response.on('end', function() {
          var data = JSON.parse(body);
          callback({
            options: options, 
            status: response.statusMessage, 
            data: data
          });
        });
      });  
      req.on('error', function(e) {
        console.log("Got error: " + e.message);
      });
      req.write(bodyString);
      req.end();
    };

    var hits = [];
    var readBlock = function(item, i, done) {
      readBlockFromDatabase(item, function(response){
        hits = hits.concat(response.data.hits.hits);
        done();
      });
    };

    options.from = 0;
    options.size = 0;
    var item = JSON.parse(JSON.stringify(options));

    readBlockFromDatabase(item, function(response){
 
      var total = response.data.hits.total;
      var from = item.from + item.size;
      var array = [];
        
      while (from < total) {
        var clone = JSON.parse(JSON.stringify(item));
        clone.from = from;
        clone.size = 1000;
        array.push(clone);
        from = from + clone.size;
      }
      module.exports.doSynchronousLoop(array, readBlock, function(){
        item.hits = hits;
        callback(item);
      });
    });
  }
};
