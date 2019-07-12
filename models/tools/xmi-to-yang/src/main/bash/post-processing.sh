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

declare -A namespace
namespace=(
  [air-interface]=air-interface
  [core-model]=core-model
  [ethernet-container]=ethernet-container
  [hybrid-mw-structure]=hybrid-mw-structure
  [ip-interface]=ip-interface
  [mac-interface]=mac-interface
  [pure-ethernet-structure]=pure-ethernet-structure
  [tdm-container]=tdm-container
  [wire-interface]=wire-interface
);

declare -A layer
layer=(
  [air-interface]=LAYER_PROTOCOL_NAME_TYPE_AIR_LAYER
  [core-model]=COMMON_LAYER
  [ethernet-container]=LAYER_PROTOCOL_NAME_TYPE_ETHERNET_CONTAINER_LAYER
  [hybrid-mw-structure]=LAYER_PROTOCOL_NAME_TYPE_HYBRID_MW_STRUCTURE_LAYER
  [ip-interface]=LAYER_PROTOCOL_NAME_TYPE_IP_LAYER
  [mac-interface]=LAYER_PROTOCOL_NAME_TYPE_MAC_LAYER
  [pure-ethernet-structure]=LAYER_PROTOCOL_NAME_TYPE_PURE_ETHERNET_STRUCTURE_LAYER
  [tdm-container]=LAYER_PROTOCOL_NAME_TYPE_TDM_CONTAINER_LAYER
  [wire-interface]=LAYER_PROTOCOL_NAME_TYPE_WIRE_LAYER
);

for yang in $DIR/*.yang
do
	echo "Post processing $yang"

  # find/replace in core-model
  sed -i -e "s/name local\-id/local-id/g" $yang
  sed -i -e "s/local\-id name/local-id/g" $yang
  sed -i -e "s/name,local\-id/local-id/g" $yang
  sed -i -e "s/local\-id,name/local-id/g" $yang

  sed -i -e "s/forwarding-constructuuid forwarding-constructname/uuid/g" $yang
  sed -i -e "s/logical-termination-pointuuid logical-termination-pointname/uuid/g" $yang
  sed -i -e "s/fc-routeuuid fc-routename/uuid/g" $yang

  sed -i -e "s/container control-construct {/container control-construct {\npresence \"Enables SDN\";/g" $yang

  sed -i -e "s/fc-portlocal-id fc-portname/local-id/g" $yang

  sed -i -e "s/path '\/core-model:logical-termination-point\/core-model:peer-ltp\/core-model:/path '\/core-model:control-construct\/core-model:logical-termination-point\/core-model:/g" $yang

  sed -i -e "s/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:embedded-clock\/core-model:encapsulated-fc\/core-model:uuid/\/core-model:control-construct\/core-model:forwarding-domain\/core-model:fc\/core-model:uuid/g" $yang

  sed -i -e "s/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:embedded-clock\/core-model:encapsulated-fc\/core-model:fc-port\/core-model:local-id/\/core-model:control-construct\/core-model:forwarding-domain\/core-model:fc\/core-model:fc-port\/core-model:local-id/g" $yang

  # find/replace in air-interface
  sed -i -e "s/\/air-interface:air-interface-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang

  # find/replace in hybrid-microwave-structure
  sed -i -e "s/\/hybrid-mw-structure:hybrid-mw-structure-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang

  # find/replace in wire-interface
  sed -i -e "s/pmd\-kindpmd\-name/pmd-name/g" $yang

  # technology specific augmentation
  filename=${yang#*$DIR/};
  index=${filename%%.*};

  find="augment \"\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol\"{";

  identity="identity ${layer[$index]} {\n base core-model:LAYER_PROTOCOL_NAME_TYPE; \n description \"none\"; \n}\n";
  when="when \"derived-from-or-self(.\/core-model:layer-protocol-name, '${namespace[$index]}:${layer[$index]}')\";"
  replace=" $identity \n $find \n $when";

  sed -i -e "s/$find/$replace/g" $yang;

  # format
  pyang -f yang -p $DIR -o $yang $yang
  unix2dos $yang
  
done
