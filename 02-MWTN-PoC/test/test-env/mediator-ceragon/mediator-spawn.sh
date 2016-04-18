#!/bin/bash
#
# mediator-spawn - Spawn Ceragon SDN mediators
#
# Copyright (C) 2016 HCL Technologies
#
# Author: Paolo Rovelli <paolo.rovelli@hcl.com>  
#

if [ $# -ne 1 ]; then
    echo "Usage: mediator-spawn <config.json>"
    exit 0
fi
. $(dirname $(readlink -f ${0}))/../utils/spinner-utils.sh

MEDIATOR_IDX=-1
MEDIATOR_NUM=$(jq -r '.topology | length' ${1})
MEDIATOR_USER=$(jq -r '.["mediator-ceragon"]'.user ${1})
MEDIATOR_IMAGE=$(jq -r '.["mediator-ceragon"]'.image ${1})
MEDIATOR_VERSION=

MEDIATOR_SRC=/mnt/mediator
MEDIATOR_DST=/home/compila/app/poc2-md/yang-modules
MEDIATOR_PATH=$(dirname $(readlink -f ${0}))
MEDIATOR_CFG=${MEDIATOR_DST}/mediatorConfig.txt

MODEL_SRC=/mnt/model
MODEL_DST=/usr/share/yuma/modules/ietf
MODEL_PATH=$(dirname $(readlink -f ${1}))/$(jq -r '.model.path' ${1})

while [ ${MEDIATOR_IDX} -lt ${MEDIATOR_NUM} ]; do

    MEDIATOR_IDX=$[${MEDIATOR_IDX}+1]
    MEDIATOR_TYPE=$(jq -r '.topology['${MEDIATOR_IDX}'].type' ${1})
    if [ "${MEDIATOR_TYPE}" != "mediator-ceragon" ]; then
        continue
    fi
    MEDIATOR_NAME=$(jq -r '.topology['${MEDIATOR_IDX}'].name' ${1})

    # Clean any previously defined MEDIATOR container
    docker rm -f ${MEDIATOR_NAME} > /dev/null 2>&1

    # Spin up the MEDIATOR container
    spinner_exec "Spawn '${MEDIATOR_NAME}': " \
        docker run --name ${MEDIATOR_NAME} \
           -v ${MODEL_PATH}:${MODEL_SRC} \
           -v ${MEDIATOR_PATH}:${MEDIATOR_SRC} \
           -dit ${MEDIATOR_IMAGE}${MEDIATOR_VERSION} \
           /bin/bash
    echo -n "Address '${MEDIATOR_NAME}': "
    docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${MEDIATOR_NAME}

    # Copy the MEDIATOR models and start-up datastores to the target
    for x in ${MODEL_PATH}/*.{yang,xml}; do
        docker exec ${MEDIATOR_NAME} cp \
            ${MODEL_SRC}/${x##*/} \
            ${MODEL_DST}/${x##*/}
    done

    # Create the MEDIATOR config file
    CONFIG_NAME=$(jq -r '.topology['${MEDIATOR_IDX}'].config.ne' ${1})
    CONFIG_EVENT=$(jq -r '.topology['${MEDIATOR_IDX}'].config.event' ${1})
    docker exec ${MEDIATOR_NAME} /bin/sh -c " \
        mkdir -p $(dirname ${MEDIATOR_CFG}) && touch ${MEDIATOR_CFG} && \
        echo 'NeName: ${CONFIG_NAME}' >> ${MEDIATOR_CFG} && \
        echo 'eventFrequency: ${CONFIG_EVENT}' >> ${MEDIATOR_CFG}"
    CONFIG_IDX=0
    CONFIG_NUM=$(jq -r '.topology['${MEDIATOR_IDX}'].config["ifaces"] | length' ${1})
    while [ ${CONFIG_IDX} -lt ${CONFIG_NUM} ]; do
        CONFIG_IFACE=$(jq -r '.topology['${MEDIATOR_IDX}'].config.ifaces['${CONFIG_IDX}'].iface' ${1})
        CONFIG_RADIO=$(jq -r '.topology['${MEDIATOR_IDX}'].config.ifaces['${CONFIG_IDX}'].radio' ${1})
        docker exec ${MEDIATOR_NAME} /bin/sh -c " \
            echo 'radioSignalId: ${CONFIG_IFACE} ${CONFIG_RADIO}' >> ${MEDIATOR_CFG}"
        CONFIG_IDX=$[${CONFIG_IDX}+1]
    done

    # Register the MEDIATOR main models and their imported modules
    echo "Import '${MEDIATOR_NAME}' mediator modules ... "
    MODEL_MODULES=""
    MODEL_MAIN=($(jq -r .model.list[].main ${1}))
    for i in ${!MODEL_MAIN[@]}; do
        spinner_exec " - install '${MODEL_MAIN[${i}]}': " :
        MODEL_MODULES="${MODEL_MODULES} --module=${MODEL_MAIN[${i}]}"
        MODEL_DEPS=($(jq -r .model.list[${i}].deps[] ${1}))
        for j in ${!MODEL_DEPS[@]}; do
            spinner_exec "    - import '${MODEL_DEPS[${j}]}': " :
        done
    done

    # Start the MEDIATOR
    spinner_exec "Start '${MEDIATOR_NAME}' netconf server: " :
    docker exec ${MEDIATOR_NAME} /usr/sbin/netconfd \
        --no-startup \
        --log=/root/netconf.log \
        --log-level=debug \
        --superuser=${MEDIATOR_USER} \
        ${MODEL_MODULES} &
    docker exec ${MEDIATOR_NAME} sleep 1
    docker exec ${MEDIATOR_NAME} /usr/sbin/sshd
    echo ""

done

