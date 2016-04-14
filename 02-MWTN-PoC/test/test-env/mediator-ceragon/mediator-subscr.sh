#!/bin/bash
#
# mediator-subscr - Subscribe CERAGON-MEDIATORS for notifications
#
# Copyright (C) 2016 HCL Technologies
#
# Author: Paolo Rovelli <paolo.rovelli@hcl.com>
#

if [ $# -ne 1 ]
then
    echo "Usage: mediator-subscr <config.json>"
    exit 0
fi

MEDIATOR_IDX=-1
MEDIATOR_NUM=$(jq -r '.topology | length' ${1})
CONTROLLER_IP=$(jq -r '.controller.ip' ${1})
CONTROLLER_PORT=$(jq -r '.controller.port' ${1})
CONTROLLER_USER=$(jq -r '.controller.user' ${1})
CONTROLLER_PASSWD=$(jq -r '.controller.passwd' ${1})

while [ ${MEDIATOR_IDX} -lt ${MEDIATOR_NUM} ]; do

    MEDIATOR_IDX=$[${MEDIATOR_IDX}+1]
    MEDIATOR_TYPE=$(jq -r '.topology['${MEDIATOR_IDX}'].type' ${1})
    if [ "${MEDIATOR_TYPE}" != "mediator-ceragon" ]; then
        continue
    fi
    MEDIATOR_NAME=$(jq -r '.topology['${MEDIATOR_IDX}'].name' ${1})

    # Mount the specified MEDIATOR on ODL
    echo -n "Subscribe '${MEDIATOR_NAME}' notifications on the SDN controller ..."
    until $(curl --output /dev/null --silent --fail curl -H "Content-Type: application/xml" -u ${CONTROLLER_USER}:${CONTROLLER_PASSWD} -X POST -d "<input>
    </input>" http://${CONTROLLER_IP}:${CONTROLLER_PORT}/restconf/operations/network-topology:network-topology/topology/topology-netconf/node/${MEDIATOR_NAME}/yang-ext:mount/notifications:create-subscription); do
        echo -n "."
        sleep 5
    done
    echo " ok."
    echo ""

done

