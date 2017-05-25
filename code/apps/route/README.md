
#### commands for module creation
```
mvn archetype:generate -DarchetypeGroupId=org.opendaylight.controller -DarchetypeArtifactId=opendaylight-startup-archetype \
-DarchetypeRepository=http://nexus.opendaylight.org/content/repositories/opendaylight.release/ \
-DarchetypeCatalog=http://nexus.opendaylight.org/content/repositories/opendaylight.release/archetype-catalog.xml \
-DarchetypeVersion=1.2.1-Boron-SR1
```

#### copy modules build from code:

```
mkdir -p $ODL_KARAF_HOME/system/cn
mkdir -p $ODL_KARAF_HOME/system/cn/com
cp -R ~/.m2/repository/org/opendaylight/mwtn $ODL_KARAF_HOME/system/org/opendaylight
cp -R ~/.m2/repository/cn/com/zte $ODL_KARAF_HOME/system/cn/com
cp -R ~/.m2/repository/com/hcl $ODL_KARAF_HOME/system/com
cp -R ~/.m2/repository/com/highstreet $ODL_KARAF_HOME/system/com
```
#### setting up database
```
cd $ODL_KARAF_HOME
./bin/karaf clean
feature:repo-add mvn:org.apache.karaf.decanter/apache-karaf-decanter/1.1.0/xml/features
feature:install elasticsearch
```
- config file
````
vim $ODL_KARAF_HOME/etc/elasticsearch.yml
network.host: 0.0.0.0
path.data: etc
path.plugins: etc/elasticsearch-plugins
````
- enter path of CENTENNIAL
```
mkdir $ODL_KARAF_HOME/etc/elasticsearch-plugins/
unzip ./code/apps/persistentDatabase/plugins/head.zip -d $ODL_KARAF_HOME/etc/elasticsearch-plugins
unzip ./code/apps/persistentDatabase/plugins/delete-by-query.zip -d $ODL_KARAF_HOME/etc/elasticsearch-plugins
```
- restart odl and follow the instruction under code/apps/persistentDatabase
- there is a wrong path define in indexMwtn/initDatabase.js
- should be ../activeConfigExamples/sdnpoc4/config.json
```
sudo npm install elasticdump -g
cd ./code/apps/persistentDatabase
./installAll.sh
```

#### start app re-routing
````
feature:install odl-netconf-connector-all odl-l2switch-switch
feature:install odl-netconf-topology
feature:install odl-restconf-all odl-mdsal-apidocs odl-dlux-all odl-toaster

feature:repo-add mvn:org.apache.karaf.decanter/apache-karaf-decanter/1.1.0/xml/features
feature:install elasticsearch

feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/0.4.0-SNAPSHOT/xml/features
feature:install odl-mwt-models odl-mwtn-all

feature:repo-add mvn:com.highstreet.technologies.odl.app/route-features/0.4.0-SNAPSHOT/xml/features
feature:install odl-route
````

#### start default value mediator 
1. clone openyuma
````
cd ../
git clone https://github.com/OpenClovis/OpenYuma.git
````
2. prepare yang files of model
````
sudo mkdir -p /usr/share/yuma/modules/CENTENNIAL/
````
````
sudo rm /usr/share/yuma/modules/CENTENNIAL/*.yang
sudo cp ./code/Default_Values_Mediator/YANG_files/CENTENNIAL/*.yang /usr/share/yuma/modules/CENTENNIAL/
````
3. make changes for openyuma and build
- requirements
````
sudo apt-get install libxml2-dev libssh2-1-dev libcurses-ocaml-dev
````
- build
````
cp ./code/Default_Values_Mediator/agt_val.c ../OpenYuma/netconf/src/agt/
cp ./code/Default_Values_Mediator/ncxconst.h ../OpenYuma/netconf/src/ncx/
cp ./code/Default_Values_Mediator/config/dvm-data.xml ~/
cd ../OpenYuma
make clean && make && sudo make install
````

#### set ssh port
Open sshd_config file :
````
sudo gedit /etc/ssh/sshd_config
````
Add following contents (after "Port 22" in line 5) :
````
Port 830
Subsystem netconf /usr/sbin/netconf-subsystem
````
Restart ssh server :
````
sudo /etc/init.d/ssh restart
````
- install php
```
sudo apt-get install php7.0-curl php7.0-cli
```

#### How to run the DVM for Telefonica SDN Trial:

This will start the NETCONF server as a process, in the foreground, and print the debug logs on that specific terminal.
````
sudo netconfd --log-level=debug --access-control=off --target=running --no-startup \
	  --module=core-model \
	  --module=microwave-model
````
The environment variable DVM_CONFIG_FILE is provided in order to overwrite the default. 
This variable can be used in the following way (assuming the file to be used is /opt/mediator/my-dvm-data.xml):
````
sudo DVM_CONFIG_FILE=/opt/mediator/my-dvm-data.xml \
     netconfd --log-level=debug --access-control=off --target=running --no-startup \
	  --module=core-model \
	  --module=microwave-model
````
The NETCONF server can be also started running the script files located in the directory ./code/Default_Values_Mediator/script:

  - md-install.sh

    This script is used to set the default configuration used by the following two scripts.
    The configuration is stored in the file $HOME/.mdevconf.
    The command line option -h shows the usage of the script:

      usage: md-install.sh [option] | [-h|--help]\
      where option is:
      
        -e|--md-eth-interface <name>             # Mediation device eth interface name. Default: [eth0]
        -n|--name <name>                         # Network element name. Default: [NE-NAME]
        -a|--controller-ipaddress <ip-adddress>  # SDH controller ip address. Default: [10.10.1.1]
        -p|--controller-port <port>              # SDH controller RESTconf port. Default: [8181]
        -s|--show                                # show configured parameters (defaults)
        -u|--controller-user <user>              # SDH controller user name. Default: [admin]
        -w|--controller-password <pwd>           # SDH controller password. Default: [admin]

    The command line option -s shows the current configured parameters:

      md-install.sh configured parameters:
        
        Mediation device eth interface name ................ [eth0]
        Network element name ............................... [NE-NAME]
        SDH controller ip address .......................... [10.10.1.1]
        SDH controller RESTconf port ....................... [8181]
        SDH controller user name ........................... [admin]
        SDH controller password ............................ [admin]

    The ethernet interface name is used to obtain the IP address of the mediation device.

  - md-startup.sh

    This script is used to start the mediation device and register (log in) it to the SDH controller.
    The command line option -h and -s are provided also for this script.
    The arguments passed to this script are stored in the file $HOME/.mdevconf by updating the contentis set by md-install.sh.
    The script must be run with superuser privileges.
    In order to use the environment variable DVM_CONFIG_FILE the following syntax is suggested:

      sudo DVM_CONFIG_FILE=/opt/mediator/my-dvm-data.xml md-startup.sh


  - md-shutdown.sh

    This script is used to stop the mediation device and deregister (log out) it from the SDH controller.
    The command line option -h and -s are provided also for this script.
    The script must be run with superuser privileges.
    The arguments passed to this script are NOT stored in the file $HOME/.mdevconf.

  Since RESTconf call invoked in order to log in (log out) the mediation device to (from) the SDH controller are embedded in a PHP script, could be necessary install the following packages:

    
#### mount DVM on ODL
using system user and password for DVM when running DVM foreground

#### log level for odl
````
log:set TRACE org.opendaylight.netconf
log:set DEBUG org.opendaylight.mwtn
````

#### debugging the controller
````
cd $ODL_KARAF_HOME
./bin/karaf debug
````
