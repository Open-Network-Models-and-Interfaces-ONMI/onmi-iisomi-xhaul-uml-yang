/*
 * 03-netconfserver-YANG.js - Parses and sets default values in the base mediator (DVM)
 *
 * Copyright (C) 2016 HCL Technologies
 *
 * Authors: HCL SDN & NFV CoE Team
 *
 * Contact: paolo.spallaccini@hcl.com
 *
 */

var yang = require("yang-js");
var fs = require('fs');
var supertest = require('supertest');
var config = require('../config.json');
var test_cases = require('./input/test-cases.json');
var netConfArray = [];
var globalConfigurations = [];
var typeDefArray =[];
var flag ="";
var yangArray = [];
var comma_flag = false;
var neNodeName = test_cases["nodeName"];
var baseurl = "";
var yangFromNetConf = "";
var mediatorIndex = "";
mediatorIndex = process.argv.slice(2);
var sync = require('synchronize');
var summaryFileHandle;
var testResFileHandle;
var parseDataFileHandle;
var clientFileHandle;

var controller = supertest.agent('http://' +
    config[config.topology[0].type].user + ':' +
    config[config.topology[0].type].passwd + '@' +
    config[config.topology[0].type].ip + ':' +
    config[config.topology[0].type].port);


var restconf = '/restconf/config/network-topology:network-topology';


var TestResultFile = __dirname+test_cases["TestResultFile"];
var netConfDataFile = __dirname+test_cases["NetConfDataFile"];
var parseDataFile = __dirname+test_cases["ParseDataFile"];
var summaryFile = __dirname+test_cases["SummaryReportFile03"];


var Client = require('ssh2').Client;
xmlhello = '<?xml version="1.0" encoding="UTF-8"?>'+
    '<hello xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">'+
    '    <capabilities>'+
    '     <capability>urn:ietf:params:netconf:base:1.0</capability>'+
    '  </capabilities>'+
    '</hello>]]>]]>';

var xmlhello1 = '<?xml version="1.0" encoding="UTF-8"?>'+
    '<rpc message-id="105" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">'+
    '<get-config>'+
    '<source>' +
    '<running/>' +
    '</source>'+
    '</get-config>'+
    '</rpc>]]>]]>';

var appendSync = function(msg, to_file)
{
    if (!msg){
        return;
    }
    fs.appendFileSync(to_file, msg  + require('os').EOL);
};

var writeSync = function(msg, to_file)
{
    if (!msg){
        return;
    }
    fs.writeFileSync(to_file, msg  + require('os').EOL);
};

sync.fiber(function() {

    summaryFileHandle = fs.openSync(summaryFile, "w");
    testResFileHandle = fs.openSync(TestResultFile, "w");
    parseDataFileHandle = fs.openSync(parseDataFile, "w");
    clientFileHandle = fs.openSync(netConfDataFile, "a");

    //fs.truncateSync(TestResultFile);
    //fs.truncateSync(parseDataFile);
    //fs.truncateSync(summaryFile);
    fs.truncateSync(netConfDataFile);

    appendSync("Test executed on : " + Date() + " with MediatorIndex : " + mediatorIndex, testResFileHandle);
    appendSync("[", summaryFileHandle);

       //<POC3-02> Uncomment below line to invoke Netconf Server connection functionality and get / set of URLs and values

       sync.await(netconfCAll(sync.defers()));

       yangFromNetConf = sync.await(readNetConfFile(sync.defers()));


       if (yangFromNetConf != "") {

           var regex = new RegExp('<capability>urn:onf:(.*)?module=');

           var stringData = String(yangFromNetConf).split(" ");

           for (var i = 0; i < stringData.length; i++) {

               var matchPattern = String(stringData[i]).match(regex);
               if (matchPattern) {
                   var yangmodel = matchPattern[1];
                   yangmodel = yangmodel.substring(0, yangmodel.length - 1);

                   yangmodelArray=yangmodel.split(':')

                   for(var d = 0; d < yangmodelArray.length; d++) {
                       var modelstring=yangmodelArray[d];
                       if(modelstring.includes('microwave-model')) {
                           yangArray.push(modelstring);

                       }
                   }
               }
           }
       }


       //changed version 2 to take yang from netconf dynamically
       for (var i = 0; i < yangArray.length; i++) {

		   var yangModelName = yangArray[i];
		   appendSync("YANG Model Name : " + yangModelName, parseDataFileHandle);
		   var neNodeName = test_cases["nodeName"];
		   var yangObj = yang.parse(fs.readFileSync(__dirname+test_cases.YangDirectory + yangModelName + '.yang', 'utf8'));
		   baseurl = restconf + '/topology/topology-netconf/node/' + neNodeName + '/yang-ext:mount/' + yangModelName + '';
		   getLeafs(yangObj, yangModelName, flag);
       }

    appendSync("]", summaryFileHandle);
    appendSync("The Script has been executed successfully on " + Date(), testResFileHandle);
    console.log("The Script has been executed successfully on " + Date());
    fs.closeSync(summaryFileHandle);
    fs.closeSync(testResFileHandle);
    fs.closeSync(parseDataFileHandle);
    fs.closeSync(clientFileHandle);
    process.exit(0);

});


