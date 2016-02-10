# Reduced Core Model  
There is no need to support the ForwardingConstruct in the 2. OTN MWTN PoC. However here is a reduced ONF Core Model, which includes the object classes for the Forwarding Consturct (FC).

## Status
Ongoing: Generated YANG files are not valid according to pyang 1.6.
The reason might be cross references within the CoreModel.uml.

## Changes made on ONF Core Model 1.1
- remove package CoreModel::ExplanatoryFiguresUsedIndDocumentsAndSlides
- remove package CoreModel::CoreModelEnhancements
- remove package CoreModel::CoreNetworkModule::TypeDefinitions::TopologyPacs
- remove package CoreModel::CoreNetworkModule::ObjectClasses::TopologyPacs
- remove package CoreModel::CoreNetworkModule::Diagrams::TopologyPacs
- remove obsolete type definition CoreModel::CoreNetworkModule::TypeDefinitions::OperationalState
- remove obsolete type definition CoreModel::CoreNetworkModule::TypeDefinitions::Directionality
- remove obsolete property CoreModel::CoreNetworkModule::ObjectClasses::NetworkElement::_ltppList
- remove obsolete property CoreModel::CoreNetworkModule::ObjectClasses::LinkPort::_ltpp
- define type for CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::terminationState - set to Boolean
- define type for CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::configuredClientCapacity - set to String
