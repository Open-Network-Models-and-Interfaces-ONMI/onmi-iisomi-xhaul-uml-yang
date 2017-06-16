/*
 * 04.2-netconfserver-YANG-ConfigurableData.js - Parses and set user configured values in the OEM WT mediator
 *
 * Copyright (C) 2017 HCL Technologies
 *
 * Authors: HCL SDN & NFV CoE Team
 *
 * Contact: paolo.spallaccini@hcl.com
 *          saurabhchattopadhya@hcl.com
 *
 */

var yang = require("yang-js");
var fs = require('fs');
var supertest = require('supertest');
var config = require('../config.json');
var test_cases = require('./input/test-cases.json');
var netConfArray = [];
var typeDefArray =[];
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
var parseDataFileHandle
var clientFileHandle;
var DOMParser = require('xmldom').DOMParser;

var controller = supertest.agent('http://' +
    config[config.topology[0].type].user + ':' +
    config[config.topology[0].type].passwd + '@' +
    config[config.topology[0].type].ip + ':' +
    config[config.topology[0].type].port);


var restconf = '/restconf/config/network-topology:network-topology';


var TestResultFile = __dirname+test_cases["TestResultFile"];
var netConfDataFile = __dirname+test_cases["NetConfDataFile"];
var netConfCapabilityXml = __dirname+test_cases["NetConfCapabilityXml"];
var netConfUserDataXml = __dirname+test_cases["NetConfUserDataXml"];
var parseDataFile = __dirname+test_cases["ParseDataFile"];
var summaryFile = __dirname+test_cases["SummaryReportFile04"];
var modelname = test_cases["yangModelName"];

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

var appendSync = function(msg, to_console, to_file)
{
    if (!msg){
        return;
    }
    fs.appendFileSync(to_file, msg  + require('os').EOL);
};

var writeSync = function(msg, to_console, to_file)
{
    if (!msg){
        return;
    }
    fs.writeFileSync(to_file, msg  + require('os').EOL);
};

sync.fiber(function() {

    summaryFileHandle=fs.openSync(summaryFile, "a")
    testResFileHandle=fs.openSync(TestResultFile, "a")
    parseDataFileHandle=fs.openSync(parseDataFile, "a")
    clientFileHandle=fs.openSync(netConfDataFile, "w")

    fs.truncateSync(TestResultFile);
    fs.truncateSync(parseDataFile);
    fs.truncateSync(summaryFile);


    appendSync("Test executed on : " + Date() + " with MediatorIndex : " + mediatorIndex, true, testResFileHandle);
    appendSync("[", true, summaryFileHandle);

    capabilityFromNetConf = sync.await(readNetConfFile(netConfCapabilityXml, sync.defers()));
    yangFromNetConf = sync.await(readNetConfFile(netConfUserDataXml, sync.defers()));


    if (capabilityFromNetConf != "" && yangFromNetConf != "" ) {


        var yandmodelArray = [];

        var regex = new RegExp('urn:onf:(.*)?module=');

        var stringData = String(capabilityFromNetConf).split(" ");

        for (var i = 0; i < stringData.length; i++) {

            var matchPattern = String(stringData[i]).match(regex);
            if (matchPattern) {
                var yangstring = matchPattern[1];
                yangstring = yangstring.substring(0, yangstring.length - 1);
                yangmodelArray=yangstring.split(':')
                for(var d = 0; d < yangmodelArray.length; d++) {
                    var modelstring=yangmodelArray[d];
                    if(modelstring.includes(modelname)) {
                        yangArray.push(modelstring);
			console.log(modelstring);
                    }
                }
            }
        }
    }
    else{
        appendSync("Capability or user data not available", true, testResFileHandle);
    }

    //changed version 2 to take yang from netconf dynamically
    for (var i = 0; i < yangArray.length; i++) {

        var yangModelName = yangArray[i];
        appendSync("YANG Model Name : " + yangModelName, true, parseDataFileHandle);
        var neNodeName = test_cases["nodeName"];
        var yangObj = yang.parse(fs.readFileSync(__dirname+test_cases.YangDirectory + yangModelName + '.yang', 'utf8'));
        baseurl = restconf + '/topology/topology-netconf/node/' + neNodeName + '/yang-ext:mount/' + yangModelName + '';
        getLeafs(yangObj, yangModelName);
    }

    appendSync("]", true, summaryFileHandle);
    appendSync("The Script has been executed successfully on " + Date(), true, testResFileHandle);
    console.log("The Script has been executed successfully on " + Date());
    fs.closeSync(parseDataFileHandle);
    fs.closeSync(summaryFileHandle);
    fs.closeSync(testResFileHandle);
    fs.closeSync(clientFileHandle);
    process.exit(0);

});


