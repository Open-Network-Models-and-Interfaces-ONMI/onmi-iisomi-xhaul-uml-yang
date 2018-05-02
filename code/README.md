# Code

A common folder to share code for the 4th ONF Wireless PoC.

According to the software architecture ODL internal applications are stored in folder "apps" (applications), while the ODL DLUX client applications are stored in folder "ux" (user experience).

As preparation for a future PoC actually the applications *ethernetpathmanager*, *genericpathmanager*, *opticalpathmanager* are developed. 

## Software Architecture
The following figure shows the proposed software architecture.
Please consider it as a "working document" or guidelines.

![Software architecture](docs/software_architecture.png?raw=true "Software architecture")

## Installation

This chapter describes how to install the SDN-Controller OpenDaylight and the applications
of the 4.  ONF Microwave Transport Network Proof-of-Concept on Ubuntu 16.04.4
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

Example directory structure under user's home.<br>
  * ```REPO_ODL=$HOME/odl/CENTENNIAL``` points to root of the repository for this description.
  * control of the compilation and karaf container is done in the ```code*``` directory using ```./odl``` command
  * the specific environment is specified in ```dist.conf``` files. See related chapter how to configure
  * after preparing the karaf containter the link ```dist``` points to the container
  * ```distribution*``` subdirectories containing one or more karaf containers for running odl


```
Downloads
odl
├── CENTENNIAL
│   ├── bin
│   ├── code
│   │   ├── dist -> /home/herbert/odl/distribution-karaf-0.5.3-Boron-SR3
│   │   ├── dist.conf
│   │   └── :
│   ├── code-Carbon-SR1
│   │   ├── dist -> /home/herbert/odl/distribution-karaf-0.6.1-Carbon
│   │   ├── dist.conf
│   │   └── :
│   └── :
├── distribution-karaf-0.6.1-Carbon
│   ├── bin
│   └── :
└── distribution-karaf-0.5.3-Boron-SR3
    ├── bin
    └── :
```


#### Step #2.1 - Download Karaf/ Opendaylight package and unpack

The updted 4th ONF Wireless PoC applications are developed for OpenDaylight Boron-SR3 release.
Download into the Download subdirectory.

```
cd
mkdir Downloads
cd Downloads
wget https://nexus.opendaylight.org/content/groups/public/org/opendaylight/integration/distribution-karaf/0.5.3-Boron-SR3/distribution-karaf-0.5.3-Boron-SR3.tar.gz
cd ..
```

For Carbon and additional distribution is required:

```
-rw-rw-r--  1 herbert herbert 426660403 Apr  5  2017 distribution-karaf-0.5.3-Boron-SR3.tar.gz
-rw-rw-r--  1 herbert herbert 426480392 Jul 12  2017 distribution-karaf-0.6.1-Carbon.tar.gz
```

#### Step #2.2 - Download applications
Clone the Source Git repository for the open source project

```
cd ~
git clone https://github.com/OpenNetworkingFoundation/CENTENNIAL.git
cd $REPO_ODL/code
```
#### Step #2.3 -  Prepare dist.conf file

Adapt the dist.conf file to your structure. Here the example for the structure used here:

```
#Typical configuration
ODL_KARAF_DIST="distribution-karaf-0.5.3-Boron-SR3"
ODL_KARAF_HOME=$HOME/odl/$ODL_KARAF_DIST
ODL_KARAF_DISTGZ="$HOME/Downloads/"$ODL_KARAF_DIST".tar.gz"

#In case the machine is slow it helps to add a delay after each command
#ODL_KARAF_AFTERCMD_DELAY_SECONDS="0"

#Ubuntu 16.04.4 openJava location
export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"
```

#### Step #2.4 -  Use odl script

If dist.conf files is prepared, do the prepare.
  * karaf container is extracted
  * dlux patch is installed

```
cd $REPO_ODL/code
./odl prepare
```

#### Step #3.1 - Build the application

Build the applications for the 4th ONF Wireless PoC:

```
cd $REPO_ODL/code
mvn clean install -DskipTests
```
It takes some time (frist time 20min, in my case) ...

#### Step #3.2 - Install and run

Install all apps and start karaf:

```
cd $REPO_ODL/code
./odl im
```

It takes some time ...

Further applications are installed via command line, started like follows:

```
cd $REPO_ODL/code
./odl cli
```
Further apps:

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

Subsequent stop:

```
cd $REPO_ODL/code
./odl stop

```

Subsequent start without clean:

```
cd $REPO_ODL/code
./odl start

```
