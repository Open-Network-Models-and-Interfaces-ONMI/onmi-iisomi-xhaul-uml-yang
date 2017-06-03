# CENTENNIAL

[![Join the chat at https://gitter.im/OpenNetworkingFoundation/CENTENNIAL](https://badges.gitter.im/OpenNetworkingFoundation/CENTENNIAL.svg)](https://gitter.im/OpenNetworkingFoundation/CENTENNIAL?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Microwave and Millimeterwave PoC Applications

The repository is under preparetion for the 4th PoC.  
OpenDaylight applications are prepared for Boron SR1.  
Models needs to be modified for ONF TR 532.  
[sko] 2017-03-15

## 04-OWTG-WTP-PoC
Repository for the 4th ONF wireless transport project (WTP) proof of concept (PoC). 

The PoC is sponsored and hosed by Deutsche Telekom and end of June 2017.

## Scope
The ONF Wireless Transport project group creates a Microwave/millimeterwave Transport Network extension to the [ONF Core Model 1.2 - ONF TR-512](https://www.opennetworking.org/images/stories/downloads/sdn-resources/technical-reports/TR-512_CIM_(CoreModel)_1.2.zip) and [ONF Microwave Model 1.0](https://www.opennetworking.org/images/stories/downloads/sdn-resources/technical-reports/TR-532-Microwave-Information-Model-V1.pdf).

Such extension shall be implemented by an open source SDN Controller and microwave/millimeterwave devices and/or mediators between SDN-Controller and network elements.

The PoC will support the improvements of ONF Technical Recommendations.

## Topics
Current topics for the 4th PoC are:
- ONF TR 532, CoreModel 1.2 (NetworkElement, LTP, LP)
- Ethernet Model 		based on CoreModel 1.2 (ForwardingDomain, FC, FC-Port, FC-Switch)
- Equipment Model 		based on CoreModel 1.2 (Equipment, Holder, Connector)
- Synchronization Model

The following topics are for future activities:
- Extensions of ONF TR 532 (bug-tracker: p2mp, uni-model, bug fixes, config der SDN Controller für Auto discovery)
- Support by TAPI
- Support by ONOS (CORD)

## Archive
Please checkout branch "onf-owtg-wtp-3rd-poc" for previous versions.

