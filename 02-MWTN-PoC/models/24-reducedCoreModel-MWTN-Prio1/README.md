# Reduced Core Model and Prio1 Microwave Model
Removal of ETH model

## Status 
Date: 2016-03-27

- YANG files are valid according to pyang 1.6.
- YANG files are valid according to OpenDaylight yang-validation-tool-0.7.3-Lithium-SR3'

## Changes compared to 22-reducedCoreModel-ETH-joins-MWTN-Prio1
CoreModel-CoreNetworkModule-ObjectClasses.yang modified
- Attribute '_connectedLtpRef' removed

MicrowaveModel-ObjectClasses-Ethernet.yang removed

## Scipts
yang2odl.sh
- a script which adds the revision to the yang file name of a source directory and stores the result in destination directory.

yang2yin.sh
- a script which converts a yang files for a source directory to yin file and stores the result in destination directory.

yang2otherFormats.sh
- a script combining the scripts above to convert from yang files: yin-files, yang-odl-files and yin-odl-files. This script assumes the directory structure of this git repository.
