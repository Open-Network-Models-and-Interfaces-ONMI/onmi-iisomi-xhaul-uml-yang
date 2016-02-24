# Reduced Core Model  
For the second ONF MWTN PoC the ONF Core Model 1.1 is reduced to focus on the important ObjectClases and to avoid unnecessary (less important) error analysis.
The focus is on the Object Classes: LogicalTerminaionPoint, LayerProtocol, ForwardingDomain, Link and LinkPort (in short LTP-Link).

## Status
Ok: Generated YANG files are valid according to pyang 1.6.

## Changes made on ONF Core Model 1.1
- remove package CoreModel::ExplanatoryFiguresUsedIndDocumentsAndSlides
- remove package CoreModel::CoreModelEnhancements
- remove package CoreModel::CoreNetworkModule::TypeDefinitions::TopologyPacs
- remove package CoreModel::CoreNetworkModule::ObjectClasses::TopologyPacs
- remove package CoreModel::CoreNetworkModule::Diagrams::TopologyPacs
- remove obsolete type definition CoreModel::CoreNetworkModule::TypeDefinitions::OperationalState
- remove obsolete type definition CoreModel::CoreNetworkModule::TypeDefinitions::Directionality
- remove obsolete property CoreModel::CoreNetworkModule::ObjectClasses::NetworkElement::_ltppList
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::FcRoute
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::FcSwitch
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::ForwardingConstruct
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::FcPort
- define type for CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::terminationState - set to Boolean
- define type for CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::configuredClientCapacity - set to String
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::SdnController
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::NetworkControlDomain
- add conditional package MicrowaveModel::ObjectClasses::MwConnection::AirInterface::MW_AirInterface_Pac (Prio1 only)