/*
 * 03-test-events.js - MWT Envent Handling Unit Test
 *
 * Copyright (C) 2016 HCL Tecnologies
 *
 * Author: Paolo Rovelli <paolo.rovelli@hcl.com>  
 */

var chai = require("chai");
var things = require('chai-things');
var async = require("async");
var supertest = require('supertest');
var websocket = require('websocket');
var WebSock = websocket.w3cwebsocket;
var assert = chai.assert;
var expect = chai.expect;
chai.should();
chai.use(things);

var config = require('../config.json');

/* SDN Controller */
var controller = supertest.agent('http://' +
    config[config.topology[0].type].user + ':' +
    config[config.topology[0].type].passwd + '@' +
    config[config.topology[0].type].ip + ':' +
    config[config.topology[0].type].port);
var restconf = '/restconf/config/network-topology:network-topology';
var restoper = '/restconf/operational/network-topology:network-topology';

/* Main Model */
var model = 'MicrowaveModel-Notifications';
var revision = '2016-03-20';

var nodes = [];

/* check the network elements */
describe('Each Network Element:', function() {

    it('should support the MicrowaveModel-Notifications capability', function(done) {
        controller
        .get(restoper + '/topology/topology-netconf')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if (err) {
                return done(err);
            }

            /* expect at least two nodes (the controller and one device) */
            expect(res.body['topology'][0])
                .to.exist
                .to.be.an('object')
                .to.have.property('node')
                .to.be.an('array')
                .to.have.length.above(1);

            /* expect each network element supports the MicrowaveModel */
            res.body['topology'][0]['node'].forEach(function(node) {
                expect(node)
                    .to.be.an('object')
                    .to.have.property('node-id');
                if (node['node-id'] !== 'controller-config') {
                    expect(node)
                        .to.have.property('netconf-node-topology:' +
                            'available-capabilities')
                        .to.have.property('available-capability')
                        .to.be.an('array')
                        .to.include('(uri:onf:' + model + '?' +
                            'revision=' + revision + ')' + model);

                    /* save node-id, to be used in further tests */
                    nodes.push({ 'node-id' : node['node-id'] });
                }
            });

            done();
        });
    });
});

/* check the event management */
describe('SDN Controller', function() {

    it('should support websocket for notifications', function(done) {
 
        var socket = new WebSock('ws://admin:admin@localhost:8085/websocket');

        socket.onopen = function() {
            if (socket.readyState === socket.OPEN) {
                var data = {
                    'data' : 'scopes',
                    'scopes' : [ 
                        "ObjectCreationNotification",
                        "ObjectDeletionNotification",
                        "AttributeValueChangedNotification",
                        "ProblemNotification"
                    ]
                };
                socket.send(JSON.stringify(data));
            }
        };
        
        socket.onmessage = function(e) {
            if (typeof e.data === 'string') {
                done();
            }
        };
    });

});

