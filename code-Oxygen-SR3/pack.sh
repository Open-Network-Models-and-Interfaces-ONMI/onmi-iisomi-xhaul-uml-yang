#!/bin/bash
# Pack a tar.gz container with ODL Apps and Sim
# 0. ./odl build build
# 1. ./odl distremove
# 2. ./odl prepare
# 3. ./odl ib nostart
# 4. Kopieren sendateodl4
# 4.1 cp -r ~/odl/Nextcloud/build/poc/poc.../taraddon/* ../distribution....
#        cd ~/odl2
#        cp -r ~/odl/Nextcloud/build/poc/poc_5_E18_OxygenSR3/taraddon/* karaf-0.8.3-poc5/
# 4.2 cp Binary odl.sh to dist.../bin
# 4.3 ln -s bin/odl.sh odl
# 5. cd ..
# 6. mv distribut.... distribution...-poc5
# 7. EXAMPLE tar -czf ~/odl/Next../delivery/poc/poc5/distributionXYZ-poc5.015.006.tar.gz distribution
# 7. sendateodl4:
#        tar -czf ~/odl/Nextcloud/delivery/poc/poc_5_E18_OxygenSR3/karaf-0.8.3-poc5.016.001.tar.gz karaf-0.8.3-poc5


LINE="-----------------------------------------------"
TARADDON="$HOME/odl/Nextcloud/build/poc/poc_5_E18_OxygenSR3/taraddon"

# ------------ Functions -----------------------

confirm() {
   read -p "Enter to confirm. y/n or Ctrl-C to stop." ANSWER
}

# ------------ Main -----------------------

echo "Load dist.conf"
source ./dist.conf

echo "Distribution: $ODL_KARAF_DIST"
echo "Home: $ODL_KARAF_HOME"

confirm

echo "Create CENTENNIAL delivery package for ODL"
echo $LINE
echo "Stop and Remove"
./odl stop
./odl distremove

echo "Create new build ?"
confirm
if [ "$ANSWER" == "y" ] ; then
  ./odl build build
fi

echo "Build ready"
confirm

here=${pwd}
echo $LINE
echo "Prepare"
./odl prepare
echo $LINE
echo "Provisioning"
./odl ib nostart

echo "Load containerversion"
source "$ODL_KARAF_HOME"/networkAppVersion.txt
echo "Build: $BUILDTAG"
echo "Version is $VERSION"
confirm

echo "Create tar file"
cd ~/odl2
echo "Copy taraddon"
cp -r $TARADDON/* ~/odl2/karaf-0.8.3-poc5/
echo "Create tar file with version $VERSION"
tar -czf ~/odl/Nextcloud/delivery/poc/poc_5_E18_OxygenSR3/karaf-0.8.3-poc5.$VERSION.tar.gz karaf-0.8.3-poc5
cd $here

echo "Done"
