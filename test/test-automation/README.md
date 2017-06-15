# ONF WTP PoC4: Test Automation Framework
==============================================

The ONF WTP PoC4 Transport Network Test Automation (TA) Framework targets the automatic validation of interworking between an ODL based SDN controller and one or more NETCONF enabled NEs implementing the Microwave/millimeterwave Transport Network extension to  **_core-model_** and to **_microwave-model_** ([ONF Core Model 1.2 - ONF TR-512](https://www.opennetworking.org/images/stories/downloads/sdn-resources/technical-reports/TR-512_CIM_(CoreModel)_1.2.zip) and [ONF Microwave Model 1.0](https://www.opennetworking.org/images/stories/downloads/sdn-resources/technical-reports/TR-532-Microwave-Information-Model-V1.pdf))

### Description

 * The framework is based on Node.js, the well-known runtime environment for
    JavaScript. Mocha, Chai, and SuperTest provide the testing stack. The framework comprises a number of test scripts.
 * The framework includes a simple GUI to run the developed automated tests scripts on a
    pre-defined static network topology, which shall include an SDN controller and a number of suitable NEs
	

### Prerequisites

PoC4 TA Framework has been fully tested on an Ubuntu 16.04 OS

To install all the required dependencies check first [INSTALL.md].

Any typical WTP PoC4 topology may be verified leveraging the TA Framework as for example the one depicted below, including _Wireless-Transport Emulators_ ([WTEs](https://github.com/Melacon/WirelessTransportEmulator/blob/master/README.md)) and _Default Values Mediators_ ([DVMs](https://github.com/OpenNetworkingFoundation/CENTENNIAL/blob/master/code/Default_Values_Mediator/README.md))
![logo](./TA-ArchAndTopo.png)

#### Installing Node.js packages


To install all the required Node.js packages (pls check package.json file):

```commandline
npm install
```


To check npm modules installation

```commandline
npm ls
(should return an errorless installed module tree)
```

The working directory for the Test Automation Framework (`./`) is assumed to be:


```
CENTENNIAL/test/test-automation
```


### Running the Test Scripts


To run the automated test scripts directly via cmd terminal, under `./automated_tests` folder:

```commandline
node <test_case>
```


To run the automated test scripts via the Automated Test GUI, under `./`:

```commandline
npm start
(then access http://localhost:3000/ from browser)
```

#### Preparing the input files

In order to run script 01, 02 and 03 it is required to adjust the configuration file:
`./automated_test/input/test-cases.json`
for instance in the **`"mw-air-interface-pac"` : `"layer-protocol"`** value pair.

An example `test-cases.json` configuration file is shown below:

```JSON
{
  "nodeName": "Simulator-wte",
  "yangModelName": "microwave-model",
  "TestResultFile": "/logs/TestResult.log",
  "ParseDataFile": "/logs/parseData.log",
  "NetConfCapabilityXml": "/logs/capability.xml",
  "NetConfUserDataXml": "/logs/userdata.xml",
  "NetConfDataXml": "/logs/data.xml",
  "NetConfDataFile": "/logs/client.log",
  "SummaryReportFile01": "/logs/summaryReport01.log",
  "SummaryReportFile02": "/logs/summaryReport02.log",
  "SummaryReportFile03": "/logs/summaryReport03.log",
  "SummaryReportFile04": "/logs/summaryReport04.log",
  "mw-air-interface-pac": "lp-mwps-airIntf1",
  "YangDirectory": "/../../../models/yang/"
}
```

Static configuration values for all the scripts are to be set in `./config.json` file.
In particular, **Test Network Topology** comprising the SDN controller and the NEs **must be set** in this file.

An example `config.json` static configuration file is shown below:

```JSON
{
    "controller-wipro": { 
        "ip": "localhost",
        "port": "8181",
        "user": "admin",
        "passwd": "admin",
        "image": "distribution-wipro",
        "version": "master",
        "url":"http://github.com/OpenNetworkingFoundation/CENTENNIAL" 
    },
    "base-mediator": {
        "ip": "10.0.0.204",
        "port": "830",
        "user": "compila",
        "passwd": "compila+",
        "image": "mediator-ceragon",
        "version": "master",
        "url": "http://github.com/OpenNetworkingFoundation/CENTENNIAL"
    },
    "wte-1": {
        "ip": "127.0.0.253",
        "port": "12001",
        "user": "admin",
        "passwd": "admin",
        "image": "mediator-ceragon",
        "version": "master",
        "url": "http://github.com/OpenNetworkingFoundation/CENTENNIAL"
    },
    "wte-2": {
        "ip": "127.0.0.253",
        "port": "12002",
        "user": "admin",
        "passwd": "admin",
        "image": "mediator-ceragon",
        "version": "master",
        "url": "http://github.com/OpenNetworkingFoundation/CENTENNIAL"
    },
    "wte-3": {
        "ip": "127.0.0.253",
        "port": "12003",
        "user": "admin",
        "passwd": "admin",
        "image": "mediator-ceragon",
        "version": "master",
        "url": "http://github.com/OpenNetworkingFoundation/CENTENNIAL"
    },
    "model": {
        "path": "../models/yang",
        "list" : [{
            "main" : "MicrowaveModel-ObjectClasses-AirInterface",
            "rev" : "2016-09-01",
            "deps" : [
                "MicrowaveModel-TypeDefinitions",
                "CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages",
                "CoreModel-CoreNetworkModule-ObjectClasses",
		"CoreModel-CoreFoundationModule-TypeDefinitions"
            ]
        },
        {
            "main" : "MicrowaveModel-ObjectClasses-AirInterfaceDiversity",
            "rev" : "2016-09-02",
            "deps" : [
                "MicrowaveModel-TypeDefinitions",
                "CoreModel-CoreNetworkModule-ObjectClasses",
		"CoreModel-CoreFoundationModule-TypeDefinitions"
            ]
        },
        {
            "main" : "MicrowaveModel-ObjectClasses-AirInterfaceHsb",
            "rev" : "2016-08-09",
            "deps" : [
                "MicrowaveModel-TypeDefinitions",
                "CoreModel-CoreNetworkModule-ObjectClasses",
		"CoreModel-CoreFoundationModule-TypeDefinitions"
            ]
        },
        {
            "main" : "MicrowaveModel-ObjectClasses-EthernetContainer",
            "rev" : "2016-09-02",
            "deps" : [
                "MicrowaveModel-TypeDefinitions",
                "CoreModel-CoreNetworkModule-ObjectClasses",
		"CoreModel-CoreFoundationModule-TypeDefinitions"
            ]
        },
        {
            "main" : "MicrowaveModel-ObjectClasses-HybridMwStructure",
            "rev" : "2016-09-02",
            "deps" : [
                "MicrowaveModel-TypeDefinitions",
                "CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages",
                "CoreModel-CoreNetworkModule-ObjectClasses",
		"CoreModel-CoreFoundationModule-TypeDefinitions"
            ]
        },
        {
            "main" : "MicrowaveModel-ObjectClasses-PureEthernetStructure",
            "rev" : "2016-09-02",
            "deps" : [
                "MicrowaveModel-TypeDefinitions",
                "CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages",
                "CoreModel-CoreNetworkModule-ObjectClasses",
		"CoreModel-CoreFoundationModule-TypeDefinitions"
            ]
        },
        {
            "main" : "MicrowaveModel-ObjectClasses-TdmContainer",
            "rev" : "2016-09-02",
            "deps" : [
                "MicrowaveModel-TypeDefinitions",
                "CoreModel-CoreNetworkModule-ObjectClasses",
		"CoreModel-CoreFoundationModule-TypeDefinitions"
            ]
        },
        {
            "main" : "MicrowaveModel-ObjectClasses-SuperClasses",
            "rev" : "2016-08-09",
            "deps" : [
		"CoreModel-CoreFoundationModule-TypeDefinitions"
            ]
        },
        {
            "main" : "CoreModel-CoreNetworkModule-ObjectClasses",
            "rev" : "2016-03-27",
            "deps" : [
                "CoreModel-CoreNetworkModule-TypeDefinitions",
                "CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages",
                "CoreModel-CoreFoundationModule-StateModel"
            ]
        }]
    },
    "topology": [
        {
            "type": "controller-wipro",
            "ip": "localhost",
            "name": "controller-config"
        },
        {
            "type": "base-mediator",
            "ip": "10.0.0.204",
            "name": "Simulator-99", 
            "config" : {
                "ne" : "Simulator-99",
                "event" : "10"
            }
        },
        {
            "type": "wte-1",
            "ip": "127.0.0.253",
            "name": "Simulator-1", 
            "config" : {
                "ne" : "Simulator-1",
                "event" : "10"
            }
        },
        {
            "type": "wte-2",
            "ip": "127.0.0.253",
            "name": "Simulator-2", 
            "config" : {
                "ne" : "Simulator-2",
                "event" : "10"
            }
        },
        {
            "type": "wte-3",
            "ip": "127.0.0.253",
            "name": "Simulator-3", 
            "config" : {
                "ne" : "Simulator-3",
                "event" : "10"
            }
        }
    ]
}

```

#### Test Results logs

Logfiles produced by the scripts can be found under folder: `./automated_tests/logs/`


`parseData.log`: contains details for all the discovered YANG models attributes in the automated tests.

`TestResult.log`: contains actions log details for the script that has been run.

`client.log`: contains client details logs.

`summaryReportXX.log`: contains summary reports for GET/SET actions.

`capability.xml`: dump of NE netconf capabilities in the xml format

`data.xml`: dump of running configuration data in the xml format

`userdata.xml`: proposed new configuration data in the xml format


### Automated Test scripts details

Scripts 01-, 02-, 03- have not been modified in their functionality with respect to PoC3 Test Automation Framework release. Script 04- has been introduced for PoC4.

 * Script <01-standalone-YANG-parser.js>
    **does not require** the mounted mediator (or DVM, or WTE) resource in place (see file header for purpose description).

 * Script <02-netconfserver-YANG-parser.js>
    requires the mounted mediator (or DVM, or WTE) resource in place (see file header for purpose description).

 * Script <03-netconfserver-YANG.js>
    requires the mounted mediator (or DVM, or WTE) resource in place (see file header for purpose description).

 * Script <04-netconf-YANG-ConfigurableData.js>
    requires the mounted mediator (or DVM, or WTE) resource in place. It performs Close Loop evaluation of Read and Configure operations with flexible & configurable test data. It is ultimately responsible for netconf capability exchange and fetching the running configuration data from NEs and dumping both these xml responses in the `client.log` file. It then further splits the capability and data `.xml` into two separate files `capability.xml` and `data.xml` respectively.
    **The user is presented with `data.xml` in the GUI input text box** when he selects _04-netconf-YANG-ConfigurableData.js_ script from GUI dropdown list. **He can then choose to modify the data for the leaf nodes of _microwave-model_ configuration and click the "Execute" button to submit his input.** On execution, the user input is first saved in `userdata.xml`file; the script then picks the user data from `userdata.xml` and performs the Get/Set and validation functionality. Finally, the script generates the summary report.
    The script can generate error logs in `TestResult.log` for reporting any GET/PUT and ‘netconf’ issue. Also, in case the PUT operation fails due to a wrong input from user, a "failed" status in the GUI summary report is displayed for that URL


Contacts
--------


paolo.spallaccini@hcl.com

saurabhchattopadhya@hcl.com


[README.md]:README.md

