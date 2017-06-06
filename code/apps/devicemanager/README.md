# Devicemanager

The devicemanager application uses a persistent database to store NE related information.


### OSS Faultmanagement umbrella

Destination of fault notifications of the network elements.

Test environment is the *evel-test-collector*.

### Configuration "eventprovider.properties"

Located in karaf under /etc
Content like here:

  ```
  #Properties for Faultmanager. Password admin admin

  eventReveicerUrl=http://127.0.0.1:30000/eventListener/v3
  autorization=Basic YWRtaW46YWRtaW4=
  sourceId=de305d54-75b4-431b-adb2-eb6b9e546014
  httpTestUrl=https://plan.fritz.box:9092/ux/#
  keyStore=etc/clientkeystore
  keyStorePassword=daylight2016
  ```


### evel-test-collector

Home: [evel-test-collector](https://github.com/att/evel-test-collector)
Environment: Ubuntu 16.04 LTS, Python 2.7.12

#### install

Clone repository and install python packet manager.
```
git clone https://github.com/att/evel-test-collector.git
sudo apt install python-pip
sudo pip install jsonschema

```
Adapt to use the test script.

  * Make the script executable.
  * Add user credentials to config file

```
cd evel-test-collector/scripts/linux
chmod 775 go-collector.sh
vi ../../config/collector.conf

```


#### usage

cd evel-test-collector/scripts/linux

