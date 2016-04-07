#!/bin/bash
#
# controller-build - Build the SDN controller
#
# Copyright (C) 2016 HCL Technologies
#
# Author: Paolo Rovelli <paolo.rovelli@hcl.com>
#

if [ $# -ne 1 ]
then
    echo "Usage: controller-build <config.json>"
    exit 0
fi

CONTROLLER_URL=$(jq -r '.["controller-wipro"]'.url ${1})
CONTROLLER_IMAGE=$(jq -r '.["controller-wipro"]'.image ${1})
CONTROLLER_VERSION=$(jq -r '.["controller-wipro"]'.version ${1})
CONTROLLER_REPO=${CONTROLLER_URL}
CONTROLLER_DIR=${CONTROLLER_IMAGE}-${CONTROLLER_VERSION}
CONTROLLER_FILE=${CONTROLLER_IMAGE}-${CONTROLLER_VERSION}.tar.gz
CONTROLLER_PATH=$(pwd)/.controllers

# Download the CONTROLLER distribution
echo -n "Download the SDN controller ..."
mkdir -p ${CONTROLLER_PATH}
if [ ! -e ${CONTROLLER_PATH}/${CONTROLLER_FILE} ]; then
    curl -L -o ${CONTROLLER_PATH}/${CONTROLLER_FILE} ${CONTROLLER_REPO}/tarball/${CONTROLLER_VERSION} > /dev/null 2>&1
    echo " ok."
else
    echo " already ok."
fi

# Extract the CONTROLLER distribution
echo -n "Extract the SDN controller ..."
rm -fr ${CONTROLLER_PATH}/${CONTROLLER_DIR}
mkdir -p ${CONTROLLER_PATH}/${CONTROLLER_DIR}
tar zxf ${CONTROLLER_PATH}/${CONTROLLER_FILE} --strip-components=1 -C ${CONTROLLER_PATH}/${CONTROLLER_DIR}
if [ -e ${CONTROLLER_PATH}/${CONTROLLER_DIR}/02-MWTN-PoC/code/odl/pom.xml ]; then
    echo " ok."
else
    echo " fail: '${CONTROLLER_PATH}/${CONTROLLER_DIR}/02-MWTN-PoC/code/odl/pom.xml' not found!"
    exit 1
fi

# Build the CONTROLLER distribution
echo -n "Build the SDN controller ..."
mkdir -p ~/.m2
cp -n ~/.m2/settings.xml{,.orig}
wget -q -O - https://raw.githubusercontent.com/opendaylight/odlparent/master/settings.xml > ~/.m2/settings.xml
if [ $? -ne 0 ]; then
    mv ~/.m2/settings.xml{.orig,}
fi

cd ${CONTROLLER_PATH}/${CONTROLLER_DIR}/02-MWTN-PoC/code/odl/ > /dev/null
mvn clean install -DskipTests=true > /dev/null
if [ $? -eq 0 ]; then
    cd - > /dev/null
    echo " ok."
else
    echo " fail!"
    exit 1
fi

