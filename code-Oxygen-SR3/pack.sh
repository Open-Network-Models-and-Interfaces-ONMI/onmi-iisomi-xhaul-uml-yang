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



