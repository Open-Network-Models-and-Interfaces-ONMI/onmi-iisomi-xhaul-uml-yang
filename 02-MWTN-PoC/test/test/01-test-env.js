/*
 * 01-test-env.js - MWT Environment Unit Test
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

/* check the test environment */
describe('Environment:', function() {

    it('should check the Restconf feature enabled', function(done) {
        controller
        .get(restoper)
        .expect(200)
        .end(function(err, res) {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    it('should check the Netconf feature enabled', function(done) {
        controller
        .get(restoper + '/topology/topology-netconf')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if (err) {
                return done(err);
            }

            /* expect a netconf topology type */
            expect(res.body['topology'])
                .to.exist
                .to.be.an('array');
            expect(res.body['topology'][0])
                .to.exist
                .to.be.an('object')
                .to.have.property('topology-id')
                .to.be.equal('topology-netconf');

            done();
        });
    });

    it('should check any Network Element connected', function(done) {
        controller
        .get(restoper + '/topology/topology-netconf')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
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
            
            /* expect each node is connected */
            res.body['topology'][0]['node'].forEach(function(node) {
                expect(node)
                    .to.be.an('object')
                    .to.have.property('node-id');
                expect(node)
                    .to.be.an('object')
                    .to.have.property('netconf-node-topology:connection-status')
                    .to.be.equal('connected');
            });

            done();
        });
    });

});
