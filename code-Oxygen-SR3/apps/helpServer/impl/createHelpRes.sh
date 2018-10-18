#!/bin/bash

DEVFOLDER="../../.."
NC2SNMPFOLDER="$HOME/odl-centennial/Netconf2SNMP/Netconf2SNMP/"
HLPRESFOLDER=$DEVFOLDER"/apps/helpServer/impl/target/help/help"
#HLPRESFOLDER="$ODL_KARAF_HOME/data/cache/com.highstreet.technologies.help/"
UXFOLDER=$DEVFOLDER"/ux"

VERSION="0.4.0"
CLEAR_BEFORE_COPY=1

create_ifne(){
  if [ ! -d "$1" ]; then
  echo "creating "$1
    mkdir "$1"
  fi
}

#
# create folder for version and copy all files in $src/ to $dst/$v/
#
create_help_for(){
  v=$1
  dst=$2
  src=$3

  create_ifne "$dst"
  create_ifne "$dst/$v"
  echo "coping from "$src"/* to "$dst"/"$v"/"
  cp "$src"/* "$dst"/"$v"/
}

# as above but file only as README.md
create_help_for_fo(){
  v=$1
  dst=$2
  src=$3
  create_ifne "$dst"
  create_ifne "$dst/$v"
  echo "coping "$src" to "$dst"/"$v"/"
  cp $src "$dst"/"$v"/README.md
}
# as above but file only
create_help_for_res(){
  v=$1
  dst=$2
  src=$3
  create_ifne "$dst"
  create_ifne "$dst/$v"
  echo "coping "$src" to "$dst"/"$v"/"
  cp $src "$dst"/"$v"/
}


#beginning the script

echo "Create Help files "$(pwd)
echo

if [ ! -d "$HLPRESFOLDER" ] ; then
  mkdir -p $HLPRESFOLDER
fi

if [ $CLEAR_BEFORE_COPY == 1 ]; then
  echo "cleaning help folder"
  rm -rf "$HLPRESFOLDER"/*
fi

create_help_for $VERSION $HLPRESFOLDER"/sdnr" $UXFOLDER"/help/help-help"
create_help_for $VERSION $HLPRESFOLDER"/sdnr/connect" $UXFOLDER"/mwtnConnect/mwtnConnect-help"

#create_help_for $VERSION $HLPRESFOLDER"/sdnr/onapAai" $UXFOLDER"/onapAai/onapAai-help"
#create_help_for $VERSION $HLPRESFOLDER"/sdnr/onapDcae" $UXFOLDER"/onapDcae/onapDcae-help"
#create_help_for $VERSION $HLPRESFOLDER"/sdnr/onapSo" $UXFOLDER"/onapSo/onapSo-help"
#create_help_for $VERSION $HLPRESFOLDER"/sdnr/otnBrowser" $UXFOLDER"/otnBrowser/otnBrowser-help"
#create_help_for $VERSION $HLPRESFOLDER"/sdnr/ethService" $UXFOLDER"/ethService/ethService-help"

create_help_for $VERSION $HLPRESFOLDER"/sdnr/pnfFault" $UXFOLDER"/mwtnFault/mwtnFault-help"
create_help_for $VERSION $HLPRESFOLDER"/sdnr/pnfMaintenance" $UXFOLDER"/maintenancemode/maintenancemode-help"
create_help_for $VERSION "$HLPRESFOLDER/sdnr/pnfConfig" $UXFOLDER"/mwtnBrowser/mwtnBrowser-help"
create_help_for $VERSION $HLPRESFOLDER"/sdnr/pnfPerformance" $UXFOLDER"/mwtnPerformanceCurrent/mwtnPerformanceCurrent-help"
#create_help_for $VERSION $HLPRESFOLDER"/sdnr/mwtnTopology" $UXFOLDER"/mwtnTopology/mwtnTopology-help"
create_help_for $VERSION $HLPRESFOLDER"/sdnr/pnfInventory" $UXFOLDER"/mwtnInventory/mwtnInventory-help"
create_help_for $VERSION $HLPRESFOLDER"/sdnr/pnfMediator" $UXFOLDER"/mwtnMediator/mwtnMediator-help"
#create_help_for $VERSION $HLPRESFOLDER"/sdnr/mwtnSpectrum" $UXFOLDER"/mwtnSpectrum/mwtnSpectrum-help"
#create_help_for $VERSION $HLPRESFOLDER"/sdnr/mwtnTdm" $UXFOLDER"/mwtnTdm/mwtnTdm-help"
#create_help_for $VERSION $HLPRESFOLDER"/sdnr/mwtnClosedLoop" $UXFOLDER"/mwtnClosedLoop/mwtnClosedLoop-help"
#create_help_for $VERSION $HLPRESFOLDER"/sdnr/mwtnCompare" $UXFOLDER"/mwtnCompare/mwtnCompare-help"
#create_help_for $VERSION $HLPRESFOLDER"/sdnr/mwtnEvents" $UXFOLDER"/mwtnEvents/mwtnEvents-help"
create_help_for $VERSION $HLPRESFOLDER"/sdnr/mwtnTest" $UXFOLDER"/mwtnTest/mwtnTest-help"
create_help_for $VERSION $HLPRESFOLDER"/sdnr/mwtnLog" $UXFOLDER"/mwtnLog/mwtnLog-help"

# create_help_for_fo $VERSION $HLPRESFOLDER"/MediatorServer/" $NC2SNMPFOLDER"/MediatorServer/att.md"
# create_help_for_fo $VERSION $HLPRESFOLDER"/MediatorServer/Installation" $NC2SNMPFOLDER"/MediatorServer/installation.md"
# create_help_for_fo $VERSION $HLPRESFOLDER"/MediatorServer/Mediator" $NC2SNMPFOLDER"/Netconf2SNMPMediator/att.md"
create_help_for_fo $VERSION $HLPRESFOLDER"/mediatorserver/" $NC2SNMPFOLDER"/MediatorServer/att.md"
create_help_for_fo $VERSION $HLPRESFOLDER"/mediatorserver/installation" $NC2SNMPFOLDER"/MediatorServer/installation.md"
create_help_for_fo $VERSION $HLPRESFOLDER"/mediatorserver/mediator" $NC2SNMPFOLDER"/Netconf2SNMPMediator/att.md"

#create_help_for $VERSION $HLPRESFOLDER"/sdnr/" $UXFOLDER"/"

cp ./meta.json $HLPRESFOLDER