//This Method is used to fetch all leafs inside nested containers,choice,grouping... so on
function getLeafs(yangObj, yangName, flag) {

    var chainType = "";
    var url = "";
    var module = yangObj.module[yangName];

    if (module.hasOwnProperty('typedef')) {

        var typedef = module.typedef;
        for (var ele in typedef) {
            typeDefArray.push({typedef: ele, type: typedef[ele].type});
        }
    }

    if (module.hasOwnProperty('list')) {
        var gotObj = yangProcessLeafList(module.list, url, flag, chainType, yangName);

    }

    if (module.hasOwnProperty('container')) {
        var gotObj = yangProcessLeafContainer(module.container, url, flag, yangName);

    }

}

// Final Get/ Set of the leafs based on the URL
function executeGetSet(url, leafData, chainType) {

    var finalUrl = "";

    var jsonDataCopy = "";

    var newUrl = "";

    var netConfData = "";

    finalUrl = baseurl + ":" + url.substr(1);

    appendSync("**********************************************", parseDataFileHandle);

    appendSync(url,  parseDataFileHandle);

    for (var i = 0; i < leafData.length; i++) {

        appendSync("Configurable : "+leafData[i].config, parseDataFileHandle);
        appendSync("leaf name : "+leafData[i].leafName,  parseDataFileHandle);
        appendSync("type of leaf : "+leafData[i].type,  parseDataFileHandle);
        appendSync("CurrentValue : "+leafData[i].leafCurrentValue, parseDataFileHandle);
        appendSync("proposedValue : "+leafData[i].proposedValue, parseDataFileHandle);
        appendSync("parentNode : "+leafData[i].parentNode, parseDataFileHandle);
        appendSync("parentNodeType : "+leafData[i].parentNodeType, parseDataFileHandle);
        appendSync("#############################", parseDataFileHandle);

    }

    //<POC3-02> Uncomment from here to invoke functionality - get / set of URLS and values

    var res =  sync.await(getUrl(finalUrl,sync.defers()));

    if (res != "") {

        var temp = JSON.stringify(res[0].body);
        var jsonData = JSON.parse(temp);

        jsonDataCopy = res[0].body;

        newUrl = changeAllValues(jsonData, leafData, chainType, url);

        if (newUrl != "")
            finalUrl = baseurl + ":" + newUrl.substr(1);

        var res1 =   sync.await(putUrl(finalUrl, jsonData, sync.defers()));
        appendSync("Automated Set Operation: Set Operation has been carried out for URL " + finalUrl, testResFileHandle);

        if (res1 != "") {

            fs.truncateSync(netConfDataFile);

	    sync.await(netconfCAll(sync.defers()));

            var resData =   sync.await(readNetConfFile(sync.defers()));

            appendSync("Validating the result of Set Operation ...", testResFileHandle);

            if (resData != "") {

                for (var i = 0; i < netConfArray.length; i++) {
                    if ((resData.indexOf(netConfArray[i].name + '>' + netConfArray[i].value + '</' + netConfArray[i].name))) {
                        appendSync("Automated Test Case: Test for setting new value '" + netConfArray[i].value + "' to leaf: '" + netConfArray[i].name + "' has passed.", testResFileHandle);
						var checkJson = "{\"Leaf Name\": \"" + netConfArray[i].name + "\", \"Previous Value\": \"" + netConfArray[i].prevValue + "\", \"Current Value\": \"" + netConfArray[i].value + "\", \"Status\": \"Validation Passed\"}";
						
						if(!comma_flag && isValidJson(checkJson)){
							appendSync("{\"Leaf Name\": \"" + netConfArray[i].name + "\", \"Previous Value\": \"" + netConfArray[i].prevValue + "\", \"Current Value\": \"" + netConfArray[i].value + "\", \"Status\": \"Validation Passed\"}", summaryFileHandle);	
							comma_flag = true;
						}else if(isValidJson(checkJson)){
							appendSync(", {\"Leaf Name\": \"" + netConfArray[i].name + "\", \"Previous Value\": \"" + netConfArray[i].prevValue + "\", \"Current Value\": \"" + netConfArray[i].value + "\", \"Status\": \"Validation Passed\"}", summaryFileHandle);
						}
						

					}
                    else {
                        appendSync("Automated Test Case: Test for setting new value '" + netConfArray[i].value + "' to leaf: '" + netConfArray[i].name + "' has failed since the retrieved value doesn't match.", testResFileHandle);
						var checkJson = "{\"Leaf Name\": \"" + netConfArray[i].name + "\", \"Previous Value\": \"" + netConfArray[i].prevValue + "\", \"Current Value\": \"" + netConfArray[i].value + "\", \"Status\": \"Validation Failed\"}";
						
						if(!comma_flag && isValidJson(checkJson)){
							appendSync("{\"Leaf Name\": \"" + netConfArray[i].name + "\", \"Previous Value\": \"" + netConfArray[i].prevValue + "\", \"Current Value\": \"" + netConfArray[i].value + "\", \"Status\": \"Validation Failed\"}", summaryFileHandle);	
							comma_flag = true;
						}else if(isValidJson(checkJson)){
							appendSync(", {\"Leaf Name\": \"" + netConfArray[i].name + "\", \"Previous Value\": \"" + netConfArray[i].prevValue + "\", \"Current Value\": \"" + netConfArray[i].value + "\", \"Status\": \"Validation Failed\"}", summaryFileHandle);
						}
						
						
                    }
                }
            }

            appendSync("Automated Reset Operation: Reverting the values changed by Set Operation to original values", testResFileHandle);
            sync.await(revertToOriginal(finalUrl,jsonDataCopy,sync.defers()));
        }

    }

    //<POC3-02> Uncomment till the above line to invoke functionality - get / set of URLS and values

}

