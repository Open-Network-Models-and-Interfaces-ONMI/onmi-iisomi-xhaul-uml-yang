/*
 * executescript.js - Web Service - to execute javascript via shell
 *
 * Copyright (C) 2016 HCL Tecnologies
 *
 * Authors: HCL SDN & NFV CoE Team
 *
 * Contact: paolo.spallaccini@hcl.com
 *
*/
var express = require('express');
var fs = require('fs');
var router = express.Router();
var spawn = require("child_process").exec;
var sync = require('synchronize');
/*var test_case = require('../../automated_tests/input/test-cases.json');*/
var basescriptDir = './automated_tests/';
/* GET users listing. */
router.get('/', function(req, res, next) {
    var jsfile = req.query['jsfile'];
    var mediatorNameandId = req.query['mediatorNameandId'];
    var mediator_arr = mediatorNameandId.split("keyvalue:");
    var mediator_name = mediator_arr[0];
    var mediator_index = mediator_arr[1];
    
    sync.fiber(function() {
	  var test_case_string = fs.readFileSync(__dirname+"/../../automated_tests/input/test-cases.json", 'utf8');
	  var test_case = JSON.parse(test_case_string);
	  test_case.nodeName = mediator_name;
      fs.writeFileSync(__dirname+"/../../automated_tests/input/test-cases.json", JSON.stringify(test_case, null, 2));
    });
    if(jsfile == '01-standalone-YANG-parser.js'){
        var cmd = "node "+basescriptDir+jsfile;
    }else{
        var cmd = "node "+basescriptDir+jsfile+ " " + mediator_index;
    }
    console.log(cmd);
    spawn(cmd, function(error, stdout, stderr){
        if(error !== null){
            res.json({status: false, messageObj : [error, stdout, stderr]});
            return;

        }
        res.json({status: true, messageObj : stdout});
    });

});

module.exports = router;
