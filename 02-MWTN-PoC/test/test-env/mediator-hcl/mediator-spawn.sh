#!/bin/bash
#
# mediator-spawn - Spawn HCL-MEDIATORS
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
MEDIATOR_IMAGE=$(jq -r '.["mediator-hcl"]'.image ${1})
MEDIATOR_VERSION=$(jq -r '.["mediator-hcl"]'.version ${1})
MEDIATOR_SHM=/opt/shm
MEDIATOR_CFG=/usr/local/etc/netopeer/cfgnetopeer
MEDIATOR_PATH=$(dirname $(readlink -f ${0}))

while [ ${MEDIATOR_IDX} -lt ${MEDIATOR_NUM} ]; do

    MEDIATOR_IDX=$[${MEDIATOR_IDX}+1]
    MEDIATOR_TYPE=$(jq -r '.topology['${MEDIATOR_IDX}'].type' ${1})
    if [ "${MEDIATOR_TYPE}" != "mediator-hcl" ]; then
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

    # Copy the MEDIATOR models and datastores to the target
    for x in ${MODEL_PATH}/*.{yang,xml}
    do
        docker exec ${MEDIATOR_NAME} cp \
            ${MEDIATOR_SHM}/${x##*/} \
            ${MEDIATOR_CFG}/${x##*/}
    done

    # Translate the MEDIATOR models to YIN format
    for x in $(<${MODEL_PATH}/modules)
    do
        docker exec ${MEDIATOR_NAME} pyang \
            -f yin \
            -p ${MEDIATOR_CFG} \
            -o ${MEDIATOR_CFG}/${x}.yin \
            ${MEDIATOR_CFG}/${x}.yang
    done

    # Register the MEDIATOR main models and their imported modules
    for x in $(<${MODEL_PATH}/models)
    do
        echo " - install '${x}'"
        docker exec ${MEDIATOR_NAME} netopeer-manager add \
            --name ${x} \
            --model ${MEDIATOR_CFG}/${x}.yin \
            --datastore ${MEDIATOR_CFG}/${x}.xml
        for y in $(<${MODEL_PATH}/imports)
        do
            echo "    - import '${y}'"
            docker exec ${MEDIATOR_NAME} netopeer-manager add \
                --name ${x} \
                --import ${MEDIATOR_CFG}/${y}.yin
        done
    done

    # Start the MEDIATOR
    echo -n "Start '${MEDIATOR_NAME}' NETCONF server ..."
    docker exec ${MEDIATOR_NAME} netopeer-server -d
    echo " ok."
    echo ""

done

