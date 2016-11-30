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
      Please see also the instrucion for the [test automation app](https://github.com/OpenNetworkingFoundation/CENTENNIAL/blob/master/03-WTP-PoC/test/INSTALL.md).

  - bower: the package manager for the web components.

      ```
      sudo npm install -g bower
      ```

The setup can be verified with the following commands:

package | min. Version
------- | -----------
java -version | 1.8
mvn --version | 3.3.9
git --version | 2.7.4
node --version | 6.7.0
npm --version | 3.10.3
jq --version | 1.5
bower --version | 1.7.9


### Step #2 - OpenDaylight and database

Example directory structure under user's home:
```
drwxrwxr-x  5 your_user_name your_user_name 4096 Okt 25 17:18 ./
drwxr-xr-x 25 your_user_name your_user_name 4096 Okt 25 16:50 ../
drwxrwxr-x 15 your_user_name your_user_name 4096 Okt 20 14:26 CENTENNIAL/
drwxrwxr-x 14 your_user_name your_user_name 4096 Okt 25 20:04 distribution-karaf-0.4.2-Beryllium-SR2/
drwxrwxr-x  6 your_user_name your_user_name 4096 Okt 25 17:18 elasticsearch-head/
```

#### Step #2.1 - Download Karaf/ Opendaylight package and unpack
The 3. ONF MWTN PoC applications are developed for OpenDaylight Beryllium-SR2 release.

```
wget https://nexus.opendaylight.org/content/groups/public/org/opendaylight/integration/distribution-karaf/0.4.2-Beryllium-SR2/distribution-karaf-0.4.2-Beryllium-SR2.tar.gz
tar -xvzf distribution-karaf-0.4.2-Beryllium-SR2.tar.gz
cd distribution-karaf-0.4.2-Beryllium-SR2/
```
The folder "distribution-karaf-0.4.2-Beryllium-SR2/" is also called "$ODL_KARAF_HOME" in the following sections.
Add an environment variable with an editor to the end of ~/.profile and ~/.bashrc

```
export ODL_KARAF_HOME="$HOME/distribution-karaf-0.4.2-Beryllium-SR2"
```
 Activate the change with
```
. .profile
```

#### Step #2.2 - Download CENTENNIAL applications 
Clone the ONF Git repository for the open source project 

```
cd ~
git clone https://github.com/OpenNetworkingFoundation/CENTENNIAL.git
cd CENTENNIAL/03-WTP-PoC/code
```

#### Step #2.3 -  Start Karaf and install ElasticSearch  
Start karaf with:
```
cd $ODL_KARAF_HOME
./bin/karaf
```

For installation and remote access of the persistent database ElasticSearch,   
please follow the instructions in [Install persistent database](./apps/persistentDatabase#installation)

### Step #3 Modify, build, install and start the PoC applications and OpenDaylight
Karaf is not running for the next steps. In Karaf CLI shutdown and confirm (yes) if necessary.
```
shutdown
```

#### Step #3.1 - Patch  
For a robust web GUI it is necessary to add a ["patch"](https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/03-WTP-PoC/code/apps/dlux) to ODL DLUX.
```
cp ./apps/dlux/loader.implementation-0.3.2-Beryllium-SR2.jar $ODL_KARAF_HOME/system/org/opendaylight/dlux/loader.implementation/0.3.2-Beryllium-SR2
```

Install necessary web components.
```
cd ./ux/mwtnCommons/mwtnCommons-module/src/main/resources/mwtnCommons/
bower install
cd ../../../../../../../
```

#### Step #3.2 - Build  
Build the applications for the 3. ONF MWTN PoC at folder 'CENTENNIAL/03-WTP-PoC/code'.
```
mvn clean install -DskipTests
```
It takes some time (frist time 20min, in my case) ...


Copy manually the bundles into the karaf system folder.
```
mkdir -p $ODL_KARAF_HOME/system/cn
mkdir -p $ODL_KARAF_HOME/system/cn/com
cp -R ~/.m2/repository/org/opendaylight/mwtn $ODL_KARAF_HOME/system/org/opendaylight
cp -R ~/.m2/repository/cn/com/zte $ODL_KARAF_HOME/system/cn/com
cp -R ~/.m2/repository/com/hcl $ODL_KARAF_HOME/system/com
cp -R ~/.m2/repository/com/highstreet $ODL_KARAF_HOME/system/com
```

#### Step #3.3 - Install and run  
Start karaf with clean:
```
cd $ODL_KARAF_HOME
./bin/karaf clean
```

Install the karaf features with the following command:
```
feature:install \
odl-netconf-connector-all \
odl-l2switch-switch \
odl-restconf-all \
odl-mdsal-apidocs \
odl-dlux-all \
odl-toaster
```
Now you should be able to add the new bundles in the karaf console.
```
feature:repo-add mvn:org.apache.karaf.decanter/apache-karaf-decanter/1.1.0/xml/features
feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/0.3.0-SNAPSHOT/xml/features
```
 ... and install them:
```
feature:install \
elasticsearch \
odl-mwt-models \
odl-mwtn-all
```
It takes some time ...

**Application for event handling**
```
feature:install odl-mwt-nodediscovery  
```

[Spectrum Management application](https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/03-WTP-PoC/code/apps/spectrum):
```
feature:repo-add mvn:com.highstreet.technologies.odl.app.spectrum/scheduler-features/1.0.0-SNAPSHOT/xml/features
bundle:install -s mvn:net.iharder/base64/2.3.9
bundle:install -s mvn:com.github.briandilley.jsonrpc4j/jsonrpc4j/1.2.0
bundle:install -s mvn:com.sun.jersey/jersey-client/1.17
feature:install odl-scheduler odl-scheduler-api odl-scheduler-rest odl-scheduler-ui
```
[Closed Loop Automation application](https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/03-WTP-PoC/code/apps/closedLoopAutomation):
```
feature:repo-add mvn:com.highstreet.technologies.odl.app/closedLoopAutomation-features/0.3.0-SNAPSHOT/xml/features
feature:install odl-closedLoopAutomation
```

Subsequent starts are without clean:
```
cd $ODL_KARAF_HOME
./bin/karaf
```