// This function is used to Set the values of the leafs based on the pre - determined leaf values(Proposed Values)
function changeAllValues(jsonData, processingArray, chainType, url) {

    var node = "";
    var key = "";
    var newUrl = "";
    netConfArray = [];


    var currentNodeType = chainType.substring(chainType.lastIndexOf("/") + 1, chainType.length);

    if (currentNodeType == "List") {
        var nodeArray = url.split("/");
        node = nodeArray[nodeArray.length - 2];
        key = nodeArray[nodeArray.length - 1];
    }

    else {

        node = url.substring(url.lastIndexOf("/") + 1, url.length);

    }

    processObject(jsonData);

    function processObject(obj) {

        for (var ele in obj) {

            var each_ele = obj[ele];

            if (typeof each_ele == 'object') {
                processObject(each_ele);

            }
            else {

                for (var i = 0; i < processingArray.length; i++) {
                    // setting the proposed value to the leaf
                    if (processingArray[i].leafName == ele && processingArray[i].config != "false" && processingArray[i].refine != "true" && processingArray[i].proposedValue != "" && processingArray[i].proposedValue != "skip") {


                        if (currentNodeType == "List") {
                            if (key == jsonData[node][0][ele]) {
                                newUrl = url.substring(0, url.lastIndexOf("/")) + "/" + processingArray[i].proposedValue;
                            }
                            if (processingArray[i].proposedValue == "false") {
                                jsonData[node][0][ele] = false;
                            }
                            if (processingArray[i].proposedValue.includes(",")) {

                                var p = processingArray[i].proposedValue.split(",");
                                for (i=0;i<p.length;i++) {
                                    jsonData[node][0][ele] = p[i];
                                    break;
                                }
                            }
                            else
                                jsonData[node][0][ele] = processingArray[i].proposedValue;

                        }

                        else {
                            if (processingArray[i].proposedValue == "false")
                                jsonData[node][ele] = false;
                            if (processingArray[i].proposedValue.includes(",")) {

                                var p = processingArray[i].proposedValue.split(",");
                                for (i=0;i<p.length;i++) {
                                    jsonData[node][0][ele] = p[i];
                                    break;
                                }
                            }
                            else
                                jsonData[node][ele] = processingArray[i].proposedValue;
                        }

                        netConfArray.push({name: ele, value: processingArray[i].proposedValue, prevValue: processingArray[i].leafCurrentValue});
                        break;
                    }

                }

            }

        }
    }

    return newUrl;
}

function getUrl(finalUrl, cb){

    var responce = [];

    controller.get(finalUrl)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end(function (err, res) {
            if (err) {
                responce = "";
            }
            else {
                responce = res;
            }
            cb(null,responce);

        });

}


