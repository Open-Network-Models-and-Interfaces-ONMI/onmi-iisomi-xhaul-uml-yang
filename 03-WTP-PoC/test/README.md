ONF WTWG PoC 3 Microwave Transport Network Test Automation
==============================================

This document describes how to use the ONF Microwave Transport Network Test
Automation Framework:
  - The framework is based on Node.js, the well-known runtime environment for
    JavaScript. Mocha, Chai, and SuperTest provide the testing stack, while
    Grunt is used to automate tasks.
  - The framework could also be used to create a Test Environment, acting as a
    network simulator, actually composed of one OpenDaylight SDN controller
    and many NETCONF SDN mediators emulating Network Elements.

To install all the required dependencies check first [INSTALL.md].

Install Node.js packages
------------------------

To install all the required Node.js packages (pls check package.json file):

```
npm install
```


To check npm modules installation

```
npm ls
(should resturn an errorless installed module tree)
```

Run the Test Scripts
----------------------------------

To run the automated tests under node js:

```
node <test_case>
```

Logfiles produced by the scripts can be found under folder: ./automated_test/netconf_client/core/logs.

Static configuration values for all the scripts are to be set in ./config.json file.


Script <01-standalone-YANG-parser.js> DOES NOT require the mounted DVM03 resource in place and can be executed from a terminal.

(For the above script only, ./automated_test/input/test-cases.json file must be set to specify the YANG models/containers to be parsed.)

Script <02-netconfserver-YANG-parser.js> requires the mounted DVM03 resource in place.

Script <03-netconfserver-YANG.js> requires the mounted DVM03 resource in place


In order to mount the netconf server it is possible to leverage the script: './test-env/base-mediator/mediator-mount.sh ./config.json' after having filled properly the ./config.json file



Contact
-------

paolo.spallaccini@hcl.com

[README.md]:README.md

