#!/bin/bash
#
# controller-spawn - Spawn the SDN controller
#
# Copyright (C) 2016 HCL Technologies 
#
# Author: Paolo Rovelli <paolo.rovelli@hcl.com>  
#

if [ $# -ne 1 ]
then
    echo "Usage: controller-spawn <config.json>"
    exit 0
fi

CONTROLLER_URL=$(jq -r '.["controller"]'.url ${1})
CONTROLLER_IMAGE=$(jq -r '.["controller"]'.image ${1})
CONTROLLER_VERSION=$(jq -r '.["controller"]'.version ${1})
CONTROLLER_REPO=${CONTROLLER_URL}/${CONTROLLER_IMAGE}
CONTROLLER_FILE=${CONTROLLER_IMAGE}-${CONTROLLER_VERSION}.tar.gz
CONTROLLER_DIR=${CONTROLLER_IMAGE}-${CONTROLLER_VERSION}
CONTROLLER_PATH=$(pwd)/.controllers

MODEL_SRC=$(dirname $(readlink -f ${1}))/$(jq -r .model.path ${1})
MODEL_DST=${CONTROLLER_PATH}/${CONTROLLER_DIR}/cache/schema

# Check the CONTROLLER
echo -n "Check the SDN controller ..."
if [ -x ${CONTROLLER_PATH}/${CONTROLLER_DIR}/bin/karaf ]; then
    echo " ok."
else
    echo " fail: '${CONTROLLER_PATH}/${CONTROLLER_DIR}/bin/karaf' not found!"
    exit 1
fi

# Importing MEDIATOR modules
echo "Import MEDIATOR modules into the SDN controller ..."
MODULES=($(grep -rl --exclude=${MODEL_SRC}/*@*.yang revision ${MODEL_SRC}/*.yang | awk '{print $1}'))
REVISIONS=($(grep -rh --exclude=${MODEL_SRC}/*@*.yang revision ${MODEL_SRC}/*.yang | awk '{print $2}'))
if [ ${#MODULES[@]} -gt 0 ]; then
    mkdir -p ${MODEL_DST}
fi
for x in ${!MODULES[@]}; do
    y=${MODULES[$x]##*/}
    z=${y%%.*}
    echo " - import '${z}@${REVISIONS[$x]}'"
    cp -f ${MODEL_SRC}/${z}.yang ${MODEL_DST}/${z}@${REVISIONS[$x]}.yang
done

# Start the CONTROLLER console
echo "Start the SDN controller ..."
echo ""
${CONTROLLER_PATH}/${CONTROLLER_DIR}/bin/karaf clean

