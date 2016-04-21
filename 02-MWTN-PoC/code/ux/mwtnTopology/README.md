2nd ONF MWTN PoC
================

Detection of aberrances
-----------------------
 
Application for use case 4.2 according to the [use case document](https://share.o2.com/sites/as_de/Shared%20Documents/Projekte/2nd%20ONF%20MW%20PoC/Documents/Use%20Cases/onf2016.011_2nd_PoC_Use_Cases.03.docx).

The application shall be capable of comparing the actual network configuration with external reference data. The controller shall inform about aberrances and offer correction.

The [OpenDaylight DLUX](https://wiki.opendaylight.org/view/OpenDaylight_dlux:Main) acts on client events and OpenDayligth events emitted via WebSockets. 

## Build

    mvn clean install

## Deploy

Copy the ./mwtnCompare-bundle/target/mwtnCompare-bundle-1.0-SNAPSHOT.jar into the OpenDaylight karaf deploy directory.