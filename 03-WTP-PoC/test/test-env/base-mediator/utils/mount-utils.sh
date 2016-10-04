#!/bin/bash
#
# mount-utils - Mount SDN modules
#
# Copyright (C) 2016 HCL Technologies
#
# Author: Paolo Rovelli <paolo.rovelli@hcl.com>
#

function mount_module {
    until $(curl --output /dev/null --silent --fail curl -H "Content-Type: application/xml" -u ${8}:${9} -X PUT -d "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
      <module xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:config\">
        <type xmlns:prefix=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">prefix:sal-netconf-connector</type>
        <name>${1}</name>
        <address xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">${2}</address>
        <port xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">${3}</port>
        <username xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">${4}</username>
        <password xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">${5}</password>
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
      </module>" http://${6}:${7}/restconf/config/network-topology:network-topology/topology/topology-netconf/node/controller-config/yang-ext:mount/config:modules/module/odl-sal-netconf-connector-cfg:sal-netconf-connector/${1}); do
        sleep 5
    done
}

