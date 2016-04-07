#!/bin/bash
#
# mediator-build - Build CERAGON-MEDIATOR
#
# Copyright (C) 2016 HCL Technologies
#
# Author: Paolo Rovelli <paolo.rovelli@hcl.com>  
#

if [ $# -ne 1 ]
then
    echo "Usage: mediator-build <config.json>"
    exit 0
fi

MEDIATOR_URL=$(jq -r '.["mediator-ceragon"]'.url ${1})
MEDIATOR_IMAGE=$(jq -r '.["mediator-ceragon"]'.image ${1})
MEDIATOR_VERSION=$(jq -r '.["mediator-ceragon"]'.version ${1})
MEDIATOR_REPO=${MEDIATOR_URL}
MEDIATOR_DIR=${MEDIATOR_IMAGE}-${MEDIATOR_VERSION}
MEDIATOR_FILE=${MEDIATOR_IMAGE}-${MEDIATOR_VERSION}.tar.gz
MEDIATOR_PATH=$(pwd)/.mediators

# Download the MEDIATOR distribution
echo -n "Download the MEDIATOR ..."
mkdir -p ${MEDIATOR_PATH}
if [ ! -e ${MEDIATOR_PATH}/${MEDIATOR_FILE} ]; then
    curl -L -o ${MEDIATOR_PATH}/${MEDIATOR_FILE} ${MEDIATOR_REPO}/tarball/${MEDIATOR_VERSION} > /dev/null 2>&1
    echo " ok."
else
    echo " already ok."
fi

# Extract the MEDIATOR distribution
echo -n "Extract the MEDIATOR ..."
rm -fr ${MEDIATOR_PATH}/${MEDIATOR_DIR}
mkdir -p ${MEDIATOR_PATH}/${MEDIATOR_DIR}
tar zxf ${MEDIATOR_PATH}/${MEDIATOR_FILE} --strip-components=1 -C ${MEDIATOR_PATH}/${MEDIATOR_DIR}
if [ -d ${MEDIATOR_PATH}/${MEDIATOR_DIR}/02-MWTN-PoC/code/mediator ]; then
    echo " ok."
else
    echo " fail."
fi

# Build the MEDIATOR image
echo -n "Build the MEDIATOR ..."
cp -f $(dirname $(readlink -f ${0}))/Dockerfile ${MEDIATOR_PATH}/${MEDIATOR_DIR}/02-MWTN-PoC/code/mediator
docker build -t ${MEDIATOR_IMAGE} ${MEDIATOR_PATH}/${MEDIATOR_DIR}/02-MWTN-PoC/code/mediator > /dev/null
if [ -n $(docker images -q ${MEDIATOR_IMAGE}) ]; then
    echo " ok."
else
    echo " fail."
fi

