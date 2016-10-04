#!/bin/bash
#
# subscribe-utils - subscribe SDN modules
#
# Copyright (C) 2016 HCL Technologies
#
# Author: Paolo Rovelli <paolo.rovelli@hcl.com>
#

function subscribe_module {
    until $(curl --output /dev/null --silent --fail curl -H "Content-Type: application/xml" -u ${4}:${5} -X POST -d "<input>
    </input>" http://${2}:${3}/restconf/operations/network-topology:network-topology/topology/topology-netconf/node/${1}/yang-ext:mount/notifications:create-subscription); do
        sleep 5
    done
}

