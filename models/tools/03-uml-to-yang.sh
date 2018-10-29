#!/bin/bash

################################################################################
# Script to convert yang modules into other formats
# Author: martin.skorupski@highstreet-technologies.com
# 
# Copyright 2018 higshtreet technologies GmbH
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# 

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