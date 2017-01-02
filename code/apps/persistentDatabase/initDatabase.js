var fs = require('fs');
var util = require('./util.js');
var database = require('./config.json');

var siteLinks = {};
var mwpsLinks = {};

var analyseSiteLink = function(ne) {
  Object.keys(ne).map(function(node){
    ne[node]['MW_AirInterface_Pac'].map(function(mwps){
      var siteId = ne[node].siteRef;
      var id = mwps.airInterfaceConfiguration.radioSignalID;

      if (!mwpsLinks[id]) {
        mwpsLinks[id] = {mwps:[], siteLink: []}; 
      }
      mwpsLinks[id].siteLink.push(siteId);
      mwpsLinks[id].mwps.push({node:node, mwpsId: mwps.layerProtocol});
      if (mwpsLinks[id].siteLink.length === 2) {
        mwpsLinks[id].siteLink.sort(function(a, b){
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
        var siteLinkId = mwpsLinks[id].siteLink.join('-');
        if (!siteLinks[siteLinkId]) {
          siteLinks[siteLinkId] = {id: siteLinkId, sites: mwpsLinks[id].siteLink}; 
          util.createEntry(database, 'site-link', siteLinkId, siteLinks[siteLinkId], function(status, data, response) {
            console.info('site-link', siteLinkId, 'created', status);
          });
        } 
      }
    });
  });
};

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
        if (docType === 'required-networkelement') {
          analyseSiteLink(json[docType]);
        }
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

