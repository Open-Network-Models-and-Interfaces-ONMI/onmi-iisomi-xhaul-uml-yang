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

To install all the required Node.js packages (Mocha, Chai, SuperTest, ... ):

```
npm install
```

Build and run the Test Environment
----------------------------------

To prepare the ONF Microwave Transport Network Test Environment:

```
grunt build-test-env 
```

  - OpenDaylight distributions are downloaded from their repositories and
    patched to automatically install the required features at boot time.
  - Docker images for NETCONF SDN mediators are built from Dokerfiles and
    ready to be used as target Network Elements.

To run the ONF Microwave Transport Network Test Environment:

```
grunt test-env
```

  - OpenDaylight SDN controller and NETCONF SDN mediators are started.
  - NETCONF SDN mediators are mounted in OpenDaylight.


Build and run the Test Suite
----------------------------

To build and start the ONF Microwave Transport Network Test Suite:

```
grunt test
```

  - All the test scripts are checked by jshint.
  - All the test scripts are executed and the test report is generated.

Contact
-------

paolo.rovelli@hcl.com

[INSTALL.md]:INSTALL.md

