# Reduced Core Model and Prio1 Microwave Model and very simple ETH Model
The current model is an improved version of "https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/02-MWTN-PoC/models/20-reducedCoreModel-MWTN-Prio1". However it also includes a very simplified ETH Model version, which opens the opportunity to avoide OpenFlow in the PoC, without loosing to much functionnality. 

## Status 
Date: 2016-03-20

- YANG files are valid according to pyang 1.6.
- YANG files are valid according to OpenDaylight yang-validation-tool-0.7.3-Lithium-SR3nerList'

## Changes compared to 20-reducedCoreModel-MWTN-Prio1
- CoreModel-CoreNetworkModule-ObjectClasses.yang modified
-- YANG statement 'units' added
-- The following types were unknown 'byte', 'short' and are now mapped to 'int64' or 'uint64'.
-- Attribute '_connectedLtpRef' offers dynamic cross connecting between LTPs (ETH-CTPs) to repleace the OpenFlow Forwarding Tables. Later this concept must be changed to the ONF Forwarding Contruct (FC). The original function of this attribute is not needed in the 2. ONF MWTN PoC.

- MicrowaveModel-Notifications.yang
-- Notification 'ProblemNotification' added. Please note that only this notification should be implemented for the 2. ONF MWTN PoC.

- MicrowaveModel-TypeDefinitions.yang
-- Typedef 'severityType' added to complement the ProblemNotification.

- MicrowaveModel-ObjectClasses-MwConnection.yang modified
-- YANG statement 'units' added
-- The following types were unknown 'byte', 'short' and are now mapped to 'int64' or 'uint64'.
-- airInterfaceCurrentProblemList::problemList added to complement the 'ProblemNotification'.

- MicrowaveModel-ObjectClasses-Ethernet.yang added
-- allows addressing of ETH-CTPs
-- offers configuration of one vlanId, ETH nighbors (lldpAlternative) and the currentClientCapacity.

