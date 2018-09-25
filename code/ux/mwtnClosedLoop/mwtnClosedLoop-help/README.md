# Closed Loop Automation

The Closed Loop Automation (CLA) is a pattern, defined by “ECOMP (Enhanced Control, Orchestration, Management & Policy) Architecture White Paper”, which provides the necessary automation for proactive response to network and service conditions without human intervention. A high-level schematic of the “Closed-loop automation” and the various phases within the service lifecycle using the automation is depicted in the following picture:

![Service Lifecycle](./service-lifecycle.png "Service Lifecycle")

The network application can work automatically and independently with NetConf devices without human intervention, over point to point wireless networks. It automatically reads and writes information from/to NetConf devices. Additionally, when something is changed on the device by another person or by another process, this is noted and processed.

## Implementation

The app reads and changes the AirInterfaceName of package MicrowaveModel-ObjectClasses-AirInterface. We simply change a name according to actually timestamp. 
This action will be executed when three different events occurs:

-	External application

In the PoC the external trigger is represented by an “Execute Now” button on the DLUX GUI.

-	Timer

The timer can be switched “on” and “off” and in addition the time frequency for automatic execution can be configured by the user. The default time frequency is 5 seconds. These settings are stored in the persistently in ODL’s config datastore. 

-	Notification from SDN Controller or the network elements

The application subscribes for notification from ODL. Such notification can be notification form ODL itself or forwarded notification form the network. The application listens to ODL topology changes. Each time, when a new NetConf server with the capability “MicrowaveModel-ObjectClasses-AirInterface” is mounted, then the closed loop automation function is executed. 
