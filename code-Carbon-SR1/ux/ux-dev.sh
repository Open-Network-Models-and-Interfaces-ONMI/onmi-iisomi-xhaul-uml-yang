#!/bin/bash

################################################################################
# Please ensure that your ODL_KARAF_HOME enviroment variable is set correctly
#
ODL_KARAF_HOME=$HOME/odl/distribution-karaf-0.6.1-Carbon
UX_VERSION=0.5.1-SNAPSHOT;

# clean
rm -rf ~/.m2/repository/com/highstreet/technologies/odl/app/closedLoopAutomation-karaf/
rm -rf ~/.m2/repository/com/highstreet/technologies/odl/app/spectrum/scheduler-karaf/
find ~/.m2/repository/org/opendaylight/mwtn/* -type d -name "*-module" -exec rm -rf {} \;
find ~/.m2/repository/com/highstreet/* -type d -name "*-module" -exec rm -rf {} \;
rm -rf $ODL_KARAF_HOME/cache/schema/tailf*.yang
rm -rf $ODL_KARAF_HOME/cache/schema/yuma*.yang
# rm -rf $ODL_KARAF_HOME/data/log/*
rm -rf $ODL_KARAF_HOME/system/org/opendaylight/mwtn
rm -rf $ODL_KARAF_HOME/system/com/highstreet 

# deploy
cp -R ~/.m2/repository/org/opendaylight/mwtn $ODL_KARAF_HOME/system/org/opendaylight 
cp -R ~/.m2/repository/com/highstreet $ODL_KARAF_HOME/system/com

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
    "ONF :: Wireless :: emergency-bundle"
    "ONF :: Wireless :: mwtnInventory-bundle"
    "ONF :: Wireless :: security-bundle"
    "ONF :: Wireless :: protection-bundle"
    "ONF :: Wireless :: mwtnPerformanceLink-bundle"
    "ONF :: Wireless :: mwtnPerformanceHistory-bundle"
    "ONF :: Wireless :: mwtnPerformanceCurrent-bundle"
    "ONF :: Wireless :: maintenancemode-bundle"
    "ONF :: Wireless :: mwtnFault-bundle"
    "ONF :: Wireless :: mwtnBrowser-bundle"
    "ONF :: Wireless :: otnBrowser-bundle"
    "ONF :: Wireless :: ethService-bundle"
    "ONF :: Wireless :: onapSo-bundle"
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
$ODL_KARAF_HOME/bin/client -u karaf "bundle:uninstall $names"

# install bundles
## declare array of bundleNames
declare -a bundles=(
    mvn:com.highstreet.technologies.odl.dlux/mwtnCommons-bundle/$UX_VERSION 
    mvn:com.highstreet.technologies.odl.dlux/mwtnConnect-bundle/$UX_VERSION 

    mvn:com.highstreet.technologies.odl.dlux/onapAai-bundle/$UX_VERSION 
    mvn:com.highstreet.technologies.odl.dlux/onapDcae-bundle/$UX_VERSION 
    mvn:com.highstreet.technologies.odl.dlux/onapSo-bundle/$UX_VERSION 

    # mvn:com.highstreet.technologies.odl.dlux/ethService-bundle/$UX_VERSION
    # mvn:com.highstreet.technologies.odl.dlux/otnBrowser-bundle/$UX_VERSION

    mvn:com.highstreet.technologies.odl.dlux/mwtnFault-bundle/$UX_VERSION
    mvn:com.highstreet.technologies.odl.dlux/maintenancemode-bundle/$UX_VERSION
    mvn:com.highstreet.technologies.odl.dlux/mwtnBrowser-bundle/$UX_VERSION 
    mvn:com.highstreet.technologies.odl.dlux/mwtnPerformanceCurrent-bundle/$UX_VERSION 
    mvn:com.highstreet.technologies.odl.dlux/mwtnPerformanceHistory-bundle/$UX_VERSION 
    mvn:com.highstreet.technologies.odl.dlux/mwtnPerformanceLink-bundle/$UX_VERSION
    mvn:com.highstreet.technologies.odl.dlux/security-bundle/$UX_VERSION
    mvn:com.highstreet.technologies.odl.dlux/protection-bundle/$UX_VERSION
    mvn:com.highstreet.technologies.odl.dlux/mwtnInventory-bundle/$UX_VERSION 
    mvn:com.highstreet.technologies.odl.dlux/mwtnTopology-bundle/$UX_VERSION 
    mvn:com.highstreet.technologies.odl.dlux/emergency-bundle/$UX_VERSION 
    mvn:com.highstreet.technologies.odl.dlux/mwtnTdm-bundle/$UX_VERSION 
    # mvn:com.highstreet.technologies.odl.dlux/mwtnCompare-bundle/$UX_VERSION 
    # mvn:cn.com.zte.odl.dlux/mwtnSpectrum-bundle/$UX_VERSION
    # mvn:com.highstreet.technologies.odl.dlux/mwtnClosedLoop-bundle/$UX_VERSION 
    mvn:com.highstreet.technologies.odl.dlux/mwtnEvents-bundle/$UX_VERSION 
    mvn:com.highstreet.technologies.odl.dlux/mwtnTest-bundle/$UX_VERSION
    mvn:com.highstreet.technologies.odl.dlux/mwtnMediator-bundle/$UX_VERSION
    mvn:com.highstreet.technologies.odl.dlux/mwtnLog-bundle/$UX_VERSION 
    mvn:com.highstreet.technologies.odl.dlux/odlChat-bundle/$UX_VERSION
    mvn:com.highstreet.technologies.odl.dlux/help-bundle/$UX_VERSION
)

## execute bundle uninstall 
bundleMvns=""
for bundle in "${bundles[@]}"
do
   bundleMvns+="$bundle "
done
$ODL_KARAF_HOME/bin/client -u karaf "bundle:install -s $bundleMvns"

# open brwoser
x-www-browser http://localhost:8181/index.html

# remove target folders for easy search functionality
mvn clean
find * -type d -name "target-ide" -exec rm -rf {} \;