function putUrl(finalUrl, jsonData, cb) {

    var responce = "";

    controller.put(finalUrl)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(jsonData))
        .expect(200)
        .end(function (err, res) {
            if (err) {
                responce = "";
            }

            else {
                responce = res;

            }
            cb(null,responce);
        });

}



function revertToOriginal(finalUrl,jsonDataCopy,cb){

    controller.put(finalUrl)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(jsonDataCopy))
        .expect(200)
        .end(function(err, res){
            if(err){
                appendSync("Testcase Fails For Resetting " + err, testResFileHandle);
            }
            cb(null);
        });
}

// handling Nested List
function yangProcessLeafList(yangObj, url, flag, type,yangName) {

    var localArray = [];
    var localArray1 = [];
    var configurable = "";
    var leafName = "";
    var proposedValue = "";
    var url1 = "";
    var refineLeafs = [];
    var leafData = [];
    var currentType = "List";
    var chainType = "";
    if (type == "") {
        chainType = currentType;
    }
    else {
        chainType = type + "/" + currentType;
    }

    appendSync("Attribute Discovery: Parsing List " + url, testResFileHandle);

    for (var ele in yangObj) {

        var parentNode = ele;

        var listKey = test_cases[parentNode];

        if (listKey != undefined) {

            url1 = url + "/" + ele + "/" + listKey;

        }

        if (listKey == undefined) {
            url1 = "";
            appendSync("Key Does Not Exists For : " + ele + "", testResFileHandle);
        }


        var each_ele = yangObj[ele];


        // handling refines for the leafs , those leafs are skipped from the set/get operation
        if (each_ele.hasOwnProperty('refine')) {

            var refineObj = each_ele.refine;

            for (var refineEachObj in refineObj) {

                refineLeafs.push({leafName: refineEachObj});
            }

        }

        //obtaining the config parameter , config = false will skip the leaf Set/Get
        if (each_ele.hasOwnProperty('config')) {
            configurable = each_ele.config.toString();
        }


        if (each_ele.hasOwnProperty('container')) {

            yangProcessLeafContainer(each_ele.container, url1, flag, chainType, yangName);

        }
        if (each_ele.hasOwnProperty('list')) {
            yangProcessLeafList(each_ele.list, url1, flag, chainType,yangName);

        }

        if (each_ele.hasOwnProperty('uses')) {

            UsesSecond(yangName, each_ele.uses, url1, chainType);

        }

        if (flag == "") {
            for (var i = 0; i < localArray.length; i++) {
                leafData.push(localArray[i]);
            }
        }



        // Saving all the type definitions , to be used to obtain type
        if (each_ele.hasOwnProperty('typedef')) {

            var typedef = each_ele.typedef;
            for (var ele in typedef) {
                typeDefArray.push({typedef: ele, type: typedef[ele].type});
            }
        }

        if (each_ele.hasOwnProperty('leaf-list')) {

            var Obj = each_ele["leaf-list"];
            for (var ele1 in Obj) {
                leafName = ele1;
                var leafObj = Obj[ele1];

                proposedValue = getProposedValues(leafObj);

                localArray1 = getLeafData(leafObj, leafName, parentNode, proposedValue, url1, currentType, configurable,chainType);


                if (flag == "") {
                    for (var i = 0; i < localArray1.length; i++) {
                        leafData.push(localArray1[i]);
                    }
                }


            }

        }

        if (each_ele.hasOwnProperty('leaf')) {
            var Obj = each_ele.leaf;
            for (var ele1 in Obj) {

                leafName = ele1;

                var leafObj = Obj[ele1];

                proposedValue = getProposedValues(leafObj);

                localArray1 = getLeafData(leafObj, leafName, parentNode, proposedValue, url1, currentType, configurable,chainType);

                if (flag == "") {
                    for (var i = 0; i < localArray1.length; i++) {
                        leafData.push(localArray1[i]);
                    }
                }

            }
        }

        if (flag == "" && url1 != "" && leafData.length != 0 && !chainType.includes("Grouping")) {

            executeGetSet(url1, leafData, chainType);
            leafData = [];
        }


    }

}