//This Method is used to fetch all leafs inside nested containers,choice,grouping... so on
function getLeafs(yangObj, yangName) {

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
        var gotObj = yangProcessLeafList(module.list, url, chainType, yangName);

    }

    if (module.hasOwnProperty('container')) {
        var gotObj = yangProcessLeafContainer(module.container, url, yangName);

    }
}

// Final Get/ Set of the leafs based on the URL
function executeGetSet(url, leafData, chainType) {

    var finalUrl = "";

    var jsonDataCopy = "";

    var newUrl = "";

    var netConfData = "";

    var checkJson = "";

    var flag = "";

    finalUrl = baseurl + ":" + url.substr(1);
	console.log(finalUrl);
	appendSync("FINAL URL" + finalUrl,true, parseDataFileHandle);
    appendSync("**********************************************", true, parseDataFileHandle);

    appendSync(url, true, parseDataFileHandle);


    for (var i = 0; i < leafData.length; i++) {

        appendSync("Configurable : "+leafData[i].config, true, parseDataFileHandle);
        appendSync("leaf name : "+leafData[i].leafName, true, parseDataFileHandle);
        appendSync("type of leaf : "+leafData[i].type, true, parseDataFileHandle);
        appendSync("proposedValue : "+leafData[i].proposedValue, true, parseDataFileHandle);
        appendSync("parentNode : "+leafData[i].parentNode, true, parseDataFileHandle);
        appendSync("parentNodeType : "+leafData[i].parentNodeType, true, parseDataFileHandle);
        appendSync("#############################", true, parseDataFileHandle);

    }


    var res =  sync.await(getUrl(finalUrl,sync.defers()));

    if (res != "") {

        var temp = JSON.stringify(res[0].body);
        var jsonData = JSON.parse(temp);

	appendSync("GET RESPONSE  *****  " + temp,true, parseDataFileHandle);
        jsonDataCopy = res[0].body;
	console.log("Data after GET :    "  + jsonDataCopy);

        newUrl = changeAllValues(jsonData, leafData, chainType, url);

        if (newUrl != "")
            finalUrl = baseurl + ":" + newUrl.substr(1);

        var res1 =  sync.await(putUrl(finalUrl, jsonData, sync.defers()));

        if (res1[0][0] == 200) {
	    //appendSync("PUT RESPONSE  *****  " + res1,true, parseDataFileHandle);

            appendSync("Automated Set Operation: Set Operation has been carried out for URL " + finalUrl, true, testResFileHandle);

            fs.truncateSync(netConfDataFile);

            sync.await(netconfCAll(sync.defers()));

            var resData =   sync.await(readNetConfFile(netConfDataFile, sync.defers()));

            appendSync("Validating the result of Set Operation ...", true, testResFileHandle);

            if (resData != "") {

                if(netConfArray.length > 0) {
                    if(!comma_flag) {
                        comma_flag = true;
                    }
                    else {
                        appendSync(",", true, summaryFileHandle);
                    }

                    checkJson = "{\"URL\" : \"" + finalUrl + "\"," + "\"Config Values\" : ["
                }
                for (var i = 0; i < netConfArray.length; i++) {
                    var str = "";
                    if ((resData.indexOf(netConfArray[i].name + '>' + netConfArray[i].value + '</' + netConfArray[i].name))) {
                        appendSync("Automated Test Case: Test for setting new value '" + netConfArray[i].value + "' to leaf: '" + netConfArray[i].name + "' has passed.", true, testResFileHandle);

                        if(!flag){
                            str = "{\"Leaf Name\": \"" + netConfArray[i].name + "\", \"Current Value\": \"" + netConfArray[i].value + "\", \"Status\": \"Validation Passed\"}";
                            flag = true;
                        }else {
                            str = ", {\"Leaf Name\": \"" + netConfArray[i].name + "\", \"Current Value\": \"" + netConfArray[i].value + "\", \"Status\": \"Validation Passed\"}";
                        }
                        checkJson += str;

                    }
                    else {
                        appendSync("Automated Test Case: Test for setting new value '" + netConfArray[i].value + "' to leaf: '" + netConfArray[i].name + "' has failed since the retrieved value doesn't match.", true, testResFileHandle);

                        if(!flag){
                            str = "{\"Leaf Name\": \"" + netConfArray[i].name + "\", \"Current Value\": \"" + netConfArray[i].value + "\", \"Status\": \"Validation Failed\"}";
                            flag = true;
                        }else{
                            str = ", {\"Leaf Name\": \"" + netConfArray[i].name + "\", \"Current Value\": \"" + netConfArray[i].value + "\", \"Status\": \"Validation Failed\"}";
                        }

                        checkJson += str;
                    }
                }

                checkJson += "] }";

                if(isValidJson(checkJson)){
                    appendSync(checkJson , true, summaryFileHandle);
                }
            }
            else {
                appendSync("Unable to read the NETCONF from Mediator or Simulator which was earlier working", true, testResFileHandle);
                appendSync("ALARM !!!! Probable Mediator or Emulator FAILURE" , true, testResFileHandle);
            }
            //Uncomment below lines to revert the original config of NE
            // appendSync("Automated Reset Operation: Reverting the values changed by Set Operation to original values", true, testResFileHandle);
            //sync.await(revertToOriginal(finalUrl,jsonDataCopy,sync.defers()));
        }
        else {

           if(netConfArray.length > 0) {
               if(!comma_flag) {
                        comma_flag = true;
               }
               else {
                        appendSync(",", true, summaryFileHandle);
               }

               checkJson = "{\"URL\" : \"" + finalUrl + "\"," + "\"Config Values\" : ["
           }

            for (var i = 0; i < netConfArray.length; i++) {

                appendSync("Automated Test Case: Test for setting new value '" + netConfArray[i].value + "' to leaf: '" + netConfArray[i].name + "' has failed " + res1[0][1], true, testResFileHandle);

                        if(!flag){
                            str = "{\"Leaf Name\": \"" + netConfArray[i].name + "\", \"Current Value\": \"" + netConfArray[i].value + "\", \"Status\": \"" + res1[0][1] +"\"}";
                            flag = true;
                        }else{
                            str = ", {\"Leaf Name\": \"" + netConfArray[i].name + "\", \"Current Value\": \"" + netConfArray[i].value + "\", \"Status\": \"" + res1[0][1] + "\"}";
                        }

                  checkJson += str;
            }

            checkJson += "] }";

            if(isValidJson(checkJson)){
                    appendSync(checkJson , true, summaryFileHandle);
            }
        }  
    }

}


