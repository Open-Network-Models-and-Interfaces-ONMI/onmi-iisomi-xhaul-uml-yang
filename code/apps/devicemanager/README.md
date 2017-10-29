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

### Configuration "aotsmconnector.properties"

Located in karaf under /etc
Content like here:

  ```
  #Properties

  #soapurladd=off
  soapurladd=http://soapserver.fritz.box/addmobility.php
  #http timeout in seconds
  soapaddtimeout=10
  
  #soapurlinq=off
  soapurlinq=http://soapserver.fritz.box/inquire.php
  #http timeout in seconds
  soapinqtimeout=10
   
  #credentials
  userName=user
  userPassword=passwd
  systemuser=user
  assignedto=anotheruserid

  #smtp fallback
  #comment out if off
  smtpHost=smtp.xxx.tld
  smtpPort=587
  smtpUsername=user
  smtpPassword=passwd
  smtpSender=odl@xxx.tld
  smtpReceivers=email1@example.com,email2@example.com
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

