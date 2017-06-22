# Create a delivery Tar bundle

Comprehensive How-to-create list for a ODL/Karaf bundle that can be used to be installed as "Choice 1" refering to the README.MD.

#### Start configuration

-ubuntu 16.04
-All ODL-Setup steps executed from README.MD Choice 2 Steps #1 - #3.1
-odl-karaf boron

#### build applications

mvn clean install -DskipTests

#### some checks

echo $JAVA_HOME
echo $JAVA_MAX_MEM
echo $ODL_KARAF_HOME

#### Install

mvn clean install -DskipTests

#### clean

rm -rf ~/.m2/repository/com/highstreet/technologies/odl/app/closedLoopAutomation-karaf/
rm -rf ~/.m2/repository/com/highstreet/technologies/odl/app/spectrum/scheduler-karaf/
find ~/.m2/repository/org/opendaylight/mwtn/* -type d -name "*-module" -exec rm -rf {} \;
find ~/.m2/repository/com/hcl/* -type d -name "*-module" -exec rm -rf {} \;
find ~/.m2/repository/com/highstreet/* -type d -name "*-module" -exec rm -rf {} \;
rm -rf $ODL_KARAF_HOME/cache/schema/tailf*.yang
rm -rf $ODL_KARAF_HOME/cache/schema/yuma*.yang

#### rm -rf $ODL_KARAF_HOME/data/log/*

rm -rf $ODL_KARAF_HOME/system/org/opendaylight/mwtn
rm -rf $ODL_KARAF_HOME/system/com/hcl
rm -rf $ODL_KARAF_HOME/system/com/highstreet


#### deploy

mkdir -p $ODL_KARAF_HOME/system/cn
mkdir -p $ODL_KARAF_HOME/system/cn/com
cp -R ~/.m2/repository/org/opendaylight/mwtn $ODL_KARAF_HOME/system/org/opendaylight
cp -R ~/.m2/repository/cn/com/zte $ODL_KARAF_HOME/system/cn/com
cp -R ~/.m2/repository/com/hcl $ODL_KARAF_HOME/system/com
cp -R ~/.m2/repository/com/highstreet $ODL_KARAF_HOME/system/com


cd $ODL_KARAF_HOME
./bin/karaf clean



# perform tests with DLUX UI
# remove all required nes
# unmount all devices
# close DLUX UI

# delete logs in ElasticSearch using delete plug in

http://localhost:9200/mwtn/log/
http://localhost:9200/sdnevents/
http://localhost:9200/sdnperformance/


# shutdown karaf
logout


# clear karaf

./bin/karaf clean
logout
rm -rf $ODL_KARAF_HOME/cache/schema/tailf*.yang
rm -rf $ODL_KARAF_HOME/cache/schema/yuma*.yang
rm -rf $ODL_KARAF_HOME/data/log/*


# IMPORTANT!!!
# make sure that no hardcoded references are in karaf

rm $ODL_KARAF_HOME/etc/org.ops4j.pax.web.cfg



cd ..

mv onf-wireless-4th-poc-karaf-0.5.1-Boron-SR1-2017-06-22

tar -czvf onf-wireless-4th-poc-karaf-0.5.1-Boron-SR1-2017-06-22.tar.gz onf-wireless-4th-poc-karaf-0.5.1-Boron-SR1-2017-06-22
