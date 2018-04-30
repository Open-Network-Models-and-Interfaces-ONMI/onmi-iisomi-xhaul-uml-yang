#!/bin/bash
# Install feature powercontroll / FRINX
# Example for script based setup of KARAF container

karafcmd() {
  echo $1
  ./bin/client "$1"
}

echo pull from git
cd ~/apps/CENTENNIAL/code/apps/wirelessPowerControl/impl
git pull
echo compile
mvn clean install -DskipTests


echo copy the files
cp -R ~/.m2/repository/com/highstreet/technologies/odl/app/wi* $ODL_KARAF_HOME/system/com/highstreet/technologies/odl/app

cd $ODL_KARAF_HOME
echo stop
./bin/stop
sleep 30

echo start clean
./bin/start clean

sleep 30
echo install
karafcmd "feature:install odl-netconf-topology"
karafcmd "feature:install odl-netconf-connector-all"
karafcmd "feature:install odl-restconf-all"
karafcmd "feature:install odl-mdsal-apidocs"
karafcmd "feature:install odl-dlux-all"
karafcmd "feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/0.4.0-SNAPSHOT/xml/features"
karafcmd "feature:install elasticsearch"
karafcmd "feature:repo-add mvn:com.highstreet.technologies.odl.app/wirelessPowerControl-features/0.4.0-SNAPSHOT/xml/features"
karafcmd "feature:install odl-wirelessPowerControl"
karafcmd "feature:install odl-mwtn-all"
karafcmd "feature:repo-add mvn:com.highstreet.technologies.odl.app/route-features/0.4.0-SNAPSHOT/xml/features"
karafcmd "feature:install odl-route"

./bin/stop
sleep 30
./bin/start

echo "Ready"

