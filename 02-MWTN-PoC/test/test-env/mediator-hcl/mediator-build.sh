#!/bin/bash
#
# mediator-build - Build HCL-MEDIATOR
#
# Copyright (C) 2016 HCL Technologies
#
# Author: Paolo Rovelli <paolo.rovelli@hcl.com>  
#

if [ $# -ne 1 ]
then
    echo "Usage: mediator-build <config.json>"
    exit 0
fi

MEDIATOR_PATH=$(dirname $(readlink -f ${0}))
MEDIATOR_IMAGE=$(jq -r .'["mediator-hcl"]'.image ${1})

# Build the MEDIATOR image
echo -n "Build the MEDIATOR ..."
docker build -t ${MEDIATOR_IMAGE} ${MEDIATOR_PATH} > /dev/null 2>&1
if [ -n $(docker images -q ${MEDIATOR_IMAGE}) ]; then
    echo " ok."
else
    echo " fail."
fi

