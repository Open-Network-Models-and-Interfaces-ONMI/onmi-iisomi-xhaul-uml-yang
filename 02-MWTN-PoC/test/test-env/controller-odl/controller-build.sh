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


CONTROLLER_URL=$(jq -r '.["controller-odl"]'.url ${1})
CONTROLLER_IMAGE=$(jq -r '.["controller-odl"]'.image ${1})
CONTROLLER_VERSION=$(jq -r '.["controller-odl"]'.version ${1})
CONTROLLER_REPO=${CONTROLLER_URL}/${CONTROLLER_IMAGE}
CONTROLLER_DIR=${CONTROLLER_IMAGE}-${CONTROLLER_VERSION}
CONTROLLER_FILE=${CONTROLLER_IMAGE}-${CONTROLLER_VERSION}.tar.gz
CONTROLLER_PATH=$(pwd)/.controllers

# Download the CONTROLLER distribution
echo -n "Download the SDN controller ..."
mkdir -p ${CONTROLLER_PATH}
if [ ! -e ${CONTROLLER_PATH}/${CONTROLLER_FILE} ]; then
    wget -q -O - ${CONTROLLER_REPO}/${CONTROLLER_VERSION}/${CONTROLLER_FILE} > ${CONTROLLER_PATH}/${CONTROLLER_FILE}
    echo " ok."
else
    echo " already ok."
fi

# Install the CONTROLLER distribution
echo -n "Extract the SDN controller ..."
rm -fr ${CONTROLLER_PATH}/${CONTROLLER_DIR}
tar zxf ${CONTROLLER_PATH}/${CONTROLLER_FILE} -C ${CONTROLLER_PATH}
if [ -x ${CONTROLLER_PATH}/${CONTROLLER_DIR}/bin/karaf ]; then
    echo " ok."
else
    echo " fail: '${CONTROLLER_PATH}/${CONTROLLER_DIR}/bin/karaf' not found!"
    exit 1
fi

# Fix the CONTROLLER boot features
echo -n "Fix the SDN controller boot features ..."
sed -i 's/featuresBoot=config,standard,region,package,kar,ssh,management/featuresBoot=config,standard,region,package,kar,ssh,management,odl-netconf-connector-all,odl-restconf,odl-mdsal-apidocs,odl-dlux-all/g' ${CONTROLLER_PATH}/${CONTROLLER_DIR}/etc/org.apache.karaf.features.cfg
echo " ok."

