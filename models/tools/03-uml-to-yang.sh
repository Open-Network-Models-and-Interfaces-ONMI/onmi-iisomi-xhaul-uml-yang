#!/usr/bin/env bash
# Martin Skorupski. Copyright (c) 2017, highstreet technologies GmbH

# Modify UmlYangTools
cp -r ./src/main/xmi2yang/* ./src/main/resources/EAGLE-Open-Model-Profile-and-Tools/UmlYangTools/xmi2yang

# Convert UML to YANG
cd ./src/main/resources/EAGLE-Open-Model-Profile-and-Tools/UmlYangTools/xmi2yang

node main
node post-processing

# itereate through post processed yang modules
files=./project/*@*.yang
for file in $files;
do
  # use pyang to format yang by converting yang to yin and back to yang
  pyang -f yin  -o $file.yin $file;
  pyang -f yang -o $file $file.yin;
  # generate yang tree
  pyang -f tree -o $file.tree $file

  # copy all yang for odl java generation
  cp $file ../../../../odl-yang-to-sources/src/main/yang;
done;
cd ../../../../../..

# verify, that OpenDaylight can generate sources
# Expectation in logs: [INFO] BUILD SUCCESS
cd ./src/main/odl-yang-to-sources
mvn clean install -DskipTests
cd ../../..

# deploy
cp ./src/main/odl-yang-to-sources/src/main/yang/*.yang ./target 
cp ./src/main/resources/EAGLE-Open-Model-Profile-and-Tools/UmlYangTools/xmi2yang/project/*.yang.yin ./target 
cp ./src/main/resources/EAGLE-Open-Model-Profile-and-Tools/UmlYangTools/xmi2yang/project/*.yang.tree ./target 