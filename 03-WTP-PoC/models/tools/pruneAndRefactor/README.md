# Prune and refactor
The folder contains xslt (Extensible Stylesheet Language Transformation) files which define the modification on standardized information model created with eclipse papyrus.

The modifications are necessary, to generate valid yang modules.

## ONF Core Model 1.1
The ONF Core Model 1.1 is the core of the ONF Microwave Model. However some object classes are 
not needed or cannot be implemented on microwave nodes.

CM-PruningAndRefactor-4MW.xslt implements the following changes:
- remove package CoreModel::ExplanatoryFiguresUsedIndDocumentsAndSlides
- remove package CoreModel::CoreModelEnhancements
- remove package CoreModel::CoreNetworkModule::TypeDefinitions::TopologyPacs
- remove package CoreModel::CoreNetworkModule::ObjectClasses::TopologyPacs
- remove package CoreModel::CoreNetworkModule::Diagrams::TopologyPacs
- remove obsolete type definition CoreModel::CoreNetworkModule::TypeDefinitions::OperationalState
- remove obsolete type definition CoreModel::CoreNetworkModule::TypeDefinitions::Directionality
- remove obsolete property CoreModel::CoreNetworkModule::ObjectClasses::NetworkElement::_ltppList
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::SdnController
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::NetworkControlDomain 
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::Link
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::LinkPort
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::FcRoute
- remove optional attribute CoreModel::CoreFoundationModule::SuperClassesAndCommonPackages::TypeDefinitions::NameAndValue::_nameAndValueAuthorityRef
- remove optional attribute CoreModel::CoreFoundationModule::SuperClassesAndCommonPackages::TypeDefinitions::NameAndValue::_globalClassRef
- remove optional attribute CoreModel::CoreFoundationModule::SuperClassesAndCommonPackages::TypeDefinitions::NameAndValue::_localClassRef
- remove attribute CoreModel::CoreNetworkModule::ObjectClasses::ForwardingDomain::_linkRefList because Link was removed.
- remove attribute CoreModel::CoreNetworkModule::ObjectClasses::ForwardingConstruct::_fcRouteRefList because FcRoute was removed.
- remove attribute CoreModel::CoreNetworkModule::ObjectClasses::ForwardingConstruct::_configurationAndSwitchControlList, because SwitchControl is part of FcSwitch
- remove attribute CoreModel::CoreNetworkModule::ObjectClasses::ForwardingConstruct::_fcSpecRef, for simplifications (switch capabilities are 1+1 MWS protection)
- remove attribute CoreModel::CoreNetworkModule::ObjectClasses::FcSwitch::_configurationAndSwitchControlRef, because external controllers are not part of a NetworkElement..
- remove attribute CoreModel::CoreNetworkModule::ObjectClasses::FcSwitch::_configurationAndSwitchControl, because it does not add any additional control parameters
- remove attribute CoreModel::CoreNetworkModule::ObjectClasses::FcSwitch::_configurationAndSwitchControl, because it does not add any additional control parameters
- remove attribute CoreModel::CoreNetworkModule::ObjectClasses::FcSwitch::_profileProxyRefList, for simplifications (switch config files)
- remove attribute CoreModel::CoreNetworkModule::ObjectClasses::LogicalTerminationPoint::_ltpSpec, because LTP capabilities are described for Microwave another way.
- remove attribute CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::_lpSpec, because LP capabilities are described for Microwave another way.
- define type for CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::terminationState - set to Boolean
- define type for CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::configuredClientCapacity - set to String
- add Q.822 to  CoreModel::CoreNetworkModule::TypeDefinitions
- add attribute uuid to CoreModel::CoreFoundationModule::SuperClassesAndCommonPackages::ObjectClasses::LocalClass used at yang key
- add yang key definitions

## G.847.1
ITU-T G.874.1 describes the information model of OTN. The microwave model will reuse the definitions of Performance Monitoring.

G.874.1-PruningAndRefactor-4MW.xslt implements the following changes:
- remove all ObjectClasses except: 
  - G.874.1-model::Imported Information Object Classes::X.721::«X.721» Top
  - G.874.1-model::Imported Information Object Classes::X.739::«X.739» Scanner
  - G.874.1-model::Imported Information Object Classes::Q.822::«Q.822» CurrentData
  - G.874.1-model::Imported Information Object Classes::Q.822::«Q.822» HistoryData
  - G.874.1-model::Object Classes::OTN_CurrentData
  - G.874.1-model::Object Classes::OTN_HistoryData
- remove package G.874.1-model::OperationExceptions, because there no reference to its DataTypes
- remove optional attributes from «X.721» Top (packages, allomorphs)
- remove optional packages form «Q.822» CurrentData for simplifications, maybe zero-suppression features could be uses later
- remove optional packages form «Q.822» HistoryData for simplifications, maybe zero-suppression features could be uses later
- remove attribute G.874.1-model::Imported Information Object Classes::X.739::«X.739» Scanner::operationalState, because the operationalState is defined by ONF CoreModel already
- remove problematic but not used TypeDefs
- define type for G.874.1-model::Imported Information Object Classes::X.739::«X.739» Scanner::scannerId - set to UML:String
- define type for G.874.1-model::Imported Information Object Classes::Q.822::«Q.822» HistoryData::historyDataId - set to UML:String
- define type for G.874.1-model::Imported Information Object Classes::Q.822::«Q.822» HistoryData::periodEndTime - set to ONF:DateAndTime
- define type for G.874.1-model::Imported Information Object Classes::X.739::«X.739» Scanner::administrativeState - set to ONF:AdministrativeState
- define type for G.874.1-model::Imported Information Object Classes::Q.822::«Q.822» CurrentData::elapsedTime - set to Integer -> Units 's'
- define type for G.874.1-model::Imported Information Object Classes::X.739::«X.739» Scanner::granularityPeriod - set to ENUM ::= {15min, 24h}
- use attribute G.874.1-model::Imported Information Object Classes::X.739::«X.739» Scanner::scannerId as yang key
- use attribute G.874.1-model::Imported Information Object Classes::Q.822::«Q.822» HistoryData::historyDataId as yang key

## ONF Microwave Model.
The Microwave model contains also some explaining Object Classes which must not be used in yang modules.

mwModelPreProcessor.xslt implements the removal of unnecessary object classes.

