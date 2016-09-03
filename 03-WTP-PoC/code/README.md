# Code
A common folder to share code for the 3. ONF MWTN PoC.

According to the software architecture ODL internal applications are stored in folder "apps" (applications), while the ODL DLUX client applications are stored in folder "ux" (user experience).

## Software Architecture
The following figure shows the proposed software architecture. 
Please consider it as a "working document" or guidelines.

![Software architecture](software_architecture.png?raw=true "Software architecture")

## Installation


This chapter describes how to install the SDN-Controller OpenDaylight and the applications
of the 3.  ONF Microwave Transport Network Proof-of-Concept on Ubuntu 16.04. 
These instructions should also work on other Debian derivative distributions.


### Step #1 Preparations

  - java-jdk: the Java development kit.

      ```
      sudo add-apt-repository ppa:webupd8team/java
      sudo apt-get update
      sudo apt-get install oracle-java8-installer
      sudo apt-get install oracle-java8-set-default
      ```

  - maven: the Apache build manager for Java projects.

      ```
      wget https://archive.apache.org/dist/maven/maven-3/3.3.3/binaries/apache-maven-3.3.3-bin.tar.gz
      sudo tar xzvf apache-maven-3.3.3-bin.tar.gz -C /usr/share/
      sudo update-alternatives --install /usr/bin/mvn mvn /usr/share/apache-maven-3.3.3/bin/mvn 150
      sudo update-alternatives --config mvn
      ```

      OpenDaylight requires specific maven settings. Please see  [ODL wiki](https://wiki.opendaylight.org/view/GettingStarted:Development_Environment_Setup#Edit_your_.7E.2F.m2.2Fsettings.xml)      
      
      ```
      cp -n ~/.m2/settings.xml{,.orig} ; \
      wget -q -O - https://raw.githubusercontent.com/opendaylight/odlparent/master/settings.xml > ~/.m2/settings.xml
      ```
       
  - node.js: the JavaScript runtime environment.

      ```
      sudo apt-get install nodejs npm jq
      sudo update-alternatives --install /usr/bin/node node /usr/bin/nodejs 150
      sudo update-alternatives --config node
      ```

  - bower: the package manager for the web components.

      ```
      sudo npm install -g bower
      ```

### Step #2 - Download, unpack and start OpenDaylight

The 3. ONF MWTN PoC applications are developed for OpenDaylight Beryllium-SR2 release.

```
wget https://nexus.opendaylight.org/content/groups/public/org/opendaylight/integration/distribution-karaf/0.4.2-Beryllium-SR2/distribution-karaf-0.4.2-Beryllium-SR2.tar.gz
tar -xvzf distribution-karaf-0.4.2-Beryllium-SR2.tar.gz
cd distribution-karaf-0.4.2-Beryllium-SR2/
```
The folder "Distribution-karaf-0.4.2-Beryllium-SR2/" is also called "$KARAF_HOME" in the following sections.

Start karaf with:

```
./bin/karaf
```

### Step #3 Clone, build and install the applications.
Open a new terminal and clone the ONF Git repository for the open source project 

```
git clone https://github.com/OpenNetworkingFoundation/CENTENNIAL.git
cd CENTENNIAL/03-WTP-PoC/code
```
Install necessary web components.
```
cd ./ux/mwtnCommons/mwtnCommons-module/src/main/resources/mwtnCommons/
bower install
cd ../../../../../../../
```

Build the applications for the 3. ONF MWTN PoC.
```
mvn clean install -DskipTests
```
It takes some time ...


Copy manually the bundles into the karaf system folder.
```
mkdir -p $KARAF_HOME/system/cn && \
mkdir -p $KARAF_HOME/system/cn/com && \
cp -R ~/.m2/repository/org/opendaylight/mwtn $KARAF_HOME/system/org/opendaylight  && \
cp -R ~/.m2/repository/cn/com/zte $KARAF_HOME/system/cn/com  && \
cp -R ~/.m2/repository/com/hcl $KARAF_HOME/system/com  && \
cp -R ~/.m2/repository/com/highstreet $KARAF_HOME/system/com
```

Now you should be able to add the new bundles in the karaf console.
```
feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/0.3.0-SNAPSHOT/xml/features
```
For remote access of the persistent database ElasticSearch, please consider the instructions in the following chapter:
 -* [Persistent database](./apps/persistentDatabase#installation)


Install the karaf features with the following command:
```
feature:install \
odl-netconf-connector-all \
odl-restconf-all \
odl-l2switch-switch \
odl-mdsal-apidocs \
odl-dlux-all \odl-toaster \elasticsearch \
odl-mwtn-all

```
It takes some time ...
