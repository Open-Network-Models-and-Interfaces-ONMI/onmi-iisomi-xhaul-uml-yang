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
  [air-interface]=air-interface-2-0
  [core-model]=core-model-1-4
  [extensible-network-function]=core-model  
  [ethernet-container]=ethernet-container-2-0
  [hybrid-mw-structure]=hybrid-mw-structure-2-0
  [ip-interface]=ip-interface-1-0
  [l-3vpn-profile]=l-3vpn-profile-1-0
  [mac-interface]=mac-interface-1-0
  [pure-ethernet-structure]=pure-ethernet-structure-2-0
  [qos-profile]=qos-profile-1-0
  [tdm-container]=tdm-container-2-0
  [wire-interface]=wire-interface-2-0
  [wred-profile]=wred-profile-1-0
  [co-channel-profile]=co-channel-profile-1-0
  [policing-profile]=policing-profile-1-0
  [scheduler-profile]=scheduler-profile-1-0
  [vlan-interface]=vlan-interface-1-0
  [vlan-fc]=vlan-fc-1-0
  [vlan-fd]=vlan-fd-1-0
  [ltp-augment]=ltp-augment-1-0
  [mac-fc]=mac-fc-1-0
  [mac-fd]=mac-fd-1-0
  [firmware]=firmware-1-0  
  [backup-and-restore]=backup-and-restore-1-0 
  [synchronization]=synchronization-1-0
  [alarms]=alarms-1-0
  [lldp]=lldp-1-0
  [equipment-augment]=equipment-augment-1-0
  [notifications]=notifications-1-0
  [ethernet-container-fc]=ethernet-container-fc-1-0
  [ethernet-container-fd]=ethernet-container-fd-1-0
);

declare -A fileversions
fileversions=(
  [air-interface]=air-interface-2-0 
  [core-model]=core-model-1-4
  [extensible-network-function]=core-model  
  [ethernet-container]=ethernet-container-2-0
  [hybrid-mw-structure]=hybrid-mw-structure-2-0
  [ip-interface]=ip-interface-1-0
  [l-3vpn-profile]=l-3vpn-profile-1-0
  [mac-interface]=mac-interface-1-0
  [pure-ethernet-structure]=pure-ethernet-structure-2-0
  [qos-profile]=qos-profile-1-0
  [policing-profile]=policing-profile-1-0
  [scheduler-profile]=scheduler-profile-1-0
  [tdm-container]=tdm-container-2-0
  [wire-interface]=wire-interface-2-0
  [wred-profile]=wred-profile-1-0
  [co-channel-profile]=co-channel-profile-1-0
  [vlan-interface]=vlan-interface-1-0
  [vlan-fc]=vlan-fc-1-0
  [vlan-fd]=vlan-fd-1-0
  [ltp-augment]=ltp-augment-1-0
  [mac-fc]=mac-fc-1-0
  [mac-fd]=mac-fd-1-0
  [firmware]=firmware-1-0
  [backup-and-restore]=backup-and-restore-1-0
  [synchronization]=synchronization-1-0
  [alarms]=alarms-1-0
  [lldp]=lldp-1-0
  [equipment-augment]=equipment-augment-1-0
  [notifications]=notifications-1-0
  [ethernet-container-fc]=ethernet-container-fc-1-0
  [ethernet-container-fd]=ethernet-container-fd-1-0
);


