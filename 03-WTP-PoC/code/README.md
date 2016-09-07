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
      export JAVA_HOME="/usr/lib/jvm/java-8-oracle"
      ```
      Feel free to add the JAVA_HOME variable to /etc/environment.
      
      
  - maven: the Apache build manager for Java projects.
           Follow the [maven installation](https://maven.apache.org/install.html) instructions.
       
       Here a short version.

      ```
      wget https://archive.apache.org/dist/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz
      sudo tar xzvf apache-maven-3.3.9-bin.tar.gz -C /usr/share/
      sudo update-alternatives --install /usr/bin/mvn mvn /usr/share/apache-maven-3.3.9/bin/mvn 150
      sudo update-alternatives --config mvn
      export PATH=/usr/share/apache-maven-3.3.9/bin:$PATH
      ```

      Feel to update PATH variable in /etc/environment.

      OpenDaylight requires specific maven settings. Please see  [ODL wiki](https://wiki.opendaylight.org/view/GettingStarted:Development_Environment_Setup#Edit_your_.7E.2F.m2.2Fsettings.xml)      
      
      ```
      mkdir -p ~/.m2 && \
      cp -n ~/.m2/settings.xml{,.orig} ; \
      wget -q -O - https://raw.githubusercontent.com/opendaylight/odlparent/master/settings.xml > ~/.m2/settings.xml
      ```
       
  - git: the version control system.

      ```
      sudo apt-get install git
      ```

  - node.js: the JavaScript runtime environment.

      ```
      sudo apt-get install nodejs npm jq --
      sudo update-alternatives --install /usr/bin/node node /usr/bin/nodejs 150
      sudo update-alternatives --config node
      sudo ln -s /usr/bin/nodejs /usr/bin/node
      ```

  - bower: the package manager for the web components.

      ```
      sudo npm install -g bower
      ```

The setup can be verified with the following commands:
```
java -version
mvn --version
git --version
node --version
npm --version
jq --version
bower --version
```

### Step #2 - Download, unpack and start OpenDaylight

The 3. ONF MWTN PoC applications are developed for OpenDaylight Beryllium-SR2 release.

```
wget https://nexus.opendaylight.org/content/groups/public/org/opendaylight/integration/distribution-karaf/0.4.2-Beryllium-SR2/distribution-karaf-0.4.2-Beryllium-SR2.tar.gz
tar -xvzf distribution-karaf-0.4.2-Beryllium-SR2.tar.gz
cd distribution-karaf-0.4.2-Beryllium-SR2/
```
The folder "Distribution-karaf-0.4.2-Beryllium-SR2/" is also called "$ODL_KARAF_HOME" in the following sections.

Start karaf with:

```
./bin/karaf
```

You may would like to add an environment variable to /etc/environment: $ODL_KARAF_HOME="/home/demx8as6/distribution-karaf-0.4.2-Beryllium-SR2"


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

Build the applications for the 3. ONF MWTN PoC at folder 'CENTENNIAL/03-WTP-PoC/code'.
```
mvn clean install -DskipTests
```
It takes some time (frist time 20min, in my case) ...


Copy manually the bundles into the karaf system folder.
```
mkdir -p $ODL_KARAF_HOME/system/cn && \
mkdir -p $ODL_KARAF_HOME/system/cn/com && \
cp -R ~/.m2/repository/org/opendaylight/mwtn $ODL_KARAF_HOME/system/org/opendaylight  && \
cp -R ~/.m2/repository/cn/com/zte $ODL_KARAF_HOME/system/cn/com  && \
cp -R ~/.m2/repository/com/hcl $ODL_KARAF_HOME/system/com  && \
cp -R ~/.m2/repository/com/highstreet $ODL_KARAF_HOME/system/com
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
elasticsearch \
odl-netconf-connector-all \
odl-l2switch-switch \
odl-restconf-all \
odl-mdsal-apidocs \
odl-dlux-all \
odl-toaster \
odl-mwtn-all
```
It takes some time ...