#/bin/bash
# build ux
mvn clean install -DskipTests

# clean
rm -rf ~/.m2/repository/com/highstreet/technologies/odl/app/closedLoopAutomation-karaf/
rm -rf ~/.m2/repository/com/highstreet/technologies/odl/app/spectrum/scheduler-karaf/
find ~/.m2/repository/org/opendaylight/mwtn/* -type d -name "*-module" -exec rm -rf {} \;
find ~/.m2/repository/com/hcl/* -type d -name "*-module" -exec rm -rf {} \;
find ~/.m2/repository/com/highstreet/* -type d -name "*-module" -exec rm -rf {} \;
rm -rf $ODL_KARAF_HOME/cache/schema/tailf*.yang
rm -rf $ODL_KARAF_HOME/cache/schema/yuma*.yang
# rm -rf $ODL_KARAF_HOME/data/log/*
rm -rf $ODL_KARAF_HOME/system/org/opendaylight/mwtn
rm -rf $ODL_KARAF_HOME/system/com/hcl 
rm -rf $ODL_KARAF_HOME/system/com/highstreet 

# deploy
mkdir -p $ODL_KARAF_HOME/system/cn 
mkdir -p $ODL_KARAF_HOME/system/cn/com 
cp -R ~/.m2/repository/org/opendaylight/mwtn $ODL_KARAF_HOME/system/org/opendaylight 
cp -R ~/.m2/repository/cn/com/zte $ODL_KARAF_HOME/system/cn/com 
cp -R ~/.m2/repository/com/hcl $ODL_KARAF_HOME/system/com 
cp -R ~/.m2/repository/com/highstreet $ODL_KARAF_HOME/system/com

# uninstall bundles
## declare array of bundleNames
declare -a bundleNames=(
    "ONF :: Wireless :: odlChat-bundle" 
    "ONF :: Wireless :: mwtnLog-bundle" 
    "ONF :: Wireless :: mwtnTest-bundle"
    "ONF :: Wireless :: mwtnEvents-bundle"
    "ONF :: Wireless :: mwtnClosedLoop-bundle"
    "ONF :: Wireless :: mwtnSpectrum-bundle"
    "ONF :: Wireless :: mwtnCompare-bundle"
    "ONF :: Wireless :: mwtnPerformanceLink-bundle"
    "ONF :: Wireless :: mwtnPerformanceHistory-bundle"
    "ONF :: Wireless :: mwtnPerformanceCurrent-bundle"
    "ONF :: Wireless :: mwtnFault-bundle"
    "ONF :: Wireless :: mwtnTopology-bundle"
    "ONF :: Wireless :: mwtnConfig-bundle"
    "ONF :: Wireless :: mwtnBrowser-bundle"
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
    mvn:com.highstreet.technologies.odl.dlux/mwtnCommons-bundle/0.4.0-SNAPSHOT 
    mvn:com.highstreet.technologies.odl.dlux/mwtnConnect-bundle/0.4.0-SNAPSHOT 
    mvn:com.highstreet.technologies.odl.dlux/mwtnFault-bundle/0.4.0-SNAPSHOT
    mvn:com.highstreet.technologies.odl.dlux/mwtnPerformanceCurrent-bundle/0.4.0-SNAPSHOT 
    mvn:com.highstreet.technologies.odl.dlux/mwtnPerformanceHistory-bundle/0.4.0-SNAPSHOT 
    mvn:com.highstreet.technologies.odl.dlux/mwtnPerformanceLink-bundle/0.4.0-SNAPSHOT 
    # mvn:com.highstreet.technologies.odl.dlux/mwtnConfig-bundle/0.4.0-SNAPSHOT // replaced by mwtnBrowser
    mvn:com.highstreet.technologies.odl.dlux/mwtnBrowser-bundle/0.4.0-SNAPSHOT 
    mvn:com.highstreet.technologies.odl.dlux/mwtnTopology-bundle/0.4.0-SNAPSHOT 
    # mvn:com.highstreet.technologies.odl.dlux/mwtnCompare-bundle/0.4.0-SNAPSHOT 
    # mvn:cn.com.zte.odl.dlux/mwtnSpectrum-bundle/0.4.0-SNAPSHOT
    # mvn:com.highstreet.technologies.odl.dlux/mwtnClosedLoop-bundle/0.4.0-SNAPSHOT 
    mvn:com.highstreet.technologies.odl.dlux/mwtnEvents-bundle/0.4.0-SNAPSHOT 
    mvn:com.highstreet.technologies.odl.dlux/mwtnTest-bundle/0.4.0-SNAPSHOT
    mvn:com.highstreet.technologies.odl.dlux/mwtnLog-bundle/0.4.0-SNAPSHOT 
    mvn:com.highstreet.technologies.odl.dlux/odlChat-bundle/0.4.0-SNAPSHOT
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