declare -A layer
layer=(
  [air-interface]=LAYER_PROTOCOL_NAME_TYPE_AIR_LAYER
  [core-model]=COMMON_LAYER
  [extensible-network-function]=COMMON_LAYER
  [ethernet-container]=LAYER_PROTOCOL_NAME_TYPE_ETHERNET_CONTAINER_LAYER
  [hybrid-mw-structure]=LAYER_PROTOCOL_NAME_TYPE_HYBRID_MW_STRUCTURE_LAYER
  [ip-interface]=LAYER_PROTOCOL_NAME_TYPE_IP_LAYER
  [mac-interface]=LAYER_PROTOCOL_NAME_TYPE_MAC_LAYER
  [pure-ethernet-structure]=LAYER_PROTOCOL_NAME_TYPE_PURE_ETHERNET_STRUCTURE_LAYER
  [tdm-container]=LAYER_PROTOCOL_NAME_TYPE_TDM_CONTAINER_LAYER
  [wire-interface]=LAYER_PROTOCOL_NAME_TYPE_WIRE_LAYER
  [vlan-interface]=LAYER_PROTOCOL_NAME_TYPE_VLAN_LAYER
  [vlan-fc]=LAYER_PROTOCOL_NAME_TYPE_VLAN_LAYER
  [vlan-fd]=LAYER_PROTOCOL_NAME_TYPE_VLAN_LAYER
  [ltp-augment]=LAYER_PROTOCOL_NAME_TYPE_LTP_LAYER
  [mac-fc]=LAYER_PROTOCOL_NAME_TYPE_MAC_LAYER
  [mac-fd]=LAYER_PROTOCOL_NAME_TYPE_MAC_LAYER
  [firmware]=COMMON_LAYER
  [backup-and-restore]=COMMON_LAYER
  [synchronization]=LAYER_PROTOCOL_NAME_TYPE_SYNCHRONIZATION_LAYER
  [alarms]=COMMON_LAYER
  [lldp]=COMMON_LAYER
  [equipment-augment]=COMMON_LAYER
  [notifications]=COMMON_LAYER
  [ethernet-container-fc]=LAYER_PROTOCOL_NAME_TYPE_ETHERNET_CONTAINER_LAYER
  [ethernet-container-fd]=LAYER_PROTOCOL_NAME_TYPE_ETHERNET_CONTAINER_LAYER
);

declare -A profile
profile=(
  [l-3vpn-profile]=PROFILE_NAME_TYPE_L3VPN_PROFILE
  [qos-profile]=PROFILE_NAME_TYPE_QOS_PROFILE
  [wred-profile]=PROFILE_NAME_TYPE_WRED_PROFILE
  [co-channel-profile]=PROFILE_NAME_TYPE_CO_CHANNEL_PROFILE
  [policing-profile]=PROFILE_NAME_TYPE_POLICING_PROFILE
  [scheduler-profile]=PROFILE_NAME_TYPE_SCHEDULER_PROFILE
);


# technology specific augmentation
## layer protocol name
  
echo "copying ietf yang "$DIR
cd $DIR 
cp ../../ietf-yang-types@2013-07-15.yang $DIR
cd .
  