// This function is used to Set the values of the leafs based on the user set values(Proposed Values)
function changeAllValues(jsonData, processingArray, chainType, url) {

    var node = "";
    var key = "";
    var newUrl = "";
    netConfArray = [];
    var index = "";

    index = chainType.split("/").length;
    var currentNodeType = chainType.substring(chainType.lastIndexOf("/") + 1, chainType.length);

    while(currentNodeType) {
        if(currentNodeType == "List" || currentNodeType == "Container")
            break;
        chainType = chainType.substring(0, chainType.lastIndexOf("/"));
        currentNodeType = chainType.substring(chainType.lastIndexOf("/") + 1, chainType.length);
        index=index-1;
    }

    if (currentNodeType == "List") {
        var nodeArray = url.split("/");
        node = nodeArray[index];
        key = nodeArray[index+1];
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

                        netConfArray.push({name: ele, value: processingArray[i].proposedValue});
                        break;
                    }

                }

            }

        }
    }

    return newUrl;
}

function getUrl(finalUrl, cb){


    var response = [];

    controller.get(finalUrl)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end(function (err, res) {
            if (err) {
                console.log("Err after get : " + err);
                response = "";
            }
            else {
                response = res;
            }
            cb(null,response);

        });

}


function putUrl(finalUrl, jsonData, cb) {

    var response = "";

    controller.put(finalUrl)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(jsonData))
        .expect(200)
        .end(function (err, res) {
            if (err) {
                //console.log("putURL error : " + err + " response : " + res.text);
                appendSync("Error (code :" + err + ") while sending PUT request on URL :" + finalUrl , true, testResFileHandle);
                appendSync("Error Description : " + res.status , true, testResFileHandle);
                if (res.status == 500)
                    appendSync("ALARM !!!! Probable Mediator or Emulator FAILURE" , true, testResFileHandle);
                 response = [res.status, res.body.errors.error[0]['error-tag']];
            }
            else {
                response = [200, 'OK'];

            }
            cb(null,response);
        });
}

