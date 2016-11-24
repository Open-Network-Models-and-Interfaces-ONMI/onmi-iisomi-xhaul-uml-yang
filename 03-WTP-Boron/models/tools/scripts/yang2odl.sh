#!/bin/bash
#
# yang2odl.sh - Create a new YANG model suitable for OpenDaylight.
#               Actually it appends the model revision to the model filename.
#
# Copyright (C) 2016 HCL Technologies
#
# Author: Paolo Rovelli <paolo.rovelli@hcl.com>  
#

if [ $# -gt 2 ]; then
    echo "Usage: yang2odl.sh <src-path> <dst-path>"
    exit 0
fi

SRC=.
if [ $# -gt 0 ]; then
   SRC=${1}
fi
DST=${SRC}
if [ $# -gt 1 ]; then
    DST=${2}
fi

MODELS=($(grep -rl --exclude=${SRC}/*@*.yang revision ${SRC}/*.yang | awk '{print $1}'))
REVISIONS=($(grep -rh --exclude=${SRC}/*@*.yang "revision 2" ${SRC}/*.yang | awk '{print $2}'))
if [ ${#MODELS[@]} -gt 0 ]; then
    mkdir -p ${DST}
fi

for x in ${!MODELS[@]}; do
    y=${MODELS[$x]##*/}
    z=${y%%.*}
    echo "converting '${z}'"
    cp -f ${SRC}/${z}.yang ${DST}/${z}@${REVISIONS[$x]}.yang
done

