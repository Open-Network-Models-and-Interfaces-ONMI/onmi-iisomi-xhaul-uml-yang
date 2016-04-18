#!/bin/bash
#
# mediator-mount - Mount HCL SDN mediators
#
# Copyright (C) 2016 HCL Technologies
#
# Author: Paolo Rovelli <paolo.rovelli@hcl.com>
#

if [ $# -ne 1 ]; then
    echo "Usage: mediator-mount <config.json>"
    exit 0
fi
. $(dirname $(readlink -f ${0}))/../utils/spinner-utils.sh
. $(dirname $(readlink -f ${0}))/../utils/mount-utils.sh

MEDIATOR_IDX=-1
MEDIATOR_NUM=$(jq -r '.topology | length' ${1})
MEDIATOR_PORT=$(jq -r '.["mediator-hcl"]'.port ${1})
MEDIATOR_USER=$(jq -r '.["mediator-hcl"]'.user ${1})
MEDIATOR_PASSWD=$(jq -r '.["mediator-hcl"]'.passwd ${1})

CONTROLLER_IP=$(jq -r '.["controller-odl"]'.ip ${1})
CONTROLLER_PORT=$(jq -r '.["controller-odl"]'.port ${1})
CONTROLLER_USER=$(jq -r '.["controller-odl"]'.user ${1})
CONTROLLER_PASSWD=$(jq -r '.["controller-odl"]'.passwd ${1})

while [ ${MEDIATOR_IDX} -lt ${MEDIATOR_NUM} ]; do

    MEDIATOR_IDX=$[${MEDIATOR_IDX}+1]
    MEDIATOR_TYPE=$(jq -r '.topology['${MEDIATOR_IDX}'].type' ${1})
    if [ "${MEDIATOR_TYPE}" != "mediator-hcl" ]; then
        continue
    fi
    MEDIATOR_NAME=$(jq -r '.topology['${MEDIATOR_IDX}'].name' ${1})
    MEDIATOR_IP=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${MEDIATOR_NAME})

    # Mount the specified MEDIATOR on ODL
    spinner_exec "Mount '${MEDIATOR_NAME}' '${MEDIATOR_IP}': " \
        mount_module ${MEDIATOR_NAME} \
            ${MEDIATOR_IP} ${MEDIATOR_PORT} \
            ${MEDIATOR_USER} ${MEDIATOR_PASSWD} \
            ${CONTROLLER_IP} ${CONTROLLER_PORT} \
            ${CONTROLLER_USER} ${CONTROLLER_PASSWD}

done

