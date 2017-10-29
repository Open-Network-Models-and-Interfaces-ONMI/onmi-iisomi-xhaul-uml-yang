# Code
A common folder to share code for the 4th ONF Wireless PoC.

According to the software architecture ODL internal applications are stored in folder "apps" (applications), while the ODL DLUX client applications are stored in folder "ux" (user experience).

## Software Architecture
The following figure shows the proposed software architecture. 
Please consider it as a "working document" or guidelines.

![Software architecture](software_architecture.png?raw=true "Software architecture")

## Installation


This chapter describes how to install the SDN-Controller OpenDaylight and the applications
of the 4.  ONF Microwave Transport Network Proof-of-Concept on Ubuntu 16.04. 
These instructions should also work on other Debian derivative distributions.


### Step #1 Preparations

  - java-jdk 8: the Java development kit.  - 

      openJdk 8 is recommended. Here the install procedure: [ubuntu openjdk](https://wiki.ubuntuusers.de/Java/Installation/OpenJDK/)
      ```
      sudo apt-get update
      [sko] can we delete this line? sudo apt-get install openjdk-8-jre icedtea-8-plugin 
      sudo apt-get install openjdk-8-jdk openjdk-8-demo openjdk-8-doc openjdk-8-jre-headless openjdk-8-source 
      ```
      Add the JAVA_HOME variable to /etc/environment after install and run source.
      ```
      export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"
      export ODL_KARAF_HOME="$HOME/distribution-karaf-0.5.3-Boron-SR3"
      source /etc/environment
      ```
      
  - maven:  the Apache build manager for Java projects.
       
      Is within the ubuntu repository.

      ```
      sudo apt-get install maven
      ```

      OpenDaylight requires specific maven settings. Please see  [ODL wiki](https://wiki.opendaylight.org/view/GettingStarted:Development_Environment_Setup#Edit_your_.7E.2F.m2.2Fsettings.xml)      
      
      ```
      mkdir -p ~/.m2 && \
      if [ -e ~/.m2/settings.xml ] ; then ; cp -n ~/.m2/settings.xml{,.orig} ; fi && \
      wget -q -O - https://raw.githubusercontent.com/opendaylight/odlparent/master/settings.xml > ~/.m2/settings.xml
      ```
       
  - git: the version control system.

      ```
      sudo apt-get install git
      ```

  - node.js: the JavaScript runtime environment.  - 

      For ht standard purpose node 4.2.6 is ok.
      ```
      sudo apt-get install nodejs npm jq --
      sudo ln -s /usr/bin/nodejs /usr/bin/node
      ```
      
      // [sko] There is no test automation app - shall we remove the next 5 lines
      Please see also the instrucion for the [test automation app](https://github.com/OpenNetworkingFoundation/CENTENNIAL/blob/master/test/INSTALL.md).
      For this specific extension a node 6.x has to be installed.
      ```
      sudo update-alternatives --install /usr/bin/node node /usr/bin/nodejs 150
      sudo update-alternatives --config node
      ```

  - bower: the package manager for the web components.

      ```
      sudo npm install -g bower
      ```
      // [sko] bower should be switched to npm ...

 - unzip: for install.sh script.

      ```
      sudo apt-get install unzip
      ```


The setup can be verified with the following commands:

package | min. Version
------- | -----------
java -version | 1.8
mvn --version | 3.3.9
git --version | 2.7.4
node --version | 4.2.6 (For some non ht apps 6.7.0 is required)
npm --version | 3.10.3
jq --version | 1.5
bower --version | 1.7.9


### Step #2 - OpenDaylight and database

Example directory structure under user's home:
```
drwxrwxr-x  5 your_user_name your_user_name 4096 Okt 25 17:18 ./
drwxr-xr-x 25 your_user_name your_user_name 4096 Okt 25 16:50 ../
drwxrwxr-x 14 your_user_name your_user_name 4096 Okt 25 20:04 Downloads/
drwxrwxr-x 15 your_user_name your_user_name 4096 Okt 20 14:26 SDN-Projects-Boron/
drwxrwxr-x 14 your_user_name your_user_name 4096 Okt 25 20:04 distribution-karaf-0.5.1-Boron-SR1/
```

#### Step #2.1 - Download Karaf/ Opendaylight package and unpack
The 4th ONF Wireless PoC applications are developed for OpenDaylight Boron-SR1 release.
Download it into the Download subdirectory.

```
cd
mkdir Downloads
cd Downloads
wget https://nexus.opendaylight.org/content/groups/public/org/opendaylight/integration/distribution-karaf/0.5.3-Boron-SR3/distribution-karaf-0.5.3-Boron-SR3.tar.gz
cd ..
```
The folder "distribution-karaf-0.5.3-Boron-SR3/" is also called "$ODL_KARAF_HOME" in the following sections.
Add an environment variable with an editor to the end of ~/.profile
```
export ODL_KARAF_DIST="distribution-karaf-0.5.3-Boron-SR3"
export ODL_KARAF_HOME="$HOME/$ODL_KARAF_DIST"
```
 Activate the change with
```
source .profile
```

#### Step #2.2 - Download SDN-Projects-Boron applications 
Clone the Source Git repository for the open source project 

```
cd ~
git clone https://git-highstreet-technologies.com/highstreet/SDN-Projects-Boron.git
cd SDN-Projects-Boron/code
```
#### Step #2.3 -  Prepare database configuration
Copy the database setup template for a single node into the activeConfig.
If there are more database within you network change "sdnlabod" within the configuration files to a different name.
If not changes the database cluster has the name "sdnlabodl".
```
cd SDN-Projects-Boron/code/apps/persistantDatabase
mkdir -p activeConfig
cp -r activeConfigExamples/sdnlabodl/* activeConfig 
```

#### Step #2.4 -  Use install script
If the install sript is used proceed here. 
If not proceed with step 2.5.
```
cd SDN-Projects-Boron/code
./install.sh prepare
```
If the database setup is done the script expects an enter to proceed.
Befor doing this you can verify the setup with the broser: [Check database](http://localhost:9200/_plugin/head)
Press enter if checked.

Proceed with step 3.2

#### Step #2.5 -  Start Karaf and install ElasticSearch  
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
For a robust web GUI it is necessary to add a ["patch"](https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/code/apps/dlux) to ODL DLUX.
```
cp ./apps/dlux/loader.implementation-0.4.3-Boron-SR3.jar $ODL_KARAF_HOME/system/org/opendaylight/dlux/loader.implementation/0.4.3-Boron-SR3
```

#### Step #3.2 - Build  
Build the applications for the 4th ONF Wireless PoC at folder 'CENTENNIAL/code'.
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
feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/0.4.0-SNAPSHOT/xml/features
```
 ... and install them:
```
feature:install \
elasticsearch \
odl-mwt-models \
odl-mwtn-all
```
It takes some time ...

[Spectrum Management application](https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/code/apps/spectrum):
```
feature:repo-add mvn:com.highstreet.technologies.odl.app.spectrum/scheduler-features/1.0.0-SNAPSHOT/xml/features
bundle:install -s mvn:net.iharder/base64/2.3.9
bundle:install -s mvn:com.github.briandilley.jsonrpc4j/jsonrpc4j/1.2.0
bundle:install -s mvn:com.sun.jersey/jersey-client/1.17
feature:install odl-scheduler odl-scheduler-api odl-scheduler-rest odl-scheduler-ui
```
[Closed Loop Automation application](https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/code/apps/closedLoopAutomation):
```
feature:repo-add mvn:com.highstreet.technologies.odl.app/closedLoopAutomation-features/0.3.0-SNAPSHOT/xml/features
feature:install odl-closedLoopAutomation
```

Subsequent starts are without clean:
```
cd $ODL_KARAF_HOME
./bin/karaf
```
