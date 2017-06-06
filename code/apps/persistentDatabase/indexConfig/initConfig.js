/* Basic initialization of index config
 */

var fs = require('fs');
var util = require('./util.js');
var database = require('../activeConfigExamples/sdnpoc4/config.json');
var basicDB = {host: database.host, port: database.port, index: "config"};

var createBasicHit = function (item, i, done) {
    util.createEntry(basicDB, item._type, item._id, item._source, function (status, data) {
        // console.log(item._type, item._id, 'created', status);
        done();
    });
};


// basic configuration
var modifyBasicDatabase = function (basicDB) {
    var folder = 'config';
    fs.readdir([__dirname, '..', 'activeConfigExamples', 'sdnpoc4', folder].join('/'), function (err, files) {
        if (err) {
            console.error(err);
            return;
        }
        files.filter(function (file) {
            return file.slice(-5) === '.json';
        }).map(function (file) {
            var filename = [__dirname, '..', 'activeConfigExamples', 'sdnpoc4', folder, file].join('/');
            console.log('    Read file: ', filename);
            fs.readFile(filename, 'utf-8', function (err, contents) {
                var json = JSON.parse(contents);
                var docType = Object.keys(json)[0];
                console.log('    Doctype start: ', docType);
                var array = Object.keys(json[docType]).map(function (key) {
                    return {
                        _id: key,
                        _type: docType,
                        _source: json[docType][key]
                    };
                });
                util.doSynchronousLoop(array, createBasicHit, function () {
                    console.log('    Doctype done: ', docType);
                });
            });
        });
    });
};


util.checkDatabase(basicDB, function (dbStatus) {
    console.log('Work with database ', basicDB.host, ' DB status: ', dbStatus);
    if (dbStatus === 'OK') {
        util.checkIndex(basicDB, function (status) {
            console.log('  Index:', basicDB.index, '  Index status: ', status);
            if (status === 'OK') {
                console.log('  Index exists -> modify.');
                modifyBasicDatabase(basicDB);
            } else {
                console.log('  Index create.');
                util.createIndex(basicDB, function (success) {
                    if (success) {
                        modifyBasicDatabase(basicDB);
                    } else {
                        console.log('The index mwtn could not be created within the DB.');
                    }
                });
            }
        });
    }
});


