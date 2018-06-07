#Setting up Carbon SR1 development environment

HINT1: Not all applications, available under code/apps are integrated into code-Carbon-SR1/apps.
HINT2: Modify the code under the *code* subdirectory. Modify in a way that it can be used in Boron and Carbon.

This *code-Carbon-SR1* folder does compile the sources from *code* in a Opendayligh Cabron SR1 context.
Mainly the pom.xml files are adapted. Sources are used from *code* referenced by a symbolic link.

##Recommended structure

   - $HOME/Downloads
   - $HOME/odl
      - WirelessTransportEmulator [from here: git MELACON](https://github.com/Melacon/WirelessTransportEmulator.git)
      - CENTENNIAL [from here: git](https://github.com/OpenNetworkingFoundation/CENTENNIAL.git)


Working location for compiling Carbon code and managing the Carbon karaf container is here: **$HOME/odl/CENTENNIAL/code-Carbon-SR1**
Working directory for source code editing for Boron base is here: **$HOME/odl/CENTENNIAL/code**

## Steps

### 0. Do the installation of Java, maven, git npm and so on form the Boron/code description

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


### 1. Download Carbon SR1 container

    cd $HOME/Downloads
    wget Carbon tar https://nexus.opendaylight.org/content/groups/public/org/opendaylight/integration/distribution-karaf/0.6.1-Carbon/distribution-karaf-0.6.1-Carbon.tar.gz

### 2. Creating dist.conf file

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


### 3. Compile everything to m2

    cd $HOME/odl/CENTENNIAL/code-Carbon-SR1
    mvn clean install -DskipTests

Should end without error indication

### 4. Prepare container

The *odl* script is replacing the older "install.sh" script collection. It will use the local settings, specified in dist.conf and can manage the karaf container specified by the configuration file. .

The prepare command will create
   - The preconfigured karaf container
   - Will create the link "dist" that points to the karaf container root, like $ODL_KARAF_HOME in the Boron environment.
     E.g. cd to log directory works via cd dist/data/log

Execute prepare:

     cd $HOME/odl/CENTENNIAL/code-Carbon-SR1
     ./odl prepare

### 5. Install the apps and Start the container

Install from $HOME/.m2/repository into dist/system and install features.

    ./odl im


### Further commands of odl script

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