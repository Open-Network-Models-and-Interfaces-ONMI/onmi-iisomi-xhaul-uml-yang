#!/bin/bash
#
# controller-build - Build the SDN controller
#
# Copyright (C) 2016 HCL Technologies
#
# Author: Paolo Spallaccini <paolo.spallaccini@hcl.com>
#

if [ $# -ne 1 ]; then
    echo "Usage: controller-build <config.json>"
    exit 0
fi
. $(dirname $(readlink -f ${0}))/../utils/spinner-utils.sh

CONTROLLER_URL=$(jq -r '.["controller-odl"]'.url ${1})
CONTROLLER_IMAGE=$(jq -r '.["controller-odl"]'.image ${1})
CONTROLLER_VERSION=$(jq -r '.["controller-odl"]'.version ${1})
CONTROLLER_REPO=${CONTROLLER_URL}/${CONTROLLER_IMAGE}
CONTROLLER_DIR=${CONTROLLER_IMAGE}-${CONTROLLER_VERSION}
CONTROLLER_FILE=${CONTROLLER_IMAGE}-${CONTROLLER_VERSION}.tar.gz
CONTROLLER_PATH=$(pwd)/.controllers

# Download the SDN controller distribution
mkdir -p ${CONTROLLER_PATH}
if [ ! -e ${CONTROLLER_PATH}/${CONTROLLER_FILE} ]; then
    spinner_exec "Download the SDN controller: " \
        curl -L -o ${CONTROLLER_PATH}/${CONTROLLER_FILE} \
            ${CONTROLLER_REPO}/${CONTROLLER_VERSION}/${CONTROLLER_FILE}
    if [ $? -ne 0 ]; then
        return $?
    fi
fi

# Install the SDN controller distribution
rm -fr ${CONTROLLER_PATH}/${CONTROLLER_DIR}
spinner_exec "Extract the SDN controller: " \
    tar zxf ${CONTROLLER_PATH}/${CONTROLLER_FILE} -C ${CONTROLLER_PATH}
if [ $? -ne 0 ]; then
    return $?
fi

# Install SDN boot features
spinner_exec "Install default SDN features: " \
    sed -i 's/config,standard,region,package,kar,ssh,management/config,standard,region,package,kar,ssh,management,odl-netconf-connector-all,odl-restconf,odl-mdsal-apidocs,odl-dlux-all/g' \
    ${CONTROLLER_PATH}/${CONTROLLER_DIR}/etc/org.apache.karaf.features.cfg