function yangProcessLeafContainer(yangObj, url, flag, type, yangName) {

    var localArray = [];
    var localArray1 = [];
    var configurable = "";
    var leafName = "";
    var proposedValue = "";
    var url1 = "";
    var refineLeafs = [];
    var leafData = [];
    var currentType = "Container";
    var chainType = "";
    if (type == "") {
        chainType = currentType;
    }
    else {
        chainType = type + "/" + currentType;
    }

    appendSync("Attribute Discovery: Parsing Container " + url, testResFileHandle);

    for (var ele in yangObj) {

        var parentNode = ele;
        url1 = url + "/" + ele;

        var each_ele = yangObj[ele];

        if (each_ele.hasOwnProperty('refine')) {

            var refineObj = each_ele.refine;

            for (var refineEachObj in refineObj) {


                refineLeafs.push({leafName: refineEachObj});
            }

        }

        if (each_ele.hasOwnProperty('config')) {

            configurable = each_ele.config.toString();

        }


        if (each_ele.hasOwnProperty('container')) {

            yangProcessLeafContainer(each_ele.container, url1, flag, chainType,yangName);

        }
        if (each_ele.hasOwnProperty('list')) {

            yangProcessLeafList(each_ele.list, url1, flag, chainType,yangName);

        }
        if (each_ele.hasOwnProperty('uses')) {

            UsesSecond(yangName, each_ele.uses, url1, chainType);
        }

        if (flag == "") {
            for (var i = 0; i < localArray.length; i++) {
                leafData.push(localArray[i]);
            }
        }

        if (each_ele.hasOwnProperty('typedef')) {

            var typedef = each_ele.typedef;
            for (var ele in typedef) {
                typeDefArray.push({typedef: ele, type: typedef[ele].type});
            }
        }

        if (each_ele.hasOwnProperty('leaf-list')) {

            var Obj = each_ele["leaf-list"];
            for (var ele1 in Obj) {
                leafName = ele1;
                var leafObj = Obj[ele1];

                proposedValue = getProposedValues(leafObj);

                localArray1 = getLeafData(leafObj, leafName, parentNode, proposedValue, url1, currentType, configurable,chainType);

                if (flag == "") {
                    for (var i = 0; i < localArray1.length; i++) {
                        leafData.push(localArray1[i]);
                    }
                }
            }

        }

        if (each_ele.hasOwnProperty('leaf')) {
            var Obj = each_ele.leaf;
            for (var ele1 in Obj) {
                leafName = ele1;
                var leafObj = Obj[ele1];

                proposedValue = getProposedValues(leafObj);

                localArray1 = getLeafData(leafObj, leafName, parentNode, proposedValue, url1, currentType, configurable,chainType);

                if (flag == "") {
                    for (var i = 0; i < localArray1.length; i++) {
                        leafData.push(localArray1[i]);
                    }
                }
            }
        }

        if (flag == "" && url1 != "" && leafData.length != 0 && !chainType.includes("Grouping")) {

            executeGetSet(url1, leafData, chainType);
            leafData = [];
        }

    }
}


// creates an array of leafs in a particular node
function getLeafData(leafObj, leafName, parentNode, proposedValue, url1, currentType, configurable,chainType) {

    var localArray = [];
    var leafCurrentValue = "";
    appendSync("Attribute Discovery: Parsing Leaf " + url1, testResFileHandle);

    if (yangFromNetConf != "") {
        //leafCurrentValue is obtained from client.log

        var chainTypeArray = chainType.split("/");
        var indexCount = 0;
        var keyIndexPosition = 0;
        var isList = "false";
        var listKey = "";
        var regexLeafNameOpen = "<"+leafName+">";
        var regexLeafNameClose = "</"+leafName+">";

        for (var i = 0; i < chainTypeArray.length; i++) {
           if(chainTypeArray[i] == 'List') {
               indexCount = indexCount + 1;
               keyIndexPosition = indexCount + i;
               isList ="true";
           }
        }
		if (isList == "true") {
			var urlArray = url1.split("/");
			listKey = urlArray[keyIndexPosition + 1];
			var yangFromNetConfWithoutNewLine = String(yangFromNetConf);
			yangFromNetConfWithoutNewLine = yangFromNetConfWithoutNewLine.replace(/\r?\n|\r/g, "");
			var regex = new RegExp("<layer-protocol>" + listKey + "(.*?)" + regexLeafNameClose);
			var matchPattern = String(yangFromNetConfWithoutNewLine).match(regex);
			if (matchPattern) {
				var yangFromNetConfNew = matchPattern[0];
				var regexNew = new RegExp(regexLeafNameOpen + "(.*)" + regexLeafNameClose);
				var matchPatternNew = String(yangFromNetConfNew).match(regexNew);
				if (matchPatternNew) {
					leafCurrentValue = matchPatternNew[1];
				}
			}
		}
		else {
			var regex = new RegExp(regexLeafNameOpen + "(.*)" + regexLeafNameClose);
			var matchPattern = String(yangFromNetConf).match(regex);
			if (matchPattern) {
				leafCurrentValue = matchPattern[1];
			}
		}
        if (leafCurrentValue == "") {
            appendSync("Automated Get Operation: Leaf Value not available for "+leafName+" in retrieved Netconf data", testResFileHandle);
        }
        else {
            appendSync("Automated Get Operation: Leaf Name " + leafName + " and Current Value " + leafCurrentValue, testResFileHandle);
        }
	}

    if (leafObj.hasOwnProperty('config')) {
        if (leafObj.config) {
            var config = leafObj.config.toString();
            localArray.push({
                config: config,
                type: leafObj.type,
                leafName: leafName,
                leafCurrentValue: leafCurrentValue,
                parentNode: parentNode,
                proposedValue: proposedValue,
                url: url1,
                parentNodeType: currentType,
                refine: "NA"
            });
        }
    }
    else if (configurable == "true") {
        localArray.push({
            config: "true",
            type: leafObj.type,
            leafName: leafName,
            leafCurrentValue: leafCurrentValue,
            parentNode: parentNode,
            proposedValue: proposedValue,
            url: url1,
            parentNodeType: currentType,
            refine: "NA"
        });

    }
    else if (configurable == "false") {
        localArray.push({
            config: "false",
            type: leafObj.type,
            leafName: leafName,
            leafCurrentValue: leafCurrentValue,
            parentNode: parentNode,
            proposedValue: proposedValue,
            url: url1,
            parentNodeType: currentType,
            refine: "NA"
        });

    }
    else if (configurable == "") {
        localArray.push({
            config: "true",
            type: leafObj.type,
            leafName: leafName,
            leafCurrentValue: leafCurrentValue,
            parentNode: parentNode,
            proposedValue: proposedValue,
            url: url1,
            parentNodeType: currentType,
            refine: "NA"
        });

    }

    return localArray;
}


