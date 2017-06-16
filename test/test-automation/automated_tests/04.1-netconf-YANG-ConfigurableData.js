/*
 * 04.1-netconf-YANG-ConfigurableData.js - Gets capability and running config from OEM WT mediator 
 *
 * Copyright (C) 2017 HCL Technologies
 *
 * Authors: HCL SDN & NFV CoE Team
 *
 * Contact: paolo.spallaccini@hcl.com
 *          saurabhchattopadhya@hcl.com
 *
 */


var yang = require("yang-js");
var fs = require('fs');
var supertest = require('supertest');
var config = require('../config.json');
var test_cases = require('./input/test-cases.json');
var debug = require('./netconf_client/core/debug.js');
var mediatorIndex = "";

mediatorIndex = process.argv.slice(2);

var sync = require('synchronize');

var clientFileHandle;
var capabilityFileHandle;
var dataFileHandle;


var netConfDataFile = __dirname + test_cases["NetConfDataFile"];
var netConfCapabilityXml = __dirname + test_cases["NetConfCapabilityXml"];
var netConfDataXml = __dirname + test_cases["NetConfDataXml"];


var Client = require('ssh2').Client;

xmlhello = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<hello xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">' +
    '    <capabilities>' +
    '     <capability>urn:ietf:params:netconf:base:1.0</capability>' +
    '  </capabilities>' +
    '</hello>]]>]]>';


var xmlhello1 = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<rpc message-id="105" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">' +
    '<get-config>' +
    '<source>' +
    '<running/>' +
    '</source>' +
    '</get-config>' +
    '</rpc>]]>]]>';


var writeSync = function (msg, to_console, to_file) {
    if (!msg) {
        return;
    }

    fs.writeFileSync(to_file, msg + require('os').EOL);
};


sync.fiber(function () {

    clientFileHandle = fs.openSync(netConfDataFile, "w")
    capabilityFileHandle = fs.openSync(netConfCapabilityXml, "w");
    dataFileHandle = fs.openSync(netConfDataXml, "w");

    sync.await(netconfCAll(sync.defers()));

    fs.closeSync(clientFileHandle);
    fs.closeSync(capabilityFileHandle);
    fs.closeSync(dataFileHandle);

    process.exit(0);


});


function netconfCAll(cb) {

    var conn = new Client();

    if (mediatorIndex == "") {
        mediatorIndex = "1";
    }


    conn.on('ready', function () {
        //console.log('Client :: ready');
        conn.subsys('netconf', function (err, stream) {

            if (err) throw err;
            var reply = "";

            stream.on('data', function (data) {
                // console.log(data.toString('utf8'));

            }).write(xmlhello);

            stream.on('data', function (data) {

                reply += data;

                //console.log(data.toString('utf8'));


                if (reply.toString('utf8').endsWith("</rpc-reply>]]>]]>")) {

                    writeSync(reply.toString('utf8'), true, clientFileHandle);
                    splitXmlData(reply.toString('utf8'));

                }


            }).write(xmlhello1);

            setTimeout(function () {

                // remember that callbacks expect (err, result)
                cb(null);

            }, 1000)


        });

    }).connect({

        host: config[config.topology[mediatorIndex].type].ip,
        port: config[config.topology[mediatorIndex].type].port,
        username: config[config.topology[mediatorIndex].type].user,
        password: config[config.topology[mediatorIndex].type].passwd
    });


}


function splitXmlData(str) {


    var index = str.indexOf("</hello>]]>]]>");
    var cap = str.substr(0, index + 8);
    var len = str.length - index - 20;

    var data = str.substr(index + 14, len);

    writeSync(cap, true, capabilityFileHandle);
    writeSync(data, true, dataFileHandle);

}


