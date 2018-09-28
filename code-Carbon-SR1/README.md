# Setting up CENTENNIAL environment for Opendaylight Carbon SR1

This *code-Carbon-SR1* folder does compile the sources from *code* in a Opendaylight Carbon SR1 context.
Mainly all the pom.xml files are adapted to refer to the Carbon SR1 related version numbers.
Sources are used from source directory under the *code*-tree, referenced by symbolic links.

  * Section A: **Download, extract and run Opendaylight**
  * Section B: **Development environment**

HINTs

  - HINT 1: Not all applications, available under code/apps are integrated into code-Carbon-SR1/apps.
  - HINT 2: Modify the code under the *code* subdirectory. Modify in a way that it can be used in Boron and Carbon.

## A. Download, extract and run Opendaylight

Directory structure for preconfigured download package

  - $HOME
    - Downloads
    - odl
      - distribution-karaf-0.6.1-Carbon-poc5

Server prerequirements: VM (CPU:4Core, Ram:4Gig, HD:16Gig), Ubuntu 16.04 or 18.04 Server or Desktop, openJdk 8

HINT: if the structure is different adapt the *dist.conf* file in the root-directory of the container.

     #PoC5 configuration
     ODL_KARAF_DIST="distribution-karaf-0.6.1-Carbon-poc5"
     ODL_KARAF_HOME=$HOME/odl/$ODL_KARAF_DIST
     ODL_KARAF_DISTGZ="$HOME/Downloads/"$ODL_KARAF_DIST".tar.gz"
     export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"

     ODL_KARAF_STARTUP_SCRIPT="karaf_startup_all"


#### The steps to install and run Opendaylight Carbon SR1 are

##### Step1: Download prepared Karaf/ODL/CENTENIAL Apps - tar.gz file (500 MB)

	cd ~/Downloads
    wget https://cloud-highstreet-technologies.com/nextcloud/index.php/s/7E88GLpPMwwPaDz  -O distribution-karaf-0.6.1-Carbon-poc5.015.004.tar.gz

Older downloads:
  * 001.003: <code>wget https://cloud-highstreet-technologies.com/nextcloud/index.php/s/9GLwSkXZxkKBXT3/download -O distribution-karaf-0.6.1-Carbon-poc5.001.003.tar.gz</code>


##### Step2: Extract tar.gz

Unpack karaf and included odl micro apps. (No karaf is running on server ./odl/)

    cd ~/odl
    tar -xzf ../Downloads/distribution-karaf-0.6.1-Carbon-poc5.015.004.tar.gz

##### Step3: Run Opendaylight

Start Opendaylight. Give about 1-2 minute to startup.

     cd ~/odl/distribution-karaf-0.6.1-Carbon-poc5
     ./odl karafclean


##### Have fun

Sim2230 is part of the delivery. Start Sim2230 as NETCONF device for test purpose.

     cd ~/odl/distribution-karaf-0.6.1-Carbon-poc5/Sim2230/build
     ./noYuma_p2230.sh

HINT for Sim2230
  * Let this session OPEN to see the connect and message exchange
  * Simulator Sim2230 runns only if session stays open and running
  * Stop and leave Sim2230 with *quit<enter>*

With client browser connect to URL and login with admin / admin

     http://<ip/name>:8181/index.html

You can see the Opendaylight DLUX interface in the browser with applications.
Use connect UX applicaton to connect to simulator by creating a mountpoint

     Name: Sim2230
     IP Address: 127.0.0.1
     port: 2230
     Username: admin
     Password: admin
     Required: check

What you see

  - See connected Sim2230 in connect app/Required network elements
  - See in fault app two alarms active for Sim2230
  - Correct Sim2230 output looks like this

```
     20180927T183108 NE:Network element root: //data/network-element
     20180927T183108 NE:device info uuid'NE-12'
     20180927T183108 Configuring server...
     20180927T183108 Host: '0.0.0.0', listenig port: 2230
     20180927T183108 Server configured.
     20180927T183108 Starting server...
     20180927T183108 Server started.
     20180927T183935 Register user command listener: 24772884
     20180927T183935 MP875071020:Hello
     20180927T183935 MP875071020:Get[m-0]  matches netconf-state: schemas:
     20180927T183935 MP875071020:get-schema [m-1] message
     20180927T183935 NE:Load schema: ../yang/yangNeModel/iana-crypt-hash@2014-04-04.yang
     20180927T183936 MP875071020:CreateSubscription[m-0]create-subscription: stream:NETCONF
     20180927T183936 MP875071020:Get[m-1]  matches network-element:
     20180927T183936 MP875071020:Get[m-2]  matches mw-pure-ethernet-structure-pac: layer-protocol:LP-MWS-RADIO pure-ethernet-structure-current-problems:
     20180927T183936 MP875071020:Get[m-3]  matches mw-air-interface-pac: layer-protocol:LP-MWPS-TTP-RADIO air-interface-current-problems:
```

