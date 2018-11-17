# Setting up CENTENNIAL environment for Opendaylight Oxygen SR3 (karaf 0.8.3)

This *code-Oxygen-SR3* folder does compile the sources from *code* in a Opendaylight Oxygen SR3 context.
Mainly all the pom.xml files are adapted to refer to the related version numbers.
Sources are used from source directory under the *code*-tree, referenced by symbolic links.

  * Section A: **Download, extract and run Opendaylight**

HINTs

  - HINT 1: Not all applications, available under code/apps are integrated via symbolic links
  - HINT 2: Modify the code under the *code* subdirectory. Modify in a way that it can be used in all versions

## A. Download, extract and run Opendaylight

Directory structure for preconfigured download package

  - $HOME
    - Downloads
    - odl
      - karaf-0.8.3-poc5

Server prerequirements: VM (CPU:4Core, Ram:4Gig, HD:16Gig), Ubuntu 16.04 or 18.04 Server or Desktop, openJdk 8

HINT: if the structure is different adapt the *dist.conf* file in the root-directory of the container.

     #PoC5 configuration
     ODL_KARAF_DIST="karaf-0.8.3-poc5"
     ODL_KARAF_HOME=$HOME/odl/$ODL_KARAF_DIST
     ODL_KARAF_DISTGZ="$HOME/Downloads/"$ODL_KARAF_DIST".tar.gz"
     ODLPARENT="0.7.3-SNAPSHOT"
     export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"

     ODL_KARAF_STARTUP_SCRIPT="karaf_startup_dev"

     karaf_startup_dev() {
       # Prepare
       karaf_prepare
       # Base
       karafcmd  "feature:install odl-netconf-topology"
       karafcmd  "feature:install odl-netconf-connector"
       karafcmd  "feature:install odl-restconf-all"
       karafcmd  "feature:install odl-mdsal-apidocs"

       # Logs and apps
       karaf_enable_logs TRACE

       karafcmd "feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/$ODLPARENT/xml/features"
       karafcmd "feature:install odl-ht-apigateway"
       karafcmd "feature:install odl-ht-helpserver"
       karafcmd "feature:install odl-mwt-devicemanager"
       karafcmd "feature:install odl-dlux-preparation"
       karafcmd "feature:install odl-mwtn-ux-all"
     }


#### The steps to install and run Opendaylight Oxygen SR3 are

##### Step1: Download Karaf/ODL/CENTENIAL Apps - tar.gz file (411 MB)

Actual Version: 016.008 (17.11.2018)https://cloud-highstreet-technologies.com/nextcloud/index.php/s/24fdqRLwmwzoZNe

	cd ~/Downloads
    wget https://cloud-highstreet-technologies.com/nextcloud/index.php/s/24fdqRLwmwzoZNe/download -O karaf-0.8.3-poc5.016.008.tar.gz

##### Step2: Extract tar.gz

Unpack karaf and included odl micro apps. (No karaf is running on server ./odl/)

    cd ~/odl
    tar -xzf ../Downloads/karaf-0.8.3-poc5.016.008.tar.gz

##### Step3: Run Opendaylight

Start Opendaylight. Give about 1-2 minute to startup.

     cd ~/odl/karaf-0.8.3-poc5
     ./odl karafclean


##### Have fun

Sim2230 is part of the delivery. Start Sim2230 as NETCONF device for test purpose.

     cd ~/odl/karaf-0.8.3-poc5/Sim2230/build
     ./noYuma_p2230.sh

HINT for Sim2230
  * Let this session OPEN to see the connect and message exchange. ```tmux``` is recommended.
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

##### Further commands of odl script

  * Stop container: ./odl stop
  * Get version and run status: ./odl status

List of more ./odl commands:
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
