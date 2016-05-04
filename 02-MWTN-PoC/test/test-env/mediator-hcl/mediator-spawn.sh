#!/bin/bash
#
# mediator-spawn - Spawn HCL SDN mediators
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
MEDIATOR_IMAGE=$(jq -r '.["mediator-hcl"]'.image ${1})
MEDIATOR_VERSION=$(jq -r '.["mediator-hcl"]'.version ${1})

MEDIATOR_SRC=/mnt/mediator
MEDIATOR_DST=/usr/local/etc/netopeer/cfgnetopeer
MEDIATOR_CFG=${MEDIATOR_DST}/MicrowaveModel-ObjectClasses-MwConnection.xml
MEDIATOR_PATH=$(dirname $(readlink -f ${0}))

MODEL_SRC=/mnt/model
MODEL_DST=/usr/local/etc/netopeer/cfgnetopeer
MODEL_PATH=$(dirname $(readlink -f ${1}))/$(jq -r '.model.path' ${1})

while [ ${MEDIATOR_IDX} -lt ${MEDIATOR_NUM} ]; do

    MEDIATOR_IDX=$[${MEDIATOR_IDX}+1]
    MEDIATOR_TYPE=$(jq -r '.topology['${MEDIATOR_IDX}'].type' ${1})
    if [ "${MEDIATOR_TYPE}" != "mediator-hcl" ]; then
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

    # Copy the MEDIATOR models to the target
    for x in ${MODEL_PATH}/*.yang; do
        docker exec ${MEDIATOR_NAME} cp \
            ${MODEL_SRC}/${x##*/} \
            ${MODEL_DST}/${x##*/}
    done

    # Translate the MEDIATOR models to YIN format
    MODEL_MAIN=$(jq -r .model.list[].main ${1})
    MODEL_DEPS=$(jq -r .model.list[].deps[] ${1})
    MODEL_DEPS=$(awk 'BEGIN{RS=ORS=" "}!a[$0]++' <<< ${MODEL_DEPS})
    for x in ${MODEL_MAIN} ${MODEL_DEPS}; do
        docker exec ${MEDIATOR_NAME} pyang \
            -f yin \
            -p ${MODEL_DST} \
            -o ${MODEL_DST}/${x}.yin \
            ${MODEL_DST}/${x}.yang
    done

    # Create the MEDIATOR start-up datastores
    docker exec ${MEDIATOR_NAME} /bin/sh -c " \
        mkdir -p $(dirname ${MEDIATOR_CFG}) && touch ${MEDIATOR_CFG}"
    docker exec ${MEDIATOR_NAME} /bin/sh -c " \
        echo '<?xml version=\"1.0\" encoding=\"UTF-8\"?>
          <datastores xmlns=\"urn:cesnet:tmc:datastores:file\">
            <running lock=\"\" locktime=\"\"/>
            <startup lock=\"\" locktime=\"\">
        ' >> ${MEDIATOR_CFG}"
    CONFIG_IDX=0
    CONFIG_NUM=$(jq -r '.topology['${MEDIATOR_IDX}'].config["ifaces"] | length' ${1})
    while [ ${CONFIG_IDX} -lt ${CONFIG_NUM} ]; do
        CONFIG_IFACE=$(jq -r '.topology['${MEDIATOR_IDX}'].config.ifaces['${CONFIG_IDX}'].iface' ${1})
        CONFIG_RADIO=$(jq -r '.topology['${MEDIATOR_IDX}'].config.ifaces['${CONFIG_IDX}'].radio' ${1})
        docker exec ${MEDIATOR_NAME} /bin/sh -c " \
            echo '
              <MW_AirInterface_Pac xmlns=\"uri:onf:MicrowaveModel-ObjectClasses-MwConnection\">
                <layerProtocol>${CONFIG_IFACE}</layerProtocol>
                <airInterfaceConfiguration>
                  <airInterfaceName>${CONFIG_IFACE}</airInterfaceName>
                  <radioSignalId>${CONFIG_RADIO}</radioSignalId>
                  <txFrequency>32000000</txFrequency>
                  <rxFrequency>30000000</rxFrequency>
                  <txChannelBandwidth>56000</txChannelBandwidth>
                  <rxChannelBandwidth>56000</rxChannelBandwidth>
                  <powerIsOn>true</powerIsOn>
                  <transmitterIsOn>true</transmitterIsOn>
                  <txPower>20</txPower>
                  <adaptiveModulationIsOn>true</adaptiveModulationIsOn>
                  <modulationMin>4</modulationMin>
                  <modulationMax>512</modulationMax>
                  <xpicIsOn>false</xpicIsOn>
                </airInterfaceConfiguration>
              </MW_AirInterface_Pac>
            ' >> ${MEDIATOR_CFG}"
        CONFIG_IDX=$[${CONFIG_IDX}+1]
    done
    docker exec ${MEDIATOR_NAME} /bin/sh -c " \
        echo '
            </startup>
            <candidate modified=\"false\" lock=\"\" locktime=\"\"/>
          </datastores>
        ' >> ${MEDIATOR_CFG}"

    # Register the MEDIATOR main models and their imported modules
    echo "Install '${MEDIATOR_NAME}' mediator models ... "
    MODEL_MAIN=($(jq -r .model.list[].main ${1}))
    for i in ${!MODEL_MAIN[@]}; do 
        spinner_exec " - install '${MODEL_MAIN[${i}]}': " \
        docker exec ${MEDIATOR_NAME} netopeer-manager add \
            --name ${MODEL_MAIN[${i}]} \
            --model ${MODEL_DST}/${MODEL_MAIN[${i}]}.yin \
            --datastore ${MODEL_DST}/${MODEL_MAIN[${i}]}.xml
        MODEL_DEPS=($(jq -r .model.list[${i}].deps[] ${1}))
        for j in ${!MODEL_DEPS[@]}; do 
            spinner_exec "    - import '${MODEL_DEPS[${j}]}': " \
            docker exec ${MEDIATOR_NAME} netopeer-manager add \
                --name ${MODEL_MAIN[${i}]} \
                --import ${MODEL_DST}/${MODEL_DEPS[${j}]}.yin
        done
    done

    # Start the MEDIATOR
    spinner_exec "Start '${MEDIATOR_NAME}' netconf server: " :
    docker exec ${MEDIATOR_NAME} netopeer-server -d
    echo ""

done