##### Further commands

  * Stop container: ./odl stop
  * Get version and run status: ./odl status

## B. Development environment

### Recommended directory structure

Directory structure for development or compilation of Opendaylight apps in a clone of CENTENNIAL repository. The structure is used by scripts to provide creation of a running Opendaylight instance running CENTENNIAL apps as server component or for DLUX.

   - $HOME/Downloads
   - $HOME/odl
      - WirelessTransportEmulator [from here: git MELACON](https://github.com/Melacon/WirelessTransportEmulator.git)
      - CENTENNIAL [from here: git](https://github.com/OpenNetworkingFoundation/CENTENNIAL.git)


Working locations:

  - for compiling Carbon code and managing the Carbon karaf container is here: **$HOME/odl/CENTENNIAL/code-Carbon-SR1**
  - Working directory for source code editing for Boron base is here: **$HOME/odl/CENTENNIAL/code**

### Steps

#### 0. Do the installation of Java, maven, git npm and so on form the Boron/code description

Versions of tools that we use today (April 2018):
  - Apache Maven 3.3.9
  - Maven home: /usr/share/maven
  - Java version: 1.8.0_162, vendor: Oracle Corporation
  - Java home: /usr/lib/jvm/java-8-openjdk-amd64/jre
  - Default locale: en_US, platform encoding: UTF-8
  - OS name: "linux", version: "4.13.0-37-generic", arch: "amd64", family: "unix"
  - git version 2.7.4
  - node: v4.2.6
  - npm: 3.5.2
  - jq: jq-1.5-1-a5b5cbe
  - bower 1.8.0


#### 1. Download Carbon SR1 container

    cd $HOME/Downloads
    wget Carbon tar https://nexus.opendaylight.org/content/groups/public/org/opendaylight/integration/distribution-karaf/0.6.1-Carbon/distribution-karaf-0.6.1-Carbon.tar.gz

#### 2. Creating dist.conf file

    cd $HOME/odl/CENTENNIAL/code-Carbon-SR1

Create the file "dist.conf" with VI or any editor. Adapt template:

    #Own configuration
    #Mandatory
    ODL_KARAF_DIST="distribution-karaf-0.6.1-Carbon"
    ODL_KARAF_HOME=$HOME/odl/$ODL_KARAF_DIST
    ODL_KARAF_DISTGZ="$HOME/Downloads/"$ODL_KARAF_DIST".tar.gz"
    export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"
    #Optional for TAR build file creation
    #If system is to slow it may be appropriate to specify a delay
    #ODL_KARAF_AFTERCMD_DELAY_SECONDS="20"
    ODL_BUILD_HOME="$HOME/build/att"
    ODL_KARAF_STARTUP_SCRIPT="karaf_startup_all"


#### 3. Compile everything to m2

    cd $HOME/odl/CENTENNIAL/code-Carbon-SR1
    mvn clean install -DskipTests

Should end without error indication

#### 4. Prepare container

The *odl* script is replacing the older "install.sh" script collection. It will use the local settings, specified in dist.conf and can manage the karaf container specified by the configuration file. .

The prepare command will create
   - The preconfigured karaf container
   - Will create the link "dist" that points to the karaf container root, like $ODL_KARAF_HOME in the Boron environment.
     E.g. cd to log directory works via cd dist/data/log

Execute prepare:

     cd $HOME/odl/CENTENNIAL/code-Carbon-SR1
     ./odl prepare

#### 5. Install the apps and Start the container

Install from $HOME/.m2/repository into dist/system and install features.

    ./odl im


#### Further commands of odl script

List of all ./odl commands:
```
 a           for build all and install from M2
 build       build subsystem
 bower       for install bower
 cli         start karaf command line
 env         List environment variables
 d           for devicemanager and install from M2
 dbclean     clean db and load with initial data
 debug       activate debug for netconf and mwtn
 distremove  remove existing karaf distribution
 dlux        install DLUX patch
 help        List this help
 ib          for install from Build-directory
 im          for install from M2-directory
 imd         for install from M2-directory. Delete logs before start command
 it fn       install tar file to container
 karafclean  start clean and install apps on karaf
 migrate     migrate Param1 Param2 Migrate on localhost
 prepare     to install and prepare a karaf. Packed Version expected in Downloads
 test        do some testing
 start       start karaf
 status      display karaf status
 stop        stop and wait karaf
 restart     stop and start karaf
 repoclean   clean the repositories
 v           get Versions
```