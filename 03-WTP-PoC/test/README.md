ONF Microwave Transport Network Test Framework
==============================================

This document describes how to use the ONF Microwave Transport Network Test
Framework:
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
(results are found @ ./automated_test/netconf_client/core/logs)
```

To change the input settings for 01-standalone-YANG-parser, edit: ./automated_test/input/test-cases.json

Running 02-netconfserver-YANG-parser requires the mounted DVM03 resource in place
(once ODL Beryllium and DVM03 has been started as per instructions, in order to mount the netconf server it is possible to run './test-env/base_mediator/mediator-mount.sh ./config.json' after having configured properly the ./config.json file)

```


Contact
-------

paolo.spallaccini@hcl.com

[README.md]:README.md