function getProposedValues(leafObj) {

    var proposedValue = "";

    var leafType = "";
    var range = "";
    var min = "";
    var max = "";

    // This handles the Range of the leafs
    if (typeof leafObj.type != 'string') {

        for (var ele in leafObj.type) {
            leafType = ele;
            if (leafObj.type[ele].hasOwnProperty('range')) {
                range = leafObj.type[ele].range;
                min = range.split('..')[0];
                max = range.split('..')[1];
                break;
            }
        }

        leafObj.type = leafType;
    }

    proposedValue = setLeafProposedValue(leafObj.type, min, max);

    if (proposedValue != "" && proposedValue != undefined) {
        return proposedValue;
    }

    if (leafObj.type.indexOf(":") != -1) {

        var yangModelName = leafObj.type.split(":")[0];
        var yangObj = yang.parse(fs.readFileSync(__dirname+test_cases.YangDirectory + yangModelName + '.yang', 'utf8'));
        var module = yangObj.module[yangModelName];
        //if (module.hasOwnProperty('typedef')) {
        var typedefObject = module['typedef'][leafObj.type.split(":")[1]];
        //}

        proposedValue = setLeafProposedValue(typedefObject.type,min,max);

        if (proposedValue != "") {
            return proposedValue;
        }

    }


    else {

        for (var i = 0; i < typeDefArray.length; i++) {

            if (leafObj.type == typeDefArray[i].typedef) {

                proposedValue = setLeafProposedValue(typeDefArray[i].type);

                if (proposedValue != "") {
                    return proposedValue;
                }

            }

            else {
                // cannot find type definition from array possiblity due to nested imports
                proposedValue = "";

            }

        }


    }


    return proposedValue;
}


