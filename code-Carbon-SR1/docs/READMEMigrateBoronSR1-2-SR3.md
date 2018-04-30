# Change ODL version from "Boron-SR1" to "Boron-SR3"

## Update ~/.profile
Change the Environment variables ODL_KARAF_HOME and ODL_KARAF_DIST.

```
sed -i 's/1-Boron-SR1/3-Boron-SR3/g' ~/.profile
source ~/.profile
```

## Download the distribution
Download the required disctribution into the Download folder.

```
cd $HOME/Downloads/
wget https://nexus.opendaylight.org/content/repositories/public/org/opendaylight/integration/distribution-karaf/0.5.3-Boron-SR3/distribution-karaf-0.5.3-Boron-SR3.tar.gz
```

## Create the DLUX patch
For updating DLUX with newer anagular-bootstrap version and small modification in css, the ODL DLUX project must be cloned modified and build.

```
mkdir $HOME/dlux-patch-boron-sr3
cd $HOME/dlux-patch-boron-sr3
git clone https://git.opendaylight.org/gerrit/dlux
cd dlux
git checkout tags/release/boron-sr3

# modify anchor color (must not always be dark)
sed -i 's/\tcolor: #414042 !important;/\tcolor: #414042;/' dlux-web/src/less/design.less

# select new versions for angular-bootstrap and font-awesome
sed -i 's/"angular-bootstrap": "~0.13.0",/"angular-bootstrap": "~2.1.3",/' dlux-web/bower.json
sed -i 's/"font-awesome": "~4.0.3",/"font-awesome": "~4.7.0",/' dlux-web/bower.json

# build dlux - ignore all errors ;) or update ODL DLUX project - it may take 5 to 15min
mvn clean install -DskipTests

# deploy ($ODL_KARAF_HOME does not exits yet - deploy later)
# cp $HOME/dlux-patch-boron-sr3/dlux/loader/impl/target/loader.implementation-0.4.3-Boron-SR3.jar $ODL_KARAF_HOME/system/org/opendaylight/dlux/loader.implementation/0.4.3-Boron-SR3/
cp $HOME/dlux-patch/dlux/loader/impl/target/loader.implementation-0.4.3-Boron-SR3.jar $HOME/workspace/ht/SDN-Projects-Boron/code/apps/dlux/
```

## Prepare OpenDaylight karaf
```
cd $HOME/workspace/ht/SDN-Projects-Boron/code
find . -name \pom.xml -exec sed -i "s/1-Boron-SR1/3-Boron-SR3/g" {} \;
find . -name \mwtnCommons.services.js -exec sed -i "s/Boron-SR1/Boron-SR3/g" {} \;
./install.sh prepare
./install.sh a
cp $HOME/dlux-patch-boron-sr3/dlux/loader/impl/target/loader.implementation-0.4.3-Boron-SR3.jar $ODL_KARAF_HOME/system/org/opendaylight/dlux/loader.implementation/0.4.3-Boron-SR3/
```

## Start the engines!
```
cd $ODL_KARAF_HOME
./bin/karaf clean
```

## Install karaf features
```
# pure OpenDaylight
feature:install odl-netconf-topology
feature:install odl-restconf-all 
feature:install odl-mdsal-apidocs 
feature:install odl-dlux-all 

# persistent database (ElasticSearch)
feature:repo-add mvn:org.apache.karaf.decanter/apache-karaf-decanter/1.1.0/xml/features
feature:install elasticsearch

# Wireless (mwtn: microwave transport network)
feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/0.4.0-SNAPSHOT/xml/features
feature:install odl-mwtn-all

# Logging settings
log:set DEBUG org.opendaylight.mwtn
log:set TRACE org.opendaylight.netconf

# check
info
log:list
```



