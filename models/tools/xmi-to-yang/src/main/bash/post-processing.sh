#!/bin/bash

################################################################################
# Copyright 2019 higshtreet technologies GmbH
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
# Author: martin.skorupski@highstreet-technologies.com

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
if [ $# -gt 0 ]; then
    DIR=$1;
fi

for yang in $DIR/*.yang
do
	echo "Post processing $yang"

  # find/replace in core-model
  sed -i -e "s/name local\-id/local-id/g" $yang
  sed -i -e "s/local\-id name/local-id/g" $yang
  sed -i -e "s/name,local\-id/local-id/g" $yang
  sed -i -e "s/local\-id,name/local-id/g" $yang

  sed -i -e "s/forwarding-constructuuid forwarding-constructname/uuid/g" $yang

  sed -i -e "s/path '\/core-model:logical-termination-point\/core-model:peer-ltp\/core-model:/path '\/core-model:control-construct\/core-model:logical-termination-point\/core-model:/g" $yang

  sed -i -e "s/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:embedded-clock\/core-model:encapsulated-fc\/core-model:uuid/\/core-model:control-construct\/core-model:forwarding-domain\/core-model:fc\/core-model:uuid/g" $yang

  sed -i -e "s/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:embedded-clock\/core-model:encapsulated-fc\/core-model:fc-port\/core-model:local-id/\/core-model:control-construct\/core-model:forwarding-domain\/core-model:fc\/core-model:fc-port\/core-model:local-id/g" $yang

  # find/replace in hybrid-microwave-structure
  sed -i -e "s/\/hybrid-mw-structure:hybrid-mw-structure-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang

  # find/replace in wire-interface
  sed -i -e "s/pmd\-kindpmd\-name/pmd-name/g" $yang
  
  # format
  pyang -f yang -p $DIR -o $yang $yang 
  
done