// proposed value based on type for set/get operation
function setLeafProposedValue(leafObjType, min, max) {

    var proposedValue = "";


    //handles the enum and gets all its possible values

    //Start: Bug Fix – Enum value setting functionality
    if (leafObjType.hasOwnProperty('enumeration')) {
        var type = leafObjType.enumeration.enum;
        for (var ele1 in type) {
            proposedValue = ele1;
            break;
        }
        return proposedValue;
    }
    //End: Bug Fix – Enum value setting functionality

    if (leafObjType.hasOwnProperty("leafref")) {
        proposedValue = "skip";
        return proposedValue;
    }

    if (leafObjType == "int8") {
        if (max != "") {
            proposedValue = max;
        }
        else
            proposedValue = "127";
        return proposedValue;
    }
    if (leafObjType == "int16") {
        if (max != "") {
            proposedValue = max;
        }
        else
            proposedValue = "32767";
        return proposedValue;
    }

    if (leafObjType == "int32") {
        if (max != "") {
            proposedValue = max;
        }
        else
            proposedValue = "2147483647";
        return proposedValue;
    }

    if (leafObjType == "int64") {
        if (max != "") {
            proposedValue = max;
        }
        else
            proposedValue = "9223372036854775807";
        return proposedValue;
    }

    if (leafObjType == "uint8") {
        if (max != "") {
            proposedValue = max;
        }
        else
            proposedValue = "255";
        return proposedValue;
    }


    if (leafObjType == "uint16") {
        if (max != "") {
            proposedValue = max;
        }
        else
            proposedValue = "65535";
        return proposedValue;
    }

    if (leafObjType == "uint32") {
        if (max != "") {
            proposedValue = max;
        }
        else
            proposedValue = "4294967295";
        return proposedValue;
    }

    if (leafObjType == "uint64") {
        if (max != "") {
            proposedValue = max;
        }
        else
            proposedValue = "18446744073709551615";
        return proposedValue;
    }

    if (leafObjType == "string") {
        proposedValue = "dummystring";
        return proposedValue;
    }

    if (leafObjType == "boolean") {
        proposedValue = "false";
        return proposedValue;
    }

}

//Start: Bug Fix – Enum value setting functionality - this function has been called from many places
function typeDef(module){

    if (module.hasOwnProperty('typedef')) {

        var typedef = module.typedef;
        for (var ele in typedef) {
            typeDefArray.push({typedef: ele, type: typedef[ele].type});
        }
    }

}
//End: Bug Fix – Enum value setting functionality

function UsesSecond(yangModuleName, groupingName, url, type){

    var currentType = "Grouping";
    var chainType = "";
    if (type == "") {
        chainType = currentType;
    }
    else {
        chainType = type + "/" + currentType;
    }

    var yangModelName = yangModuleName;
    if (yangModelName == 'yang' || yangModelName == 'g')
        return
    var yangObj = yang.parse(fs.readFileSync(__dirname+test_cases.YangDirectory + yangModelName + '.yang', 'utf8'));
    var module = yangObj.module[yangModelName];
    typeDef(module);

    appendSync("Attribute Discovery: Parsing (within Uses block) " + url, testResFileHandle);
    if (module.hasOwnProperty('grouping')){
        var groupingObject = module['grouping'][groupingName];

        if (groupingObject.hasOwnProperty('container')) {
            getContainer(groupingObject, yangModelName, url, chainType,module);
        }

        if (groupingObject.hasOwnProperty('list')) {
            getList(groupingObject, yangModelName, url, chainType,module);
        }

        if (groupingObject.hasOwnProperty('leaf')) {

            if (groupingObject.hasOwnProperty('config')) {
                getLeaf(groupingObject,yangModelName,url,groupingObject.config.toString(),chainType);
            }
            else {
                getLeaf(groupingObject,yangModelName,url,"",chainType);
            }
        }

        if (groupingObject.hasOwnProperty('uses')){
            if (groupingObject.uses.indexOf(":") != -1) {
                typeDef(module);
                UsesSecond(groupingObject.uses.split(":")[0],groupingObject.uses.split(":")[1],url,chainType);
            }
            else {
                UsesSecond(yangModelName,groupingObject.uses,url,chainType);
            }
        }

    }
}


function getContainer(groupingObject, yangModelName, url, type,module){

    var currentType = "Container";
    var chainType = "";
    if (type == "") {
        chainType = currentType;
    }
    else {
        chainType = type + "/" + currentType;
    }

    var containerObject = groupingObject['container'];
    //console.log(containerObject);
    appendSync("Attribute Discovery: Parsing Container (within Uses block) " + url, testResFileHandle);
    for (var ele in containerObject) {
        url = url + "/" + ele;
        if (containerObject[ele].hasOwnProperty('uses')){
            if (containerObject[ele].uses.indexOf(":") != -1) {
                typeDef(module);
                UsesSecond(containerObject[ele].uses.split(":")[0],containerObject[ele].uses.split(":")[1],url,chainType);
            }
            else {
                UsesSecond(yangModelName,containerObject[ele].uses,url,chainType);
            }
        }
        if (containerObject[ele].hasOwnProperty('leaf')){
            if (containerObject[ele].hasOwnProperty('config')) {
                getLeaf(containerObject[ele],yangModelName,url,containerObject[ele].config.toString(),chainType);
            }
            else {
                getLeaf(containerObject[ele],yangModelName,url,"",chainType);
            }
        }
        if (containerObject[ele].hasOwnProperty('list')){
            getList(containerObject[ele],yangModelName,url,chainType,module);
        }
        if (containerObject[ele].hasOwnProperty('container')){
            getContainer(containerObject[ele],yangModelName,url,chainType,module);
        }
    }
}

