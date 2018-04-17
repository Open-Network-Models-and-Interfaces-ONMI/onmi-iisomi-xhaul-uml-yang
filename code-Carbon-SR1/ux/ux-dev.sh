#!/bin/bash

# build ux
mvn clean install -DskipTests

# clean
rm -rf ~/.m2/repository/com/highstreet/technologies/odl/app/closedLoopAutomation-karaf/
rm -rf ~/.m2/repository/com/highstreet/technologies/odl/app/spectrum/scheduler-karaf/
find ~/.m2/repository/org/opendaylight/mwtn/* -type d -name "*-module" -exec rm -rf {} \;
find ~/.m2/repository/com/highstreet/* -type d -name "*-module" -exec rm -rf {} \;
rm -rf ../dist/cache/schema/tailf*.yang
rm -rf ../dist/cache/schema/yuma*.yang
# rm -rf ../dist/data/log/*
rm -rf ../dist/system/org/opendaylight/mwtn
rm -rf ../dist/system/com/highstreet 

# deploy
cp -R ~/.m2/repository/org/opendaylight/mwtn ../dist/system/org/opendaylight 
cp -R ~/.m2/repository/com/highstreet ../dist/system/com

# uninstall bundles
## declare array of bundleNames
declare -a bundleNames=(
    "ONF :: Wireless :: odlChat-bundle" 
    "ONF :: Wireless :: help-bundle" 
    "ONF :: Wireless :: mwtnLog-bundle" 
    "ONF :: Wireless :: mwtnTest-bundle"
    "ONF :: Wireless :: mwtnMediator-bundle"
    "ONF :: Wireless :: mwtnEvents-bundle"
    "ONF :: Wireless :: mwtnClosedLoop-bundle"
    "ONF :: Wireless :: mwtnSpectrum-bundle"
    "ONF :: Wireless :: mwtnCompare-bundle"
    "ONF :: Wireless :: mwtnTdm-bundle"
    "ONF :: Wireless :: mwtnTopology-bundle"
    "ONF :: Wireless :: mwtnInventory-bundle"
    "ONF :: Wireless :: mwtnPerformanceLink-bundle"
    "ONF :: Wireless :: mwtnPerformanceHistory-bundle"
    "ONF :: Wireless :: mwtnPerformanceCurrent-bundle"
    "ONF :: Wireless :: mwtnFault-bundle"
    "ONF :: Wireless :: mwtnBrowser-bundle"
    "ONF :: Wireless :: otnBrowser-bundle"
    "ONF :: Wireless :: ethService-bundle"
    "ONF :: Wireless :: onapMso-bundle"
    "ONF :: Wireless :: onapDcae-bundle"
    "ONF :: Wireless :: onapAai-bundle"
    "ONF :: Wireless :: mwtnConnect-bundle"
    "ONF :: Wireless :: mwtnCommons-bundle"
)

## execute bundle uninstall 
names=""
for bundleName in "${bundleNames[@]}"
do
   names+="\"$bundleName\" "
done
../dist/bin/client -u karaf "bundle:uninstall $names"

# install bundles
## declare array of bundleNames
declare -a bundles=(
    mvn:com.highstreet.technologies.odl.dlux/mwtnCommons-bundle/0.5.1-SNAPSHOT 
    mvn:com.highstreet.technologies.odl.dlux/mwtnConnect-bundle/0.5.1-SNAPSHOT 

    mvn:com.highstreet.technologies.odl.dlux/onapAai-bundle/0.5.1-SNAPSHOT 
    mvn:com.highstreet.technologies.odl.dlux/onapDcae-bundle/0.5.1-SNAPSHOT 
    mvn:com.highstreet.technologies.odl.dlux/onapMso-bundle/0.5.1-SNAPSHOT 

    # mvn:com.highstreet.technologies.odl.dlux/ethService-bundle/0.5.1-SNAPSHOT
    # mvn:com.highstreet.technologies.odl.dlux/otnBrowser-bundle/0.5.1-SNAPSHOT

    mvn:com.highstreet.technologies.odl.dlux/mwtnFault-bundle/0.5.1-SNAPSHOT
    mvn:com.highstreet.technologies.odl.dlux/mwtnBrowser-bundle/0.5.1-SNAPSHOT 
    mvn:com.highstreet.technologies.odl.dlux/mwtnPerformanceCurrent-bundle/0.5.1-SNAPSHOT 
    mvn:com.highstreet.technologies.odl.dlux/mwtnPerformanceHistory-bundle/0.5.1-SNAPSHOT 
    mvn:com.highstreet.technologies.odl.dlux/mwtnPerformanceLink-bundle/0.5.1-SNAPSHOT
    mvn:com.highstreet.technologies.odl.dlux/mwtnInventory-bundle/0.5.1-SNAPSHOT 
    mvn:com.highstreet.technologies.odl.dlux/mwtnTopology-bundle/0.5.1-SNAPSHOT 
    # mvn:com.highstreet.technologies.odl.dlux/mwtnTdm-bundle/0.5.1-SNAPSHOT 
    # mvn:com.highstreet.technologies.odl.dlux/mwtnCompare-bundle/0.5.1-SNAPSHOT 
    # mvn:cn.com.zte.odl.dlux/mwtnSpectrum-bundle/0.5.1-SNAPSHOT
    # mvn:com.highstreet.technologies.odl.dlux/mwtnClosedLoop-bundle/0.5.1-SNAPSHOT 
    # mvn:com.highstreet.technologies.odl.dlux/mwtnEvents-bundle/0.5.1-SNAPSHOT 
    # mvn:com.highstreet.technologies.odl.dlux/mwtnTest-bundle/0.5.1-SNAPSHOT
    mvn:com.highstreet.technologies.odl.dlux/mwtnMediator-bundle/0.5.1-SNAPSHOT
    mvn:com.highstreet.technologies.odl.dlux/help-bundle/0.5.1-SNAPSHOT
    # mvn:com.highstreet.technologies.odl.dlux/mwtnLog-bundle/0.5.1-SNAPSHOT 
    # mvn:com.highstreet.technologies.odl.dlux/odlChat-bundle/0.5.1-SNAPSHOT
)

## execute bundle uninstall 
bundleMvns=""
for bundle in "${bundles[@]}"
do
   bundleMvns+="$bundle "
done
../dist/bin/client -u karaf "bundle:install -s $bundleMvns"

# open brwoser
x-www-browser http://localhost:8181/index.html

# remove target folders for easy search functionality
mvn clean
find * -type d -name "target-ide" -exec rm -rf {} \;