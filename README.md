# CENTENNIAL
[sko, 2018-01-01: entire section needs to be updated, according to decisions by ONF WTP]

Microwave and Millimeterwave PoC Applications

The repository is under preparetion for the 5th PoC.  
OpenDaylight applications are prepared for Nitrogen SR1.  
Models needs to be modified for ONF TR 512 v1.3 (CoreModel) and ONF TR 532.  

## 04-OWTG-WTP-PoC
Repository for the 5th ONF wireless transport project (WTP) proof of concept (PoC). 

The PoC is sponsored and hosed by <to be defined> and end of June 2018 <to be verified>.

## Scope
The ONF Wireless Transport project group creates a Microwave/millimeterwave Transport Network extension to the [ONF Core Model 1.3 - ONF TR-512](https://www.dropbox.com/sh/zns6hihpk2du7k4/AABAYA8ON1edlSAJ8jLBzoZEa/TR%20512%20v1.3/TR-512_v1._3_Publish.zip) and [ONF Microwave Model 1.0](https://www.opennetworking.org/images/stories/downloads/sdn-resources/technical-reports/TR-532-Microwave-Information-Model-V1.pdf).

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