function getLeaf(groupingObject, yangModelName, url, config, chainType){

    var localArray = [];
    var leafData = [];
    var proposedValue = "";


    var leafObject = groupingObject['leaf'];

    appendSync("Attribute Discovery: Parsing Leaf (within Uses block) " + url, testResFileHandle);
    for (var ele in leafObject) {
        //console.log(leafObject[ele]);

        if (leafObject[ele].type.indexOf(":") != -1) {
            //console.log(leafObject[ele].type.split(":")[1]);
            var yangModelName = leafObject[ele].type.split(":")[0];
            if (yangModelName == 'yang' || yangModelName == 'g')
                continue
            var yangObj = yang.parse(fs.readFileSync(__dirname+test_cases.YangDirectory + yangModelName + '.yang', 'utf8'));
            var module = yangObj.module[yangModelName];
            if (module.hasOwnProperty('typedef')){
                var typedefObject = module['typedef'][leafObject[ele].type.split(":")[1]];
                proposedValue = setLeafProposedValue(typedefObject.type, "", "");
                localArray = getLeafData(leafObject[ele], ele, "", proposedValue, url, "", config,chainType);
            }

        }
        else {

            proposedValue = getProposedValues(leafObject[ele]);
            localArray = getLeafData(leafObject[ele], ele, "", proposedValue, url, "", config,chainType);
        }

        for (var i = 0; i < localArray.length; i++) {
            leafData.push(localArray[i]);
        }

    }
    executeGetSet(url, leafData, chainType);
}


function getList(groupingObject, yangModelName, url, type,module){

    var currentType = "List";
    var chainType = "";
    if (type == "") {
        chainType = currentType;
    }
    else {
        chainType = type + "/" + currentType;
    }

    var listObject = groupingObject['list'];
    //console.log(listObject);
    appendSync("Attribute Discovery: Parsing List (within Uses block) " + url, testResFileHandle);
    for (var ele in listObject) {

        var listKey = test_cases[ele];

        if (listKey != undefined) {
            url = url + "/" + ele + "/" + listKey;
        }
        else {
            url = url + "/" + ele
        }


        if (listObject[ele].hasOwnProperty('uses')){
            if (listObject[ele].uses.indexOf(":") != -1) {
                typeDef(module);
                UsesSecond(listObject[ele].uses.split(":")[0],listObject[ele].uses.split(":")[1],url,chainType);
            }
            else {
                UsesSecond(yangModelName,listObject[ele].uses,url,chainType);
            }
        }
        if (listObject[ele].hasOwnProperty('leaf')){
            if (listObject[ele].hasOwnProperty('config')) {
                getLeaf(listObject[ele],yangModelName,url,listObject[ele].config.toString(),chainType);
            }
            else {
                getLeaf(listObject[ele],yangModelName,url,"",chainType);
            }
        }
        if (listObject[ele].hasOwnProperty('container')){
            getContainer(listObject[ele],yangModelName,url,chainType,module);
        }
        if (listObject[ele].hasOwnProperty('list')){
            getList(listObject[ele],yangModelName,url,chainType,module);
        }
    }
}

function netconfCAll(cb) {

    var conn = new Client();

    if (mediatorIndex == "")
    {
        mediatorIndex="1";
    }

    conn.on('ready', function () {
        //console.log('Client :: ready');
        conn.subsys('netconf', function (err, stream) {
            if (err) throw err;
            stream.on('data', function (data) {
                // console.log(data.toString('utf8'));
            }).write(xmlhello);
            stream.on('data', function (data) {
                //console.log(data.toString('utf8'));
                appendSync(data.toString('utf8'), clientFileHandle);



            }).write(xmlhello1);

            setTimeout(function(){
                // remember that callbacks expect (err, result)
                cb(null);
            }, 1000)

        });
    }).connect({
        host: config[config.topology[mediatorIndex].type].ip,
        port: config[config.topology[mediatorIndex].type].port,
        username: config[config.topology[mediatorIndex].type].user,
        password: config[config.topology[mediatorIndex].type].passwd});

}


function readNetConfFile(cb) {

    var response = "";

    fs.readFile(netConfDataFile, function (err, data) {
        if (err) {
            response = "";
        }
        else {
            response = data;
        }
        setTimeout(function(){
            cb(null,response);
        }, 1000)

    });
}


function isValidJson(json) {
	try {
		JSON.parse(json);
		return true;
	} catch (e) {
		return false;
	}
}
