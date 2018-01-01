#!/usr/bin/env bash
# Martin Skorupski. Copyright (c) 2017, higshtreet technologies GmbH

echo
echo "JAVA 8 expected"
echo " sudo apt-get install openjdk-8-jdk"
java -version

echo
echo "node expected"
echo " sudo apt-get install nodejs npm jq --"
echo " sudo ln -s /usr/bin/nodejs /usr/bin/node"
node --version

echo
echo "python expected"
echo " sudo apt-get install python-setuptools"
echo " sudo python setup.py install"
python --version

echo
echo "pyang expected"
echo " git clone https://github.com/mbj4668/pyang.git"
echo " cd pyang"
echo " sudo apt-get install python-setuptools"
echo " sudo python setup.py install"
echo " cd .."
pyang --version

echo 
echo "unzip expected"
echo " sudo apt-get install unzip"
unzip -version

cd src/main/resources
rm -rf *

echo "Download xslt processor"
mkdir lib && cd lib
wget https://sourceforge.net/projects/saxon/files/Saxon-HE/9.8/SaxonHE9-8-0-1J.zip;
unzip SaxonHE9-8-0-1J.zip;
cd ..

echo "Download CoreModel 1.3"
wget https://www.dropbox.com/sh/zns6hihpk2du7k4/AABAYA8ON1edlSAJ8jLBzoZEa/TR%20512%20v1.3/TR-512_v1._3_Publish.zip;
unzip "TR-512_v1._3_Publish.zip"

echo "Download UmlYangTools"
rm -rf EAGLE-Open-Model-Profile-and-Tools;
git clone https://github.com/OpenNetworkingFoundation/EAGLE-Open-Model-Profile-and-Tools.git;
cd ./EAGLE-Open-Model-Profile-and-Tools/UmlYangTools/xmi2yang/;
npm install
cd ../../..

echo "Modify UmlYangTools"
cp -r ./src/main/xmi2yang/* -src/main/resources/EAGLE-Open-Model-Profile-and-Tools/UmlYangTools/xmi2yang