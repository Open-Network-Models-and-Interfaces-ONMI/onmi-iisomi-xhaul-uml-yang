# Java based Test Client

This project implements a [Apache HttpClient](https://hc.apache.org/httpcomponents-client-ga/index.html) based RestConf Test Client to verify the ONF Wireless Model (TR 532) against an [Opendaylight](www.opendaylight.org) SDN Controller. 

Please follow the instruction to install and setup Opendaylight and a Default Value Mediator:
* [https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/code](https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/code)
* [https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/code/Default_Values_Mediator](https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/code/Default_Values_Mediator)

## Usage

Please see the [example implementation](https://github.com/OpenNetworkingFoundation/CENTENNIAL/blob/master/test/test-client/test-cases/example/src/main/java/com/highstreet/technologies/test/testCase/example/TestExample.java) for a simple test case, which configures an "airInterfaceName".

Create a Test Client:
```
TestClient validationClient = new TestClient();
```

Perform a GET request:
```
Result getResult = validationClient.get(address);
```

Perform a GET request:
```
Result setResult = validationClient.set(address, value);
```
Please not the a set() will perform a HTTP-PUT.
