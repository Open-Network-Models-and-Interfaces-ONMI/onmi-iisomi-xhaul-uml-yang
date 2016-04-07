#!/bin/bash
#
# mediator-spawn - Spawn CERAGON-MEDIATORS
#
# Copyright (C) 2016 HCL Technologies
#
# Author: Paolo Rovelli <paolo.rovelli@hcl.com>  
#

if [ $# -ne 1 ]
then
    echo "Usage: mediator-spawn <config.json>"
    exit 0
fi

MEDIATOR_IDX=-1
MEDIATOR_NUM=$(jq -r '.topology | length' ${1})
MEDIATOR_IMAGE=$(jq -r '.["mediator-ceragon"]'.image ${1})
MEDIATOR_VERSION=
MEDIATOR_SHM=/opt/shm
MEDIATOR_CFG=/usr/share/yuma/modules/ietf
MEDIATOR_STR=/root/netopeer/server/config/datastore.xml
MEDIATOR_PATH=$(dirname $(readlink -f ${0}))

while [ ${MEDIATOR_IDX} -lt ${MEDIATOR_NUM} ]; do

    MEDIATOR_IDX=$[${MEDIATOR_IDX}+1]
    MEDIATOR_TYPE=$(jq -r '.topology['${MEDIATOR_IDX}'].type' ${1})
    if [ "${MEDIATOR_TYPE}" != "mediator-ceragon" ]; then
        continue
    fi
    MEDIATOR_NAME=$(jq -r '.topology['${MEDIATOR_IDX}'].name' ${1})
    MEDIATOR_MODEL=$(jq -r '.model.path' ${1})
    MODEL_PATH=$(dirname $(readlink -f ${1}))/${MEDIATOR_MODEL}

    # Clean any previously defined MEDIATOR container
    docker rm -f ${MEDIATOR_NAME} > /dev/null 2>&1

    # Spin up the MEDIATOR container
    echo -n "Spawn '${MEDIATOR_NAME}' ... "
    docker run --name ${MEDIATOR_NAME} \
        -v ${MODEL_PATH}:${MEDIATOR_SHM} \
        -dit ${MEDIATOR_IMAGE}${MEDIATOR_VERSION} \
        /bin/bash > /dev/null 2>&1
    docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${MEDIATOR_NAME}

    # copy 
    docker exec ${MEDIATOR_NAME} mkdir -p /home/compila/app/poc2-md/yang-modules/ > /dev/null 2>&1
    docker exec ${MEDIATOR_NAME} cp -f /root/yang-modules/mediatorConfig.txt /home/compila/app/poc2-md/yang-modules/ > /dev/null 2>&1

    for x in ${MODEL_PATH}/*.{yang,xml}
    do
        docker exec ${MEDIATOR_NAME} cp \
            ${MEDIATOR_SHM}/${x##*/} \
            ${MEDIATOR_CFG}/${x##*/}
    done

    # Start the MEDIATOR
    echo -n "Start '${MEDIATOR_NAME}' NETCONF server ..."
    docker exec ${MEDIATOR_NAME} /root/start.sh &
    echo " ok."
    echo ""

done

