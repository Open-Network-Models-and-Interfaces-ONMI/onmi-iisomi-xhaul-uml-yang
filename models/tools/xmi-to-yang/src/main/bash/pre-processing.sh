#!/bin/bash

################################################################################
# Test script by Waseem Sattar
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
# Author: 

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
if [ $# -gt 0 ]; then
    DIR=$1;
fi
##copy yang types to /target yang files
##working directory
echo "working Directory"
echo $DIR
#/home/wasimsattar/workspace/5G-xHaul/models/tools/xmi-to-yang/target/yang

##cp -v "${BASH_SOURCE[0]}/ietf-yang-types@2013-07-15.yang" $DIR

declare -A templatename
templatename=(
  [ietf-yang-types]=ietf-yang-types@2013-07-15
 );
  
##cp ${templatename[$index]}.yang ../../${templatename[$index]}.yang
done
