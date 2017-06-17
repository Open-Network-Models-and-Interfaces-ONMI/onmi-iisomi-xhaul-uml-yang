/*
 * index.js - Index page of ONF-POC3 Test Automation Framework
 *
 * Copyright (C) 2016 HCL Tecnologies
 *
 * Authors: HCL SDN & NFV CoE Team
 *
 * Contact: paolo.spallaccini@hcl.com
 *
*/
var express = require('express');
var router = express.Router();
var configJson = require('../../config.json');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ONF-POC3 Test Automation Framework', mediatorData : JSON.stringify(configJson.topology) } );
});

module.exports = router;
