/*
 * @copyright 2017 highstreet technologies GmbH and others. All rights reserved.
 *
 * @license
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at {@link http://www.eclipse.org/legal/epl-v10.html} 
 */

if (!String.prototype.contains) {
    /**
     * An extension to String, which checks whether another string is contained.
     * @param {string} find A string to be checked, whether it is contained in 'this'.
     * @return {boolean} True, if 'this' contains param 'find', otherwise false.
     */
    String.prototype.contains = function (find) {
        return this.indexOf(find) > -1;
    };
}

if (!String.prototype.format) {
    /**
     * An extension to String, which replaces certain patterns by arguments.
     * @see {@link https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format|javascript-equivalent-to-printf-string-format}
     * @return {string} Formated string.
     */
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match
                ;
        });
    };
}

if (!String.prototype.replaceAll) {
    /**
     * An extension to String, which replaces certain patterns by arguments.
     * @see {@link https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript|how-to-replace-all-occurrences-of-a-string-in-javascript}
     * @param {string} find - The string which should be replaced.
     * @param {string} replace - The string which should replace 'find'.
     * @return {string} String where 'find' is replaced by 'replace'.
     */
    String.prototype.replaceAll = function (find, replace) {
        return this.replace(new RegExp(find, 'g'), replace);
    }
}

if (!Array.prototype.contains) {
    /**
     * An extension to Array checking whether an array of primitive types contains a given value.
     * @param {string|number|boolean|null|undefined} find An object which should be removed from the array.
     * @return {boolean} True, if 'this' contains param 'find', otherwise false..
     */
    Array.prototype.contains = function (find) {
        return this.indexOf(find) > -1;
    };
}

if (!Array.prototype.clean) {
    /**
     * An extension to Array removing defined values from an array.
     * @see {@link https://gist.github.com/waynegraham/3684627|Array.clean()}
     * @param {Object} deleteValue An object which should be removed from the array.
     * @return {Array} An array without 'deleteValue'.
     */
    Array.prototype.clean = function (deleteValue) {
        for (var i = 0; i < this.length; i++) { // TODO swtich to .map() ?
            if (this[i] === deleteValue) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    };
}

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
        if (body.startsWith('No h')) {
          callback('Error', undefined);
        } else {
          var data = JSON.parse(body);
          callback(response.statusMessage, data);
        }
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
