#!/bin/bash
#
# yang2otherFormats.sh 
#    Convert Yang files of folder './yang' to 
#    - yin by using pyang
#    - odl-yang by using yang2odl.sh (thanks Paolo)
#    - odl-yin by using odl-yang and pyang.
#
# Copyright (C) 2016 highstreet technologies GmbH and others
#
# Author: Martin Skorupski <martin.skorupski@highstreet-technologies.com>  
#

DIR_YANG=./yang
DIR_YIN=./yin
DIR_YANG_ODL=./yang-odl
DIR_YIN_ODL=./yin-odl

echo "Converting YANG to YIN"
./yang2yin.sh ${DIR_YANG} ${DIR_YIN}
echo ""

echo "Converting YANG to YANG-ODL"
./yang2odl.sh ${DIR_YANG} ${DIR_YANG_ODL}
echo ""

echo "Converting YANG-ODL to YIN-ODL"
./yang2yin.sh ${DIR_YANG_ODL} ${DIR_YIN_ODL}
echo ""