function revertToOriginal(finalUrl,jsonDataCopy,cb){

    controller.put(finalUrl)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(jsonDataCopy))
        .expect(200)
        .end(function(err, res){
            if(err){
                appendSync("Testcase Fails For Resetting " + err, true,  testResFileHandle);
            }
            cb(null);
        });
}

// handling Nested List
function yangProcessLeafList(yangObj, url, type,yangName) {

    var localArray1 = [];
    var configurable = "";
    var leafName = "";
    var url1 = "";
    var refineLeafs = [];
    var leafData = [];
    var currentType = "List";
    var chainType = "";
    var tempType = ""
    var keyVal = [];
    if (type == "") {
        tempType = currentType;
    }
    else {
        tempType = type + "/" + currentType;
    }

    appendSync("Attribute Discovery: Parsing List " + url, true, testResFileHandle);

    for (var ele in yangObj) {

        var parentNode = ele;

        var keyname = ""
        keyname = getKeyName(yangObj[ele])

        if (keyname != undefined) {
            appendSync("Key for list element : " + ele + " is : " + keyname + "", true, testResFileHandle);
            keyVal = getKeyValueFromDOM(ele, keyname, '');
            if (keyVal.length == 0) {
                appendSync("Key value not supported for : " + ele + "" , true, testResFileHandle);
                keyVal.push("nokey")
            }
        }
        else {
            appendSync("Key Does Not Exists For : " + ele + "", true, testResFileHandle);
            keyVal.push("nokey")
        }

        for (var itr = 0; itr < keyVal.length; itr++) {

            if (keyVal == "nokey") {
                url1 = url + "/" + ele;
                chainType = tempType;
            }
            else {
                url1 = url + "/" + ele + "/" + keyVal[itr];
                chainType = tempType + "/" + keyVal[itr];
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

                yangProcessLeafContainer(each_ele.container, url1, chainType, yangName, keyname);

            }
            if (each_ele.hasOwnProperty('list')) {
                yangProcessLeafList(each_ele.list, url1, chainType, yangName);

            }

            if (each_ele.hasOwnProperty('uses')) {

                UsesSecond(yangName, each_ele.uses, url1, chainType, keyname);

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

                    localArray1 = getLeafData(leafObj, leafName, parentNode, url1, currentType, configurable, chainType, keyname);


                    for (var i = 0; i < localArray1.length; i++) {
                        leafData.push(localArray1[i]);
                    }
                }
            }

            if (each_ele.hasOwnProperty('leaf')) {
                var Obj = each_ele.leaf;
                for (var ele1 in Obj) {

                    leafName = ele1;

                    var leafObj = Obj[ele1];

                    localArray1 = getLeafData(leafObj, leafName, parentNode, url1, currentType, configurable, chainType, keyname);

                    for (var i = 0; i < localArray1.length; i++) {
                        leafData.push(localArray1[i]);
                    }

                }
            }

            if (url1 != "" && leafData.length != 0) // && !chainType.includes("Grouping")) {
            {
                executeGetSet(url1, leafData, chainType);
                leafData = [];
            }

        }
    }

}

function yangProcessLeafContainer(yangObj, url, type, yangName, keyname) {

    var localArray1 = [];
    var configurable = "";
    var leafName = "";
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

    appendSync("Attribute Discovery: Parsing Container " + url, true, testResFileHandle);

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

            yangProcessLeafContainer(each_ele.container, url1, chainType,yangName, keyname);

        }
        if (each_ele.hasOwnProperty('list')) {

            yangProcessLeafList(each_ele.list, url1, chainType,yangName);

        }
        if (each_ele.hasOwnProperty('uses')) {

            UsesSecond(yangName, each_ele.uses, url1, chainType, keyname);
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

                localArray1 = getLeafData(leafObj, leafName, parentNode, url1, currentType, configurable,chainType, keyname);

                for (var i = 0; i < localArray1.length; i++) {
                    leafData.push(localArray1[i]);
                }
            }

        }

        if (each_ele.hasOwnProperty('leaf')) {
            var Obj = each_ele.leaf;
            for (var ele1 in Obj) {
                leafName = ele1;
                var leafObj = Obj[ele1];

                localArray1 = getLeafData(leafObj, leafName, parentNode, url1, currentType, configurable,chainType, keyname);

                for (var i = 0; i < localArray1.length; i++) {
                    leafData.push(localArray1[i]);
                }
            }
        }

        if (url1 != "" && leafData.length != 0) 
        {
            executeGetSet(url1, leafData, chainType);
            leafData = [];
        }

    }
}

