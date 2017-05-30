
#### commands for module creation
```
mvn archetype:generate -DarchetypeGroupId=org.opendaylight.controller -DarchetypeArtifactId=opendaylight-startup-archetype \
-DarchetypeRepository=http://nexus.opendaylight.org/content/repositories/opendaylight.release/ \
-DarchetypeCatalog=http://nexus.opendaylight.org/content/repositories/opendaylight.release/archetype-catalog.xml \
-DarchetypeVersion=1.2.1-Boron-SR1
```

#### patch the odl
````
cp ./apps/dlux/loader.implementation-0.4.1-Boron-SR1.jar $ODL_KARAF_HOME/system/org/opendaylight/dlux/loader.implementation/0.4.1-Boron-SR1

````

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
feature:install odl-mwt-models odl-mwtn-ux-all
feature:install odl-mwt-event odl-mwt-websocketmanager odl-mwt-devicemanager

feature:repo-add mvn:com.highstreet.technologies.odl.app/route-features/0.4.0-SNAPSHOT/xml/features
feature:install odl-route
````

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
#### using Wireless Transportation Emulator for debugging
````
git clone https://github.com/Melacon/WirelessTransportEmulator.git
````