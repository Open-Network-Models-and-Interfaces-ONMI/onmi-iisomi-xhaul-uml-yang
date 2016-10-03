#!/bin/bash
#
# controller-build - Build the Wipro SDN controller
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

CONTROLLER_URL=$(jq -r '.["controller-wipro"]'.url ${1})
CONTROLLER_IMAGE=$(jq -r '.["controller-wipro"]'.image ${1})
CONTROLLER_VERSION=$(jq -r '.["controller-wipro"]'.version ${1})
CONTROLLER_REPO=${CONTROLLER_URL}
CONTROLLER_DIR=${CONTROLLER_IMAGE}-${CONTROLLER_VERSION}
CONTROLLER_FILE=${CONTROLLER_IMAGE}-${CONTROLLER_VERSION}.tar.gz
CONTROLLER_PATH=$(pwd)/.controllers

# Download the SDN controller distribution
mkdir -p ${CONTROLLER_PATH}
if [ ! -e ${CONTROLLER_PATH}/${CONTROLLER_FILE} ]; then
    spinner_exec "Download the SDN controller: " \
        curl -L -o ${CONTROLLER_PATH}/${CONTROLLER_FILE} \
            ${CONTROLLER_REPO}/tarball/${CONTROLLER_VERSION}
    if [ $? -ne 0 ]; then
        return $?
    fi
fi

# Extract the SDN controller distribution
rm -fr ${CONTROLLER_PATH}/${CONTROLLER_DIR}
mkdir -p ${CONTROLLER_PATH}/${CONTROLLER_DIR}
spinner_exec "Extract the SDN controller: " \
    tar zxf ${CONTROLLER_PATH}/${CONTROLLER_FILE} \
        -C ${CONTROLLER_PATH}/${CONTROLLER_DIR} \
        --strip-components=1
if [ $? -ne 0 ]; then
    return $?
fi

# Fix the SDN controller build settings
mkdir -p ~/.m2
cp -n ~/.m2/settings.xml{,.orig}
curl -L -s -o ~/.m2/settings.xml \
    https://raw.githubusercontent.com/opendaylight/odlparent/master/settings.xml
if [ $? -ne 0 ]; then
    mv ~/.m2/settings.xml{.orig,}
fi

# Build the SDN controller distribution
cd ${CONTROLLER_PATH}/${CONTROLLER_DIR}/02-MWTN-PoC/code/odl/ > /dev/null
spinner_exec "Build the SDN controller: " \
    mvn clean install -DskipTests=true
cd - > /dev/null

# Install SDN boot features
spinner_exec "Install default SDN features: " \
    sed -i 's/config,standard,region,package,kar,ssh,management/config,standard,region,package,kar,ssh,management,odl-dlux-all/g' \
        ${CONTROLLER_PATH}/${CONTROLLER_DIR}/02-MWTN-PoC/code/odl/karaf/target/assembly/etc/org.apache.karaf.features.cfg

# Install UX SDN applications
spinner_exec "Install delivered SDN applications: " \
    cp ${CONTROLLER_PATH}/${CONTROLLER_DIR}/02-MWTN-PoC/code/ux/deploy/*.jar \
       ${CONTROLLER_PATH}/${CONTROLLER_DIR}/02-MWTN-PoC/code/odl/karaf/target/assembly/deploy

