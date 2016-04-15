#!/bin/bash
#
# mediator-mount - Mount CERAGON-MEDIATORS
#
# Copyright (C) 2016 HCL Technologies
#
# Author: Paolo Rovelli <paolo.rovelli@hcl.com>
#

if [ $# -ne 1 ]
then
    echo "Usage: mediator-mount <config.json>"
    exit 0
fi

MEDIATOR_IDX=-1
MEDIATOR_NUM=$(jq -r '.topology | length' ${1})
MEDIATOR_PORT=$(jq -r '.["mediator-ceragon"]'.port ${1})
MEDIATOR_USER=$(jq -r '.["mediator-ceragon"]'.user ${1})
MEDIATOR_PASSWD=$(jq -r '.["mediator-ceragon"]'.passwd ${1})

CONTROLLER_IP=$(jq -r '.["controller-odl"]'.ip ${1})
CONTROLLER_PORT=$(jq -r '.["controller-odl"]'.port ${1})
CONTROLLER_USER=$(jq -r '.["controller-odl"]'.user ${1})
CONTROLLER_PASSWD=$(jq -r '.["controller-odl"]'.passwd ${1})

while [ ${MEDIATOR_IDX} -lt ${MEDIATOR_NUM} ]; do

    MEDIATOR_IDX=$[${MEDIATOR_IDX}+1]
    MEDIATOR_TYPE=$(jq -r '.topology['${MEDIATOR_IDX}'].type' ${1})
    if [ "${MEDIATOR_TYPE}" != "mediator-ceragon" ]; then
        continue
    fi
    MEDIATOR_NAME=$(jq -r '.topology['${MEDIATOR_IDX}'].name' ${1})
    MEDIATOR_IP=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${MEDIATOR_NAME})
    # MEDIATOR_IP=$(jq -r '.topology['${MEDIATOR_IDX}'].ip' ${1})

    # Mount the specified MEDIATOR on ODL
    echo -n "Mount '${MEDIATOR_NAME}' '${MEDIATOR_IP}' on the SDN controller ..."
    until $(curl --output /dev/null --silent --fail curl -H "Content-Type: application/xml" -u ${CONTROLLER_USER}:${CONTROLLER_PASSWD} -X PUT -d "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
      <module xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:config\">
        <type xmlns:prefix=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">prefix:sal-netconf-connector</type>
        <name>${MEDIATOR_NAME}</name>
        <address xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">${MEDIATOR_IP}</address>
        <port xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">${MEDIATOR_PORT}</port>
        <username xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">${MEDIATOR_USER}</username>
        <password xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">${MEDIATOR_PASSWD}</password>
        <tcp-only xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">false</tcp-only>
        <event-executor xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">
          <type xmlns:prefix=\"urn:opendaylight:params:xml:ns:yang:controller:netty\">prefix:netty-event-executor</type>
          <name>global-event-executor</name>
        </event-executor>
        <binding-registry xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">
          <type xmlns:prefix=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:binding\">prefix:binding-broker-osgi-registry</type>
          <name>binding-osgi-broker</name>
        </binding-registry>
        <dom-registry xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">
          <type xmlns:prefix=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:dom\">prefix:dom-broker-osgi-registry</type>
          <name>dom-broker</name>
        </dom-registry>
        <client-dispatcher xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">
          <type xmlns:prefix=\"urn:opendaylight:params:xml:ns:yang:controller:config:netconf\">prefix:netconf-client-dispatcher</type>
          <name>global-netconf-dispatcher</name>
        </client-dispatcher>
        <processing-executor xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">
          <type xmlns:prefix=\"urn:opendaylight:params:xml:ns:yang:controller:threadpool\">prefix:threadpool</type>
          <name>global-netconf-processing-executor</name>
        </processing-executor>
        <keepalive-executor xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">
          <type xmlns:prefix=\"urn:opendaylight:params:xml:ns:yang:controller:threadpool\">prefix:scheduled-threadpool</type>
          <name>global-netconf-ssh-scheduled-executor</name>
        </keepalive-executor>
      </module>" http://${CONTROLLER_IP}:${CONTROLLER_PORT}/restconf/config/network-topology:network-topology/topology/topology-netconf/node/controller-config/yang-ext:mount/config:modules/module/odl-sal-netconf-connector-cfg:sal-netconf-connector/${MEDIATOR_NAME}); do
        echo -n "."
        sleep 5
    done
    echo " ok."
    echo ""

done

