/*
 * gettopology.js - Web Service - to retrive topology information from config.json file.
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
var fs = require("fs");
var sync = require('synchronize');
var configJson = require('../../config.json');
/* GET users listing. */
router.get('/', function(req, res, next) {
try{
	var data = JSON.stringify(configJson.topology);
	res.json({jsonData: data.toString()});
}catch(e){
	res.json({jsonData: e.toString()});
}    
});

module.exports = router;