//get the keyname of a list. Assuming there is a single key
function getKeyName(listObject){
    if (listObject.hasOwnProperty('key')){
        var name = listObject.key.toString();
    }
    return name
}

var elementInfo = [];

function parseElement(element){
    if (element.hasChildNodes) {
        for (var j = 0; j < element.childNodes.length; j++) {
            var child = element.childNodes[j];
            if (child.nodeType == 1) {            //This is an element node
                if((child.hasChildNodes) && (child.childNodes.length == 1)) {
                    elementInfo.push({name: child.nodeName, value: child.childNodes[0].nodeValue});
                }
                else
                    parseElement(child);
            }
        }
    }
}

function getKeyValueFromDOM(elementname, childname, parentnode){
    var resultArray = [];

    var file;
    try {
        file = fs.readFileSync(netConfUserDataXml,'utf8');
    } catch(e) {
        console.log('Error:', e.stack);
    }

    var doc = new DOMParser().parseFromString(file, 'text/xml');
    var elements = doc.getElementsByTagName(elementname);

    for (var i = 0; i < elements.length; i++) {
        if ((elements[i].parentNode.nodeName == parentnode) || (parentnode == '')) {
            elementInfo.length = 0; //Re-initializae the array to 0
            parseElement(elements[i]);
            for (var j = 0; j < elementInfo.length; j++) {
                if (childname == elementInfo[j].name)
                    resultArray.push(elementInfo[j].value);
            }
        }
    }
    resultArray = resultArray.unique();
    return resultArray;
}

Array.prototype.unique = function() {
    var a = [];
    for (i=0; i < this.length; i++) {
        var current = this[i];
        if (a.indexOf(current) < 0)
            a.push(current);
    }
    return a;
}