for yang in $DIR/*.yang
do
	echo "Post processing $yang"
        filename=${yang#*$DIR/}
	index=${filename%%.*}
        echo "index: "$index

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
  sed -i -e "s/fc-portname/local-id/g" $yang

  #  sed -i -e "s/path '\/core-model:logical-termination-point\/core-model:peer-ltp\/core-model:/path '\/core-model:control-construct\/core-model:logical-#termination-point\/core-model:/g" $yang
  find="\/core-model:logical-termination-point\/core-model:peer-ltp\/core-model";
  replace="\/core-model:control-construct\/core-model:logical-termination-point\/core-model"
  #sed -i -e "s/\/core-model:logical-termination-point\/core-model:peer-ltp\/core-model\/core-model:control-construct\/core-model:logical-termination-point\/core-model/g" $yang
  sed -i -e "s/$find/$replace/g" $yang

  sed -i -e "s/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:embedded-clock\/core-model:encapsulated-fc\/core-model:uuid/\/core-model:control-construct\/core-model:forwarding-domain\/core-model:fc\/core-model:uuid/g" $yang

  sed -i -e "s/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:embedded-clock\/core-model:encapsulated-fc\/core-model:fc-port\/core-model:local-id/\/core-model:control-construct\/core-model:forwarding-domain\/core-model:fc\/core-model:fc-port\/core-model:local-id/g" $yang
  # find/replace in synchModel
   sed -i -e "s/\/synchronization:sync-cc-spec/\/core-model:control-construct/g" $yang
    # find/replace in synchModel
   sed -i -e "s/\/synchronization:synch-ltp-spec/\/core-model:control-construct\/core-model:logical-termination-point/g" $yang
  # find/replace in air-interface
  sed -i -e "s/\/air-interface:air-interface-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang

 # find/replace in ethernet-container
 sed -i -e "s/\/ethernet-container:ethernet-container-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang

  # find/replace in hybrid-microwave-structure
  sed -i -e "s/\/hybrid-mw-structure:hybrid-mw-structure-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang
   # find/replace in vlan-interface
  sed -i -e "s/\/vlan-interface:vlan-interface-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang

  # find/replace in vlan-fc
  sed -i -e "s/\/vlan-fc:vlan-fc-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang

   # find/replace in vlan-fd
  sed -i -e "s/\/vlan-fd:vlan-fd-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang
   
   # find/replace in ethernet-container-fc
  sed -i -e "s/\/ethernet-container-fc:ethernet-container-fc-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang

 # find/replace in ethernet-container-fd
  sed -i -e "s/\/ethernet-container-fd:ethernet-container-fd-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang

   # find/replace in ltp-augment
  sed -i -e "s/\/ltp-augment:ltp-augment-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang

    # find/replace in mac-fc
  sed -i -e "s/\/mac-fc:mac-fc-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang
    
    # find/replace in mac-fd
  sed -i -e "s/\/mac-fd:mac-fd-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang

  # find/replace in wire-interface
  sed -i -e "s/pmd\-kindpmd\-name/pmd-name/g" $yang
  sed -i -e "s/\/wire-interface:wire-interface-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang
  find=".pnr";
  replace="";
  sed -i -e "s/$find/$replace/g" $yang;

  # find/replace for synchronization module
  find="uses synchronization-clock-spec;";
  replace="when \"derived-from-or-self(.\/synchronization:layer-protocol-name, 'synchronization:LAYER_PROTOCOL_NAME_TYPE_SYNCHRONIZATION_LAYER')\";\n\t\tuses synchronization-clock-spec;";
  sed -i -e "s/$find/$replace/g" $yang;

find="uses ptp-clock-spec;";
  replace="when \"derived-from-or-self(.\/synchronization:layer-protocol-name, 'synchronization:LAYER_PROTOCOL_NAME_TYPE_PTP_LAYER')\";\n\t\tuses ptp-clock-spec;";
  sed -i -e "s/$find/$replace/g" $yang;

find="uses synch-ltp-spec;";
  replace="when \"derived-from-or-self(.\/core-model:layer-protocol\/core-model:layer-protocol-name, 'synchronization:LAYER_PROTOCOL_NAME_TYPE_SYNCHRONIZATION_LAYER')\";\n\t\tuses synch-ltp-spec;";
  sed -i -e "s/$find/$replace/g" $yang;

find="uses sync-protection-spec;";
  replace="when \"derived-from-or-self(\/core-model:control-construct\/core-model:forwarding-domain\/core-model:fc\/core-model:layer-protocol-name, 'synchronization:LAYER_PROTOCOL_NAME_TYPE_SYNCHRONIZATION_LAYER')\";\n\t\tuses sync-protection-spec;";
  sed -i -e "s/$find/$replace/g" $yang;

find="uses sync-lp-spec;";
  replace="when \"derived-from-or-self(.\/core-model:layer-protocol-name, 'synchronization:LAYER_PROTOCOL_NAME_TYPE_SYNCHRONIZATION_LAYER')\";\n\t\tuses sync-lp-spec;";
  sed -i -e "s/$find/$replace/g" $yang;

find="uses ptp-lp-spec;";
  replace="when \"derived-from-or-self(.\/core-model:layer-protocol-name, 'synchronization:LAYER_PROTOCOL_NAME_TYPE_PTP_LAYER')\";\n\t\tuses ptp-lp-spec;";
  sed -i -e "s/$find/$replace/g" $yang;

  # find/replace wred
  find="co-channel-profile\.pnr:co-channel-profile-pac";
  replace="wred-profile-pac";
  sed -i -e "s/$find/$replace/g" $yang;

  find="co-channel-profile.pnr:co-channel-profile-capability";
  replace="wred-profile-capability";
  sed -i -e "s/$find/$replace/g" $yang;

  find="co-channel-profile.pnr:co-channel-profile-configuration";
  replace="wred-profile-configuration";
  sed -i -e "s/$find/$replace/g" $yang;
if [ $filename == 'synchronization.yang' ]
then
find="augment \"\/core-model:control-construct\"{";
identity="identity  LAYER_PROTOCOL_NAME_TYPE_SYNCHRONIZATION_LAYER {\n base core-model:LAYER_PROTOCOL_NAME_TYPE; \n description \"none\"; \n}\n";
when="identity LAYER_PROTOCOL_NAME_TYPE_PTP_LAYER {\n base core-model:LAYER_PROTOCOL_NAME_TYPE; \n description \"none\"; \n}\n";
replace=" $identity \n $when \n $find";
sed -i -e "s/$find/$replace/g" $yang;
fi


#find/replace tdm-container
sed -i -e "s/\/tdm-container:tdm-container-lp-spec/\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/g" $yang


find="augment \"\/core-model:control-construct\/equipment-augment:protocol-collection\/equipment-augment:protocol\"{";
when="when \"derived-from-or-self(.\/equipment-augment:protocol-name, 'lldp:PROTOCOL_NAME_TYPE_LLDP')\";"
replace=" $find \n $when";
sed -i -e "s/$find/$replace/g" $yang;
  # find/replace in 

if [ $filename != 'synchronization.yang' ]
then
  find="augment \"\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol\"{";
  identity="identity ${layer[$index]} {\n base core-model:LAYER_PROTOCOL_NAME_TYPE; \n description \"none\"; \n}\n";
  when="when \"derived-from-or-self(.\/core-model:layer-protocol-name, '$index:${layer[$index]}')\";"
  replace=" $identity \n $find \n $when";
  #replace=" $find \n $when";
  sed -i -e "s/$find/$replace/g" $yang;
fi

  # find/replace in

 find="augment \"\/core-model:control-construct\/core-model:forwarding-domain\/core-model:fc\"{";
 identity="identity ${layer[$index]} {\n base core-model:LAYER_PROTOCOL_NAME_TYPE; \n description \"none\"; \n}\n";
 when="when \"derived-from-or-self(.\/core-model:layer-protocol-name, 'ethernet-container-fc:${layer[$index]}')\";"
 replace=" $identity \n $find \n $when";
 #replace=" $find \n $when";
 sed -i -e "s/$find/$replace/g" $yang;

  # find/replace in

 find="augment \"\/core-model:control-construct\/core-model:forwarding-domain\"{";
 #identity="identity ${layer[$index]} {\n base core-model:LAYER_PROTOCOL_NAME_TYPE; \n description \"none\"; \n}\n";
 when="when \"derived-from-or-self(.\/core-model:layer-protocol-name, 'mac-interface:${layer[$index]}')\";"
 replace=" $find \n $when";
 #replace=" $find \n $when";
 sed -i -e "s/$find/$replace/g" $yang;

  ## profile name
  find="augment \"\/core-model:control-construct\/core-model:profile-collection\/core-model:profile\"{";
  
  identity="identity ${profile[$index]} {\n base core-model:PROFILE_NAME_TYPE; \n description \"none\"; \n}\n";
  when="when \"derived-from-or-self(.\/core-model:profile-name, '$index:${profile[$index]}')\";"
  replace=" $identity \n $find \n $when";
  sed -i -e "s/$find/$replace/g" $yang;

 ##modules
  #echo "namespace: "${namespace[$index]}
  find="module "$index; 
  replace="module "${namespace[$index]};
  sed -i -e "s/$find/$replace/g" $yang;

  find='namespace \".*\"';
  replace='\r    namespace \"urn:onf:yang:'${namespace[$index]}'"';
  sed -i -e "s/$find/$replace/g" $yang;
  
#echo "yang"$yang;
#echo "find"$find;
#echo "replace"$replace;

  ## imports
  find="import core-model";
  replace="import core-model-1-4";
  sed -i -e "s/$find/$replace/g" $yang;

  ## imports
  find="import vlan-interface";
  replace="import vlan-interface-1-0";
  sed -i -e "s/$find/$replace/g" $yang;
  
  ## imports
  find="import mac-interface";
  replace="import mac-interface-1-0";
  sed -i -e "s/$find/$replace/g" $yang;
  
   ## imports
  find="import equipment-augment";
  replace="import equipment-augment-1-0";
  sed -i -e "s/$find/$replace/g" $yang;

  find="import implementation-common-data-types";
  replace="import ietf-yang-types";
  sed -i -e "s/$find/$replace/g" $yang;

  find="prefix implementation-common-data-types";
  replace="prefix yang";
  sed -i -e "s/$find/$replace/g" $yang;

  ## remove umlprimitive-types import
  find="import umlprimitive-types (.|\s)*import";
  replace="import";
  sed -i -e "s/$find/$replace/g" $yang;

  ## prefix yang
  find="prefix ietf-yang-types";
  replace="prefix yang";
  sed -i -e "s/$find/$replace/g" $yang;

  ## path deref inclusion
  sed -i -e "s/pathmust \"\/core-model:control-construct\/core-model:logical-termination-point\/core-model:layer-protocol/path \"\/core-model:control-construct\/core-model:logical-termination-point[core-model:uuid = current()\/..\/..\/..\/..\/core-model:uuid]\/core-model:layer-protocol[core-model:local-id = current()\/..\/..\/..\/core-model:local-id]/g" $yang
 
  sed -i -e "s/pathmust \"\/core-model:control-construct\/core-model:logical-termination-point\/core-model:embedded-clock/path \"\/core-model:control-construct\/core-model:logical-termination-point[core-model:uuid = current()\/..\/..\/core-model:uuid]\/core-model:embedded-clock/g" $yang

  sed -i -e "s/pathmust \"\/core-model:forwarding-construct/path \"\/core-model:control-construct\/core-model:forwarding-domain\/core-model:fc/g" $yang
  sed -i -e "s/path \"\/core-model:forwarding-construct/path \"\/core-model:control-construct\/core-model:forwarding-domain\/core-model:fc/g" $yang
  sed -i -e "s/pathmust \"\/core-model:control-construct\/core-model:forwarding-domain\/core-model:fd-port\/core-model:local-id/path \"\/core-model:control-construct\/core-model:forwarding-domain\/core-model:fd-port\/core-model:local-id/g" $yang

  ## Removing the key "fc-switchlocal-id fc-switchname" and replacing it with "local-id"
  find="fc-switchlocal-id fc-switchname";
  replace="local-id";
  sed -i -e "s/$find/$replace/g" $yang;

  ## Removing the text "changeinpmeostprocessing" added to the prune-and-refactor-core-model.xslt to the typedef layerProtocolNameType and profileNameType
  find="namxx";
  replace="name";
  sed -i -e "s/$find/$replace/g" $yang;

  find="NAMXX";
  replace="NAME";
  sed -i -e "s/$find/$replace/g" $yang;
  
  ## Removing the text "changeinpmeostprocessing" added to the prune-and-refactor-core-model.xslt to the typedef layerProtocolNameType and profileNameType
  find="local-id local-id";
  replace="local-id";
  sed -i -e "s/$find/$replace/g" $yang;

  ## prefix yang
  find="uint-64";
  replace="uint64";
  sed -i -e "s/$find/$replace/g" $yang;

  ## find/replace firmware
  find="firmware:firmware-collection";
  replace="core-model:control-construct";
  sed -i -e "s/$find/$replace/g" $yang;
  
  ## find/replace backup-and-restore
  find="backup-and-restore:backup-and-restore-cc-spec";
  replace="core-model:control-construct";
  sed -i -e "s/$find/$replace/g" $yang;
  
  ## find/replace lldp remote-statistics leafref path
  find="\"\/lldp:lldp\/lldp:remote-statistics\/lldp:";
  replace="\"\/core-model:control-construct\/equipment-augment:protocol-collection\/lldp:remote-statistics\/lldp:last-change-time";
  sed -i -e "s/$find/$replace/g" $yang;
  
  echo "before the if con"
  echo $filename
  if [ $filename == 'equipment-augment.yang' ]
  then
	  find="identity EQUIPMENT_CATEGORY {";
	  replace="identity EQUIPMENT_CATEGORY { \n base core-model:EQUIPMENT_CATEGORY;";
	  sed -i -e "s/$find/$replace/g" $yang;
  fi

  if [ $filename == 'lldp.yang' ]
  then
          find="identity PROTOCOL_NAME_TYPE {";
          replace="identity PROTOCOL_NAME_TYPE { \n base equipment-augment:PROTOCOL_NAME_TYPE;";
          sed -i -e "s/$find/$replace/g" $yang;
  fi

  find="pathmust"
  replace="path"
  sed -i -e "s/$find/$replace/g" $yang;

  ## find/replace lldp remote-statistics leafref path
  find="\"\/equipment-augment:control-construct-spec\/equipment-augment:protocol-collection\/equipment-augment:protocol\/equipment-augment:uuid";
  replace="\"\/core-model:control-construct\/equipment-augment:protocol-collection\/equipment-augment:protocol\/equipment-augment:uuid";
  sed -i -e "s/$find/$replace/g" $yang;

  mv $filename ${fileversions[$index]}".yang"; 
done

cd .


##change filenames
for yang in $DIR/*.yang
do
  echo "unix2dos"
  /usr/local/bin/pyang -f yang -p $DIR -o $yang $yang
  unix2dos $yang
done


