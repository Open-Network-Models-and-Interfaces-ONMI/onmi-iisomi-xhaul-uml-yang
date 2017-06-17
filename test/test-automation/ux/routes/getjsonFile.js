/*
 * getjsonFile.js - Web Service - to retrive log from TestResult.log file
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
var test_case = require('../../automated_tests/input/test-cases.json');
/* GET users listing. */
router.get('/', function(req, res, next) {
try{
	var jsonfile = req.query['jsonfile'];
	var data = fs.readFileSync(__dirname+'/../../automated_tests'+test_case[jsonfile], 'utf8');
	res.json({jsonData: data.toString()});
}catch(e){
	res.json({jsonData: e.toString()});
}    
});

module.exports = router;


