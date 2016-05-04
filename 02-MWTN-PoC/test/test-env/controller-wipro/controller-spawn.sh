#!/bin/bash
#
# controller-spawn - Spawn the Wipro SDN controller
#
# Copyright (C) 2016 HCL Technologies 
#
# Author: Paolo Rovelli <paolo.rovelli@hcl.com>  
#

if [ $# -ne 1 ]; then
    echo "Usage: controller-spawn <config.json>"
    exit 0
fi
. $(dirname $(readlink -f ${0}))/../utils/spinner-utils.sh

CONTROLLER_IDX=-1
CONTROLLER_NUM=$(jq -r '.topology | length' ${1})
CONTROLLER_URL=$(jq -r '.["controller-wipro"]'.url ${1})
CONTROLLER_IMAGE=$(jq -r '.["controller-wipro"]'.image ${1})
CONTROLLER_VERSION=$(jq -r '.["controller-wipro"]'.version ${1})

CONTROLLER_REPO=${CONTROLLER_URL}
CONTROLLER_DIR=${CONTROLLER_IMAGE}-${CONTROLLER_VERSION}/02-MWTN-PoC/code/odl/karaf/target/assembly
CONTROLLER_FILE=${CONTROLLER_IMAGE}-${CONTROLLER_VERSION}.tar.gz
CONTROLLER_PATH=$(pwd)/.controllers

MODEL_SRC=$(dirname $(readlink -f ${1}))/$(jq -r .model.path ${1})
MODEL_DST=${CONTROLLER_PATH}/${CONTROLLER_DIR}/cache/schema

while [ ${CONTROLLER_IDX} -lt ${CONTROLLER_NUM} ]; do

    CONTROLLER_IDX=$[${CONTROLLER_IDX}+1]
    CONTROLLER_TYPE=$(jq -r '.topology['${CONTROLLER_IDX}'].type' ${1})
    if [ "${CONTROLLER_TYPE}" != "controller-wipro" ]; then
        continue
    fi
    CONTROLLER_NAME=$(jq -r '.topology['${CONTROLLER_IDX}'].name' ${1})

    # Check the SDN controller
    spinner_exec "Check the SDN controller: " \
        test -x ${CONTROLLER_PATH}/${CONTROLLER_DIR}/bin/karaf
    if [ $? -ne 0 ]; then
        echo "cannot stat '${CONTROLLER_PATH}/${CONTROLLER_DIR}/bin/karaf'"
        return $?
    fi

    # Import SDN mediator modules
    echo "Import SDN mediator modules ... "
    MODULES=($(grep -rl --exclude=${MODEL_SRC}/*@*.yang revision \
        ${MODEL_SRC}/*.yang | awk '{print $1}'))
    REVISIONS=($(grep -rh --exclude=${MODEL_SRC}/*@*.yang revision \
        ${MODEL_SRC}/*.yang | awk '{print $2}'))
    if [ ${#MODULES[@]} -gt 0 ]; then
        mkdir -p ${MODEL_DST}
    fi
    for x in ${!MODULES[@]}; do
        y=${MODULES[$x]##*/}
        z=${y%%.*}
        spinner_exec " - import '${z}': " \
            cp -f ${MODEL_SRC}/${z}.yang ${MODEL_DST}/${z}@${REVISIONS[$x]}.yang
    done

    # Start the SDN controller console
    echo -e "Start the SDN controller ... \n"
    ${CONTROLLER_PATH}/${CONTROLLER_DIR}/bin/karaf clean

done

