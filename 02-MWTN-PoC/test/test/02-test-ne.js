/*
 * 02-test-ne.js - Network Element Unit Test
 *
 * Copyright (C) 2016 HCL Tecnologies
 *
 * Author: Paolo Rovelli <paolo.rovelli@hcl.com>  
 */

var chai = require("chai");
var things = require('chai-things');
var async = require("async");
var supertest = require('supertest');
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
var model = 'MicrowaveModel-ObjectClasses-MwConnection';
var revision = '2016-03-23';

var nodes = [];
var ifaces = [];

/* check the network elements */
describe('Each Network Element:', function() {

    it('should support the MicrowaveModel capability', function(done) {
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

    it('should support the AirInterface model', function(done) {
        async.each(nodes, function(node, callback) {
            controller
            .get(restconf + '/topology/topology-netconf/node/' +
                 node['node-id'] + '/yang-ext:mount')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return callback(err);
                }

                /* expect each network element support AirInterface */
                expect(res.body[model + ':' + 'MW_AirInterface_Pac'])
                    .to.exist
                    .to.be.an('array')
                    .to.have.length.above(0);

                /* expect at least one AirInterface */
                res.body[model + ':' + 'MW_AirInterface_Pac'].forEach(function(iface) {
                    expect(iface)
                        .to.be.an('object')
                        .to.have.property('layerProtocol');
                    /* save iface-id, to be used in further tests */
                    ifaces.push({
                        'node-id' : node['node-id'],
                        'iface-id' : iface['layerProtocol']
                    });
                });

                /* done */
                callback();
            });
        }, function(err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });

    });

});

/* check the air interfaces */
describe('Each Air Interface:', function() {

    it('should support the AirInterface configuration', function(done) {
        async.each(ifaces, function(iface, callback) {
            controller
            .get(restconf + '/topology/topology-netconf/node/' +
                 iface['node-id'] + '/yang-ext:mount' + '/' +
                 model + ':' + 'MW_AirInterface_Pac/' + iface['iface-id'])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return callback(err);
                }

                /* expect each Air Interface support configuration */
                expect(res.body['MW_AirInterface_Pac'][0])
                    .to.exist
                    .to.be.an('object')
                    .to.have.property('airInterfaceConfiguration');

                /* done */
                callback();
            });
        }, function(err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });
});
