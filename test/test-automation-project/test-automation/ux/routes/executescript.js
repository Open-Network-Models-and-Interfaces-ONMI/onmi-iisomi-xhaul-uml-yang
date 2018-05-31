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
var processId = null;
/* GET users listing. */
router.get('/', function(req, res, next) {
    var jsfile = req.query['jsfile'];
    var mediatorNameandId = req.query['mediatorNameandId'];
    var execute = req.query['execute'];
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
        var cmd = "node "+basescriptDir+jsfile + " " + mediator_index;
    }else if(jsfile == '04-netconfserver-YANG.js' && execute == "true"){
        var cmd = "node "+basescriptDir + '04.2-netconf-YANG-ConfigurableData.js'+ " " + mediator_index;
    }else if(jsfile == '04-netconfserver-YANG.js'){
        var cmd = "node "+basescriptDir + '04.1-netconf-YANG-ConfigurableData.js'+ " " + mediator_index;
    }else{
        var cmd = "node "+basescriptDir+jsfile+ " " + mediator_index;
    }
    console.log(cmd);
    
	if(processId != null){
		var killCmd = "kill -9 "+processId + " " +(processId+1);
		console.log(killCmd);
		spawn(killCmd, function(error, stdout, stderr){
			if(error !== null){
				console.log("process not killed" + error);			
			}
			console.log("process killed !"+ killCmd);			
	
		});
	}

    var proObj = spawn(cmd, function(error, stdout, stderr){
        if(error !== null){
            res.json({status: true, messageObj : [error, stdout, stderr]});
            return;

        }
        res.json({status: true, messageObj : stdout});
	processId = null;
    });

	processId = proObj.pid;
	console.log(processId);	
	

});

module.exports = router;
