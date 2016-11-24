#!/bin/bash
#
# yang2yin.sh - Converts yang file to yin files with pyang
#
# Copyright (C) 2016 highstreet technologies GmbH and others
#
# Author: Paolo Rovelli <paolo.rovelli@hcl.com>  
# Author: Martin Skorupski <martin.skorupski@highstreet-technologies.com>  
#

if [ $# -gt 2 ]; then
    echo "Usage: yang2yin.sh <src-path> <dst-path>"
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

MODELS=($(grep -rl revision ${SRC}/*.yang | awk '{print $1}'))
if [ ${#MODELS[@]} -gt 0 ]; then
    mkdir -p ${DST}
fi

for x in ${!MODELS[@]}; do
    y=${MODELS[$x]##*/}
    z=${y%%.*}
    echo "converting '${z}' to yin"
    pyang -p ${SRC} -f yin -o ${DST}/${z}.yin ${SRC}/${z}.yang
done

