ONF Wireless-Transport WG PoC3: Microwave Transport Network Test Automation Framework
==============================================

This document describes how to use the ONF Microwave Transport Network Test
Automation Framework:
  - The framework is based on Node.js, the well-known runtime environment for
    JavaScript. Mocha, Chai, and SuperTest provide the testing stack, while
    Grunt is used to automate tasks. The framework comprises a number of test scripts.
  - The framework could also be leveraged to create a simulated test environment, acting as a
    network simulator, actually composed of one OpenDaylight SDN controller
    and many NETCONF SDN mediators emulating Network Elements.
  - The framework includes a simple GUI to run the automated tests scripts on a
    defined static network topology
	

To install all the required dependencies check first [INSTALL.md].

Installing Node.js packages
------------------------

To install all the required Node.js packages (pls check package.json file):

```
npm install
```


To check npm modules installation

```
npm ls
(should return an errorless installed module tree)
```

The working directory for the Test Automation Framework (./) is assumed to be:


```
CENTENNIAL/03-WTP-PoC/test
```


Running the Test Scripts
----------------------------------


To run the automated test scripts directly via cmd terminal, under "./automated_tests" folder:

```
node <test_case>
```


To run the automated test scripts via the Automated Test GUI, under "./":

```
npm start
(then access http://localhost:3000/ from browser)
```

Accessing the Test Results
----------------------------------

Logfiles produced by the scripts can be found under folder: "./automated_tests/logs/"

There are:

"parseData.log", containing details for all the discovered YANG models attributes in the automated tests.

"TestResult.log", containing actions log details for the script that has been run.

"client.log", containing client details logs.


Static configuration values for all the scripts are to be set in "./config.json" file. PoC Topology must be set in this file.

Test Cases configuration values for all the scripts "./automated_test/input/test-cases.json" (file content is self-explanatory).


Automated Test scripts details
----------------------------------

Script <01-standalone-YANG-parser.js> DOES NOT require the mounted mediator (or DVM03) resource in place (see file header for purpose description).

Script <02-netconfserver-YANG-parser.js> requires the mounted mediator (or DVM03) resource in place (see file header for purpose description).

Script <03-netconfserver-YANG.js> requires the mounted mediator (or DVM03) resource in place (see file header for purpose description).


In order to mount a PoC3 DVM03 chosen topology it is possible to leverage a provided script:


```
./test-env/base-mediator/mediator-mount.sh ./config.json

```

after having filled properly the "./config.json" file



Contact
-------

paolo.spallaccini@hcl.com

[README.md]:README.md

