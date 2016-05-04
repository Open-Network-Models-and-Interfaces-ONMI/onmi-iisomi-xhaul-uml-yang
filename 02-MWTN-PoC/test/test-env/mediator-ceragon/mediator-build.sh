#!/bin/bash
#
# mediator-build - Build Ceragon SDN mediator
#
# Copyright (C) 2016 HCL Technologies
#
# Author: Paolo Rovelli <paolo.rovelli@hcl.com>  
#

if [ $# -ne 1 ]; then
    echo "Usage: mediator-build <config.json>"
    exit 0
fi
. $(dirname $(readlink -f ${0}))/../utils/spinner-utils.sh

MEDIATOR_PATH=$(dirname $(readlink -f ${0}))
MEDIATOR_IMAGE=$(jq -r .'["mediator-ceragon"]'.image ${1})

# Build the SDN mediator image
spinner_exec "Build the SDN mediator: " \
    docker build -t ${MEDIATOR_IMAGE} ${MEDIATOR_PATH}

