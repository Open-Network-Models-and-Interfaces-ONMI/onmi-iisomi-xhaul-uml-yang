ONF Microwave Transport Network Test Framework
==============================================

This document describes how to use the ONF Microwave Transport Test Framework.
  - The framework is based on Node.js, the well-known runtime environment for
    JavaScript. The Mocha module is used as Unit-Test library, while Grunt is
    used to automate tasks.
  - The framework could also be used to build and start the Test Environment,
    actually composed of one Opendaylight SDN controller and many NETCONF
    MEDIATORS to simulate Network Elements.

To install all the required dependencies, please read [INSTALL.md].

Install Node.js packages
------------------------

To install all the required Node.js packages (Mocha, Chai, SuperTest, ... ):

```
npm install
```

Build and run the Test Environment
----------------------------------

To prepare the ONF Microwave Transport Test Environment:

```
grunt build-test-env 
```

  - OpenDaylight distributions are downloaded from the repositories and
    patched to automatically install the required features at boot time.
  - Docker images for NETCONF MEDIATORS are built from Dokerfiles and ready
    to be used as target Network Elements.

To run the ONF Microwave Transport Test Environment:

```
grunt test-env
```

  - OpenDaylight SDN controller and NETCONF mediators are started.
  - NETCONF mediators are mounted in OpenDaylight.


Build and run the Test Suite
----------------------------

To build and start the ONF Microwave Transport Test Suite:

```
grunt test
```

  - All the test scripts are checked by jshint.
  - All the test scripts are executed and the test report is generated.

Contact
-------

paolo.rovelli@hcl.com

[INSTALL.md]:INSTALL.md

