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

/* SDN Controller - RESTconf */
var controller = supertest.agent('http://' +
    config[config.topology[0].type].user + ':' +
    config[config.topology[0].type].passwd + '@' +
    config[config.topology[0].type].ip + ':' +
    config[config.topology[0].type].port);
var restconf = '/restconf/config/network-topology:network-topology';
var restoper = '/restconf/operational/network-topology:network-topology';

/* SDN Controller - Websocket */
var endpoint = 'ws://' +
    config[config.topology[0].type].user + ':' +
    config[config.topology[0].type].passwd + '@' +
    config[config.topology[0].type].ip + ':' + '8085' + '/websocket';
var events = {
    'data' : 'scopes',
    'scopes' : [
        'ObjectCreationNotification',
        'ObjectDeletionNotification',
        'AttributeValueChangedNotification',
        'ProblemNotification'
     ]
};

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
                    nodes.push({ 'node-id' : node['node-id'], 'event-count' : 0 });
                }
            });

            done();
        });
    });
});

/* check the event management */
describe('SDN Controller', function() {

    it('should expose the WebSocket notification EndPoint', function(done) {
 
        var socket = new WebSock(endpoint);

        socket.onopen = function() {
            if (socket.readyState === socket.OPEN) {
                socket.send(JSON.stringify(events));
            }
        };
        
        socket.onmessage = function(e) {
            if (typeof e.data === 'string' &&
                       e.data.indexOf('connected') >= 0 &&
                       e.data.indexOf(JSON.stringify(events)) >= 0) {
                done();
            }
        };
    });

    it('should send notification events over WebSocket', function(done) {
        this.timeout(10000 * 1.25);

        var socket = new WebSock(endpoint);
        var state = 'closed';

        socket.onopen = function() {
            if (socket.readyState === socket.OPEN) {
                state = 'open';
                socket.send(JSON.stringify(events));
            }
        };

        socket.onmessage = function(e) {
            if (state === 'open' &&
                    e.data.indexOf('connected') >= 0 &&
                    e.data.indexOf(JSON.stringify(events)) >= 0) {
                state = 'connected';
            } else if (state === 'connected') {
                /* update event count */
                nodes.forEach(function(node) {
                    var attr = '<nodeName>' + node['node-id'] + '</nodeName>';
                    if (e.data.indexOf(attr) >= 0) {
                        node['event-count']++;
                    }
                });
                /* check at least one event for each network element */
                if (nodes.filter(function(node) { 
                    if (node['event-count'] > 0) {
                        return false; 
                    }
                    return true;
                }).length === 0) {
                    done();
                }
            }
        };
    });

});