// creates an array of leafs in a particular node
function getLeafData(leafObj, leafName, parentNode, url1, currentType, configurable,chainType, keyname) {

    var localArray = [];
    var leafValue = [];
    var proposedValue = "";
    appendSync("Attribute Discovery: Parsing Leaf : " + leafName, true, testResFileHandle);

    if (yangFromNetConf != "") {
        var chainTypeArray = chainType.split("/");
        var indexCount = 0;
        var firstKeypos = 0;
        var keyIndexPosition = 0;
        var isList = "false";
        var listKey = "";
        var firstKey = "";
        var regexLeafNameOpen = "<"+leafName+">";
        var regexLeafNameClose = "</"+leafName+">";

        for (var i = 0; i < chainTypeArray.length; i++) {
            if(chainTypeArray[i] == 'List') {
                if (firstKeypos == 0)
                    firstKeypos = i+1;
                indexCount = indexCount + 1;
                keyIndexPosition = i+1;
                isList ="true";
            }
        }

        if (isList == "true") {
            var urlArray = url1.split("/");
            var yangFromNetConfWithoutNewLine = String(yangFromNetConf);
            yangFromNetConfWithoutNewLine = yangFromNetConfWithoutNewLine.replace(/\r?\n|\r/g, "");
            listKey = urlArray[keyIndexPosition + 1];

            if (indexCount > 1) {
                firstKey = urlArray[firstKeypos + 1];
                var regex1 = new RegExp(firstKey + "(.*?)" + listKey + "(.*?)" + regexLeafNameClose);
                var matchPattern1 = String(yangFromNetConfWithoutNewLine).match(regex1);
                if (matchPattern1) {
                    yangFromNetConfWithoutNewLine = matchPattern1[0];
                }
            }
            var key = "<" + keyname + ">";
            if (chainTypeArray[keyIndexPosition] == 'nokey')
                var regex = new RegExp( key + "(.*?)" + regexLeafNameClose);
            else
                var regex = new RegExp( key + listKey + "(.*?)" + regexLeafNameClose);
            var matchPattern = String(yangFromNetConfWithoutNewLine).match(regex);
            if (matchPattern) {
                var yangFromNetConfNew = matchPattern[0];
                var regexNew = new RegExp(regexLeafNameOpen + "(.*)" + regexLeafNameClose);
                var matchPatternNew = String(yangFromNetConfNew).match(regexNew);
                if (matchPatternNew) {
                    proposedValue = matchPatternNew[1];
                }
            }
        }
        else {
            var regex = new RegExp(regexLeafNameOpen + "(.*)" + regexLeafNameClose);
            var matchPattern = String(yangFromNetConf).match(regex);
            if (matchPattern) {
                proposedValue = matchPattern[1];
            }
        }
        if (proposedValue == "") {
            appendSync("Automated Get Operation: Leaf Value not available for "+leafName+" in retrieved Netconf data", true, testResFileHandle);
        }
        else {
            appendSync("Automated Get Operation: Leaf Name " + leafName + " and Current Value " + proposedValue, true, testResFileHandle);
        }
    }

    if (leafObj.hasOwnProperty('config')) {
        if (leafObj.config) {
            var config = leafObj.config.toString();
            localArray.push({
                config: config,
                type: leafObj.type,
                leafName: leafName,
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
            parentNode: parentNode,
            proposedValue: proposedValue,
            url: url1,
            parentNodeType: currentType,
            refine: "NA"
        });

    }

    return localArray;
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

function UsesSecond(yangModuleName, groupingName, url, type, keyname){

    var chainType = type;

    var yangModelName = yangModuleName;
    //Support for microwave-model only.
    if (yangModelName == 'yang' || yangModelName == 'g')
        return
    var yangObj = yang.parse(fs.readFileSync(__dirname+test_cases.YangDirectory + yangModelName + '.yang', 'utf8'));
    var module = yangObj.module[yangModelName];
    typeDef(module);

    appendSync("Attribute Discovery: Parsing (within Uses block) " + url, true, testResFileHandle);
    if (module.hasOwnProperty('grouping')){
        var groupingObject = module['grouping'][groupingName];

        if (groupingObject.hasOwnProperty('container')) {
            getContainer(groupingObject, yangModelName, url, chainType,module, keyname);
        }

        if (groupingObject.hasOwnProperty('list')) {
            getList(groupingObject, yangModelName, url, chainType,module);
        }

        if (groupingObject.hasOwnProperty('leaf')) {

            if (groupingObject.hasOwnProperty('config')) {
                getLeaf(groupingObject,yangModelName,url,groupingObject.config.toString(),chainType, keyname);
            }
            else {
                getLeaf(groupingObject,yangModelName,url,"",chainType, keyname);
            }
        }

        if (groupingObject.hasOwnProperty('uses')){
            if (groupingObject.uses.indexOf(":") != -1) {
                typeDef(module);
                UsesSecond(groupingObject.uses.split(":")[0],groupingObject.uses.split(":")[1],url,chainType, keyname);
            }
            else {
                UsesSecond(yangModelName,groupingObject.uses,url,chainType,keyname);
            }
        }

    }
}


function getContainer(groupingObject, yangModelName, url, type,module, keyname){

    var currentType = "Container";
    var chainType = "";
    if (type == "") {
        chainType = currentType;
    }
    else {
        chainType = type + "/" + currentType;
    }

    var containerObject = groupingObject['container'];
    appendSync("Attribute Discovery: Parsing Container (within Uses block) " + url, true, testResFileHandle);
    for (var ele in containerObject) {
        url = url + "/" + ele;
        if (containerObject[ele].hasOwnProperty('uses')){
            if (containerObject[ele].uses.indexOf(":") != -1) {
                typeDef(module);
                UsesSecond(containerObject[ele].uses.split(":")[0],containerObject[ele].uses.split(":")[1],url,chainType,keyname);
            }
            else {
                UsesSecond(yangModelName,containerObject[ele].uses,url,chainType,keyname);
            }
        }
        if (containerObject[ele].hasOwnProperty('leaf')){
            if (containerObject[ele].hasOwnProperty('config')) {
                getLeaf(containerObject[ele],yangModelName,url,containerObject[ele].config.toString(),chainType, "");
            }
            else {
                getLeaf(containerObject[ele],yangModelName,url,"",chainType, "");
            }
        }
        if (containerObject[ele].hasOwnProperty('list')){
            getList(containerObject[ele],yangModelName,url,chainType,module);
        }
        if (containerObject[ele].hasOwnProperty('container')){
            getContainer(containerObject[ele],yangModelName,url,chainType,module, keyname);
        }
    }
}

function getLeaf(groupingObject, yangModelName, url, config, chainType, keyname){

    var localArray = [];
    var leafData = [];

    var leafObject = groupingObject['leaf'];

    for (var ele in leafObject) {

        appendSync("Attribute Discovery: Parsing Leaf :" + ele + "(within Uses block) " + url, true, testResFileHandle);

        if (leafObject[ele].type.indexOf(":") != -1) {

            var yangModelName = leafObject[ele].type.split(":")[0];
            //Support for microwave-model only.
            if (yangModelName == 'yang' || yangModelName == 'g')
                continue
            var yangObj = yang.parse(fs.readFileSync(__dirname+test_cases.YangDirectory + yangModelName + '.yang', 'utf8'));
            var module = yangObj.module[yangModelName];
            if (module.hasOwnProperty('typedef')){
                var typedefObject = module['typedef'][leafObject[ele].type.split(":")[1]];
                localArray = getLeafData(leafObject[ele], ele, "", url, "", config,chainType, keyname);
            }
        }
        else {

            localArray = getLeafData(leafObject[ele], ele, "", url, "", config,chainType, keyname);
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
    var tempType = "";
    var url1 = "";
    var keyVal = "";

    if (type == "") {
        tempType = currentType;
    }
    else {
        tempType = type + "/" + currentType;
    }

    var listObject = groupingObject['list'];
    appendSync("Attribute Discovery: Parsing List (within Uses block) " + url, true, testResFileHandle);
    for (var ele in listObject) {

        var keyname = ""

        keyname = getKeyName(listObject[ele])

        if (keyname != undefined) {
            appendSync("Key for list element : " + ele + " is : " + keyname + "", true, testResFileHandle);
            var tempArray = url.split("/");
            var parentnode =  tempArray[tempArray.length-1]
            keyVal = getKeyValueFromDOM(ele, keyname, parentnode);
            if (keyVal.length == 0) {
                appendSync("Key value not supported for : " + ele + "" , true, testResFileHandle);
                keyVal.push("nokey")
            }
        }
        else {
            appendSync("Key Does Not Exists For : " + ele + "", true, testResFileHandle);
            keyVal.push("nokey")
        }

        for (var itr = 0; itr < keyVal.length; itr++) {

            if (keyVal == "nokey") {
                url1 = url + "/" + ele;
                chainType = tempType;
            }
            else {
                url1 = url + "/" + ele + "/" + keyVal[itr];
                chainType = tempType + "/" + keyVal[itr];
            }

            if (listObject[ele].hasOwnProperty('uses')){
                if (listObject[ele].uses.indexOf(":") != -1) {
                    typeDef(module);
                    UsesSecond(listObject[ele].uses.split(":")[0],listObject[ele].uses.split(":")[1],url1,chainType, keyname);
                }
                else {
                    UsesSecond(yangModelName,listObject[ele].uses,url1,chainType, keyname);
                }
            }
            if (listObject[ele].hasOwnProperty('leaf')){
                if (listObject[ele].hasOwnProperty('config')) {
                    getLeaf(listObject[ele],yangModelName,url1,listObject[ele].config.toString(),chainType, keyname);
                }
                else {
                    getLeaf(listObject[ele],yangModelName,url1,"",chainType, keyname);
                }
            }
            if (listObject[ele].hasOwnProperty('container')){
                getContainer(listObject[ele],yangModelName,url1,chainType,module, keyname);
            }
            if (listObject[ele].hasOwnProperty('list')){
                getList(listObject[ele],yangModelName,url1,chainType,module);
            }
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
            var reply="";
            stream.on('data', function (data) {
                // console.log(data.toString('utf8'));
            }).write(xmlhello);
            stream.on('data', function (data) {

                reply += data;
                //console.log(data.toString('utf8'));


                if (reply.toString('utf8').endsWith("</rpc-reply>]]>]]>"))
                {
                    writeSync(reply.toString('utf8'), true, clientFileHandle);

                }

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



function readNetConfFile(filename, cb) {

    var responce = "";

    fs.readFile(filename, function (err, data) {
        if (err) {
            responce = "";
        }
        else {
            responce = data;
        }
        setTimeout(function(){
            cb(null,responce);
        }, 1000)

    });
}


function truncateFile(fileName,cb) {
    fs.truncate(fileName, 0, function () {
        {
            //console.log('done');
            cb(null);
        }
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

