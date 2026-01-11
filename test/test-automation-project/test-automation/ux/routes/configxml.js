/*
 * getconfigxml.js - Web Service - to retrive topology information from config.json file.
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
var parseString = require('xml2js').parseString;

/* GET users listing. */
router.get('/', function(req, res, next) {
	var operation = req.query['operation'];
	if(operation == 'get'){
		try{

			var data = fs.readFileSync(__dirname+'/../../automated_tests'+test_case['NetConfDataXml'], 'utf8');
			res.json({jsonData: data.toString()});
		}catch(e){
			res.json({jsonData: e.toString()});
		}
	}else if(operation == 'set'){

	}



});

router.post('/post', function(req, res, next){
	var xmlData = req.body['xmlData'];
	var operation = req.body['operation'];



	parseString(xmlData, function (err, result) {
		if(err != null){
			res.json({responseData: "xml_invalid"});
			return console.log(err);
		}
		var xml_special_to_escaped_one_map = {
			'&': '&amp;',
			'"': '&quot;',
			'<': '&lt;',
			'>': '&gt;'
		};

		var escaped_one_to_xml_special_map = {
			'&amp;': '&',
			'&quot;': '"',
			'&lt;': '<',
			'&gt;': '>'
		};

		function encodeXml(string) {
			return string.replace(/([\&"<>])/g, function(str, item) {
				return xml_special_to_escaped_one_map[item];
			});
		};

		function decodeXml(string) {
			return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
				function(str, item) {
					return escaped_one_to_xml_special_map[item];
				});
		}
		if(operation == 'set'){

			fs.writeFile(__dirname+'/../../automated_tests'+test_case['NetConfUserDataXml'], decodeXml(xmlData), function(err) {
				if(err) {
					res.json({responseData: "error"});
					return console.log(err);
				}

				res.json({responseData: "OK"});
			});

		}
	});




});








module.exports = router;


