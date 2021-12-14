<?xml version="1.0" encoding="UTF-8"?>
<!--
################################################################################
# Copyright 2019 higshtreet technologies GmbH
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# Author: martin.skorupski@highstreet-technologies.com
# 
-->
<!-- A stylesheet to prune and refactor the ONF Core Model 1.4 for a configuration API between network functions and SDN-Controllers -->
<!-- additional changes for CoreModel 1.4
       - remove package CoreModel::ExampleFragments 
       - remove package CoreModel::ExplanatoryFiguresUsedInDocumentsAndSlides
       - remove package CoreModel::ProcessingConstructModel
       - remove package CoreModel::InformationArchitectureAndPatterns
       - remove package CoreModel::CoreInteractionModel
       - remove package CoreModel::Z.AssociationsOutOfPlace
       - add prefix "_" where missing for attribute names
       - centralized TypeDefinitions
       - rename CoreModel to ExtensibleNetworkFunction
       - add OpenModelStatement
       - add Rootelement steriotype to ControlConstruct
       - add generalization to GlobalClass from CascPort
       - avoiding naming confilcts for class and data-type "Address"
       - modify type for CoreModel::CoreNetworkModule::ObjectClasses::GlobalClass::localId - set to String
       - modify type for LayerProtocol::layerProtocolName - set to extensible ENUM
       - Rename extensible ENUM LayerprotocolName to LayerProtocolNameType
       - Rename attribute ltp to logical-termination-point
       - add TypeDefinition ProfileNameType
       - add reference to uml, for ownedAttributes, in case no comment is provided by UML
-->
<!-- Changes made on the ONF Core Model 1.1 -> 1.2 -> 1.4
       - remove package CoreModel::ExplanatoryFiguresUsedIndDocumentsAndSlides
       - remove package CoreModel::CoreModelEnhancements
       - remove package CoreModel::CoreNetworkModule::TypeDefinitions::Topology
       - remove package CoreModel::CoreNetworkModule::ObjectClasses::Topology
       - remove package CoreModel::CoreNetworkModule::Diagrams::Topology
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
       - correct CoreModel::CoreFoundationModel::StateModel::ObjectClasses::State_Pac::adminsatratveState -> administrativeState
       - add yang key definitions according to keys.xml
-->
<!-- additional changes for CoreModel 1.2 
       - remove CoreModel::CoreOperationsModel::Pattern::ObjectClasses::OperationSet::abortAfterDurationWithActionRule, because it has no type
       - remove CoreModel::CoreOperationsModel::Examples, no YANG vor explainations
       - add feature names for "conditions" if not exists
       - remove assozaiation northbound of NetworkElement
       - remove _layerProtocolParameterSpec, because cooresponding type has no attributes defined
       - remove _serverSpec, , because cooresponding type has no attributes defined
       - remove _ownedMappingInteractionRule, because cooresponding type has no attributes defined
       - remove _ltpSpec, because cooresponding type has no attributes defined
       - remove _nameAndValueAuthority, _globalClass and _localClass from DataType NameAndValue for simplification
       - remove LTP::_port, because related type has no attributes
       - remove Class Address, because it is abstract
       - remove AddressElement::_address, avoiding circular dependency
       - remove _desiredOutcomeConstraints, because of key issues ;(
       - remove 'empty' classes: SpecificClassStructure, SpecificPattern, Ltp
       - remove FruNonFruRules
	   - add high-level description
-->
<xsl:stylesheet version="2.0" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:OpenModel_Profile="http:///schemas/OpenModel_Profile/_S30WUD8HEeiIisB6uOvKFA/26" xmlns:OpenInterfaceModel_Profile="http:///schemas/OpenInterfaceModel_Profile/_YFPa8LptEeiytveF7IdLXg/9" xmlns:RootElement="http:///schemas/RootElement/_unAKkJDrEemIv9iw4JXc9w/46" xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmlns:xmi="http://www.omg.org/spec/XMI/20131001" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" exclude-result-prefixes="fn xs">
  <!-- imports -->
  <xsl:import href="./global-functions.xslt"/>
  <!-- output defintions -->
  <xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" use-character-maps="cmap"/>
  <xsl:strip-space elements="*"/>
  <!-- key definitions -->
  <xsl:key name="openAttributeRef" match="OpenModel_Profile:OpenModelAttribute" use="@xmi:id"/>
  <xsl:key name="ownedAttributeRef" match="ownedAttribute" use="@xmi:id"/>
  <xsl:key name="keyRef" match="key" use="@base_StructuralFeature"/>
  <xsl:key name="yangFeatures" match="yang-feature" use="@id"/>
  <xsl:key name="prunedElementById" match="*" use="@id"/>
    <xsl:key name="attributeRef" match="attribute" use="@id"/>
  <!-- parameters -->
  <xsl:variable name="keyLookupDoc" select="fn:document('keys.xml')"/>
  <xsl:variable name="thisLookupDoc" select="fn:document('../onf-core-information-model-v1.4/CoreModel.uml')"/>
  <xsl:variable name="yangFeaturesLookupDoc" select="fn:document('yang-features.xml')"/>
  <xsl:variable name="pruningLookupDoc" select="fn:document('pruning-control.xml')"/>

  <!-- pruning by pruning-control-xml -->
  <xsl:template match="*[@xmi:id]" priority="-6">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@xmi:id"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@base_Abstraction]" priority="-5">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_Abstraction"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@base_Association]" priority="-5">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_Association"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@base_Class]" priority="-5">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_Class"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@base_DataType]" priority="-5">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_DataType"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@base_Element]" priority="-5">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_Element"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@base_Generalization]" priority="-5">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_Generalization"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@base_Interface]" priority="-5">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_Interface"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@base_Operation]" priority="-5">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_Operation"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@base_Parameter]" priority="-5">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_Parameter"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@base_Realization]" priority="-5">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_Realization"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@base_Signal]" priority="-5">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_Signal"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@base_Slot]" priority="-5">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_Slot"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@base_StructuralFeature]" priority="-5">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_StructuralFeature"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@base_Type]" priority="-5">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_Type"/>
    </xsl:call-template>
  </xsl:template> 
  <xsl:template match="RootElement:RuntimeTypeExtension[@base_PrimitiveType]" priority="-4">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_PrimitiveType"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="RootElement:ControlledString[@base_Enumeration]" priority="-4">
    <xsl:call-template name="pruneIfDefined">
      <xsl:with-param name="id" select="@base_Enumeration"/>
    </xsl:call-template>
  </xsl:template>


  <!-- templates -->
 
  <!-- rename CoreModel to CoreNetworkFunctions - ->
  <xsl:template match="@name[. = 'CoreModel']" >
    <xsl:attribute name="name">ExtensibleNetworkFunction</xsl:attribute>
  </xsl:template> -->
  <!-- add high-level description and centralized TypeDefinitions-->
  <xsl:template match="uml:Package[@xmi:id = '_oGqilVLNEeO75dO39GbF8Q']" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <ownedComment xmi:type="uml:Comment" xmi:id="_uHEawDdIEeOHDrwRRcUeVQ" annotatedElement="../@xmi:id">
        <body>This module contains a collection of YANG definitions for management and control of network fuctions.</body>
      </ownedComment>
      <packagedElement xmi:type="uml:Package" xmi:id="core-model-type-definitions" name="TypeDefinitions">
        <xsl:apply-templates select="//packagedElement[@xmi:type='uml:Package' and @name='TypeDefinitions']/node()"/>
	<!-- add Type ProfileNameType -->
	<!-- Temporary fix.. modifying the name of the attribute and changing it back to the original name in postprocessing script because of design complexity -->
        <packagedElement xmi:type="uml:Enumeration" xmi:id="_jMtRsKInEem1L6jqz3rbgg" name="ProfileNamxxType" isAbstract="true">
          <ownedComment xmi:type="uml:Comment" xmi:id="_jMt4wKInEem1L6jqz3rbgg" annotatedElement="_jMtRsKInEem1L6jqz3rbgg">
            <body>A controlled list of Profile names.</body>
          </ownedComment>
          <ownedLiteral xmi:type="uml:EnumerationLiteral" xmi:id="_x95OEKInEem1L6jqz3rbgg" name="USER_PROFILE"/>
        </packagedElement>
        <!-- add Type ExternalManagedUniversalId -->
          <packagedElement xmi:type="uml:DataType" xmi:id="_3EHRQJ1WEemVGaFq9YMDhg" name="ExternalManagedUniversalId">
            <ownedAttribute xmi:type="uml:Property" xmi:id="_3EHRQZ1WEemVGaFq9YMDhg" name="managerIdentifier" visibility="public">
              <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
            </ownedAttribute>
            <ownedAttribute xmi:type="uml:Property" xmi:id="_3EHRQp1WEemVGaFq9YMDhg" name="externalManagedUuid">
              <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
            </ownedAttribute>
          </packagedElement>
                </packagedElement>
    <packagedElement xmi:type="uml:Package" xmi:id="_nzCdP19LEemkV8c3A5D8-A" name="Imports">
      <packageImport xmi:type="uml:PackageImport" xmi:id="_nzCdQF9LEemkV8c3A5D8-A">
        <importedPackage xmi:type="uml:Model" href="CommonDataTypes/ImplementationCommonDataTypes.uml#_-lRh4FDNEeWpFusmeDrF3w"/>
      </packageImport>
      <!--
      <packageImport xmi:type="uml:PackageImport" xmi:id="_nzCdQV9LEemkV8c3A5D8-A">
        <importedPackage xmi:type="uml:Model" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#_0"/>
      </packageImport> -->
    </packagedElement>
      <xsl:apply-templates select="node() | text()"/>


    </xsl:copy>
  </xsl:template>
  <!-- 
     add reference to uml, for ownedAttributes, in case no comment is provided by UML -->
  <xsl:template match="ownedAttribute[fn:not(ownedComment) and fn:not(fn:key('prunedElementById', @xmi:id, $pruningLookupDoc)/@prune = fn:true())]">
    <xsl:copy>
      <xsl:apply-templates select="* | @* | text()"/>
      <ownedComment xmi:type="uml:Comment" xmi:id="{fn:generate-id(.)}" annotatedElement="{../@xmi:id}">
        <body>
          <xsl:text>none</xsl:text>
          <xsl:call-template name="addUmlReference">
            <xsl:with-param name="node" select="."/>
            <xsl:with-param name="visible" select="fn:false()"/>
          </xsl:call-template>
        </body>
      </ownedComment>
    </xsl:copy>
  </xsl:template>
  <!-- 
     modify type for CoreModel::CoreNetworkModule::ObjectClasses::LocalClass::localId - set to String and multiplicity to 1 -->
  <xsl:template match="ownedAttribute[@name = 'localId' ]" >
    <xsl:copy>
      <xsl:apply-templates select="*[fn:not(fn:name(.) = 'upperValue')] | @*[fn:not(fn:name(.) = 'type')] | text()"/>
      <upperValue xmi:type="uml:LiteralUnlimitedNatural" xmi:id="_xT__YI3wEeO38ZmbECnvbg" value="1"/>
      <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
    </xsl:copy>
  </xsl:template>
  <!-- 
    modify type for LayerProtocol::layerProtocolName - set to extensible ENUM -->
  <xsl:template match="ownedAttribute[@name = 'layerProtocolName' ]" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:attribute name="type">_MbUkMIQ4EeiXzpgfQWpR-Q</xsl:attribute>
      <xsl:apply-templates select="*[fn:not(fn:name(.) = 'type')] | text()"/>
    </xsl:copy>
  </xsl:template>
  <!-- 
    rename "_ltp" to "_logicalTerminationPoint" -->
  <xsl:template match="ownedAttribute[@name = '_ltp' ]" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:attribute name="name">_logicalTerminationPoint</xsl:attribute>
      <xsl:apply-templates select="node() | text()"/>
    </xsl:copy>
  </xsl:template>
  <!-- 
    rename "_lp" to "_layerProtocol" -->
  <xsl:template match="ownedAttribute[@name = '_lp' ]" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:attribute name="name">_layerProtocol</xsl:attribute>
      <xsl:apply-templates select="node() | text()"/>
    </xsl:copy>
  </xsl:template>
  <!-- 
    Add attributes to class ControlConstruct  -->
  <xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'ControlConstruct']" >
    <xsl:copy>
      <xsl:apply-templates select="@* | node() | text()"/>
          <ownedComment xmi:type="uml:Comment" xmi:id="_RlPRwJ5jEemkbek818V8NQ">
            <body>Root element for controller southbound APIs.</body>
          </ownedComment>
          <ownedAttribute xmi:type="uml:Property" xmi:id="_TwNWgZ5NEemkbek818V8NQ" name="_topLevelEquipment" type="_8SXNej-HEeaRI-H69PghuA" aggregation="shared" association="_TwKTMJ5NEemkbek818V8NQ">
            <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_TwRA4J5NEemkbek818V8NQ"/>
            <upperValue xmi:type="uml:LiteralUnlimitedNatural" xmi:id="_TwUrQJ5NEemkbek818V8NQ" value="*"/>
          </ownedAttribute>
          <ownedAttribute xmi:type="uml:Property" xmi:id="_dbQycp5AEemkbek818V8NQ" name="_equipment" type="_8SXNej-HEeaRI-H69PghuA" aggregation="composite" association="_dbO9QJ5AEemkbek818V8NQ">
            <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_dbSAkJ5AEemkbek818V8NQ"/>
            <upperValue xmi:type="uml:LiteralUnlimitedNatural" xmi:id="_dbSAkZ5AEemkbek818V8NQ" value="*"/>
          </ownedAttribute>
          <ownedAttribute xmi:type="uml:Property" xmi:id="_ugCiEp5AEemkbek818V8NQ" name="_logicalTerminationPoint" type="_eEpDMFX4EeOVGaP4lO41SQ" aggregation="composite" association="_ugAF0J5AEemkbek818V8NQ">
            <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_ugDJIJ5AEemkbek818V8NQ"/>
            <upperValue xmi:type="uml:LiteralUnlimitedNatural" xmi:id="_ugDJIZ5AEemkbek818V8NQ" value="*"/>
          </ownedAttribute>
          <ownedAttribute xmi:type="uml:Property" xmi:id="___8ugp5AEemkbek818V8NQ" name="_forwardingDomain" type="_oGql-FLNEeO75dO39GbF8Q" aggregation="composite" association="___65UJ5AEemkbek818V8NQ">
            <lowerValue xmi:type="uml:LiteralInteger" xmi:id="___9VkJ5AEemkbek818V8NQ"/>
            <upperValue xmi:type="uml:LiteralUnlimitedNatural" xmi:id="___9VkZ5AEemkbek818V8NQ" value="*"/>
          </ownedAttribute>
          <ownedAttribute xmi:type="uml:Property" xmi:id="_0pHrEJ4-Eemkbek818V8NQ" name="_profileCollection" type="_GLZy4J47Eemkbek818V8NQ" aggregation="composite" association="_0pFO0J4-Eemkbek818V8NQ">
            <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_0pISIJ4-Eemkbek818V8NQ"/>
            <upperValue xmi:type="uml:LiteralUnlimitedNatural" xmi:id="_0pISIZ4-Eemkbek818V8NQ" value="1"/>
          </ownedAttribute>
    </xsl:copy>
            <packagedElement xmi:type="uml:Class" xmi:id="_GLZy4J47Eemkbek818V8NQ" name="ProfileCollection">
          <ownedAttribute xmi:type="uml:Property" xmi:id="_OryDEJ48Eemkbek818V8NQ" name="_profile" type="_GLc2MJ47Eemkbek818V8NQ" aggregation="composite" association="_Orr8cJ48Eemkbek818V8NQ">
            <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_OryqIJ48Eemkbek818V8NQ"/>
            <upperValue xmi:type="uml:LiteralUnlimitedNatural" xmi:id="_OrzRMJ48Eemkbek818V8NQ" value="*"/>
          </ownedAttribute>
        </packagedElement>
        <packagedElement xmi:type="uml:Class" xmi:id="_GLc2MJ47Eemkbek818V8NQ" name="Profile">
          <generalization xmi:type="uml:Generalization" xmi:id="_jiXs4J47Eemkbek818V8NQ" general="_iVJ1kI2wEeO38ZmbECnvbg"/>
          <ownedAttribute xmi:type="uml:Property" xmi:id="_GLc2NZ47Eemkbek818V8NQ" name="profileName" type="_jMtRsKInEem1L6jqz3rbgg"/>
        </packagedElement>
      

  </xsl:template>
  <!-- 
    Add assoziations to ControlConstruct  -->
  <xsl:template match="packagedElement[@name = 'Assocations']" >
    <xsl:copy>
      <xsl:apply-templates select="@* | node() | text()"/>

        <packagedElement xmi:type="uml:Package" xmi:id="_3RUOoJ45Eemkbek818V8NQ" name="pnrDeviceModel">
          <packagedElement xmi:type="uml:Association" xmi:id="_Orr8cJ48Eemkbek818V8NQ" name="hasProfiles" memberEnd="_OryDEJ48Eemkbek818V8NQ _OrzRMZ48Eemkbek818V8NQ">
            <eAnnotations xmi:type="ecore:EAnnotation" xmi:id="_Orw08J48Eemkbek818V8NQ" source="org.eclipse.papyrus">
              <details xmi:type="ecore:EStringToStringMapEntry" xmi:id="_Orw08Z48Eemkbek818V8NQ" key="nature" value="UML_Nature"/>
            </eAnnotations>
            <ownedEnd xmi:type="uml:Property" xmi:id="_OrzRMZ48Eemkbek818V8NQ" name="_profileCollection" type="_GLZy4J47Eemkbek818V8NQ" association="_Orr8cJ48Eemkbek818V8NQ"/>
          </packagedElement>
          <packagedElement xmi:type="uml:Association" xmi:id="_0pFO0J4-Eemkbek818V8NQ" name="ControlConstructHasProfileCollection" memberEnd="_0pHrEJ4-Eemkbek818V8NQ _0pI5MJ4-Eemkbek818V8NQ">
            <eAnnotations xmi:type="ecore:EAnnotation" xmi:id="_0pHEAJ4-Eemkbek818V8NQ" source="org.eclipse.papyrus">
              <details xmi:type="ecore:EStringToStringMapEntry" xmi:id="_0pHEAZ4-Eemkbek818V8NQ" key="nature" value="UML_Nature"/>
            </eAnnotations>
            <ownedEnd xmi:type="uml:Property" xmi:id="_0pI5MJ4-Eemkbek818V8NQ" name="_controlConstruct" type="_Vuh_EJmhEeWTOvbfd7_4-A" association="_0pFO0J4-Eemkbek818V8NQ"/>
          </packagedElement>
        </packagedElement>
        <packagedElement xmi:type="uml:Association" xmi:id="_dbO9QJ5AEemkbek818V8NQ" name="ControlConstructHasEquipment" memberEnd="_dbQycp5AEemkbek818V8NQ _dbSAkp5AEemkbek818V8NQ">
          <eAnnotations xmi:type="ecore:EAnnotation" xmi:id="_dbQycJ5AEemkbek818V8NQ" source="org.eclipse.papyrus">
            <details xmi:type="ecore:EStringToStringMapEntry" xmi:id="_dbQycZ5AEemkbek818V8NQ" key="nature" value="UML_Nature"/>
          </eAnnotations>
          <ownedEnd xmi:type="uml:Property" xmi:id="_dbSAkp5AEemkbek818V8NQ" name="_controlConstruct" type="_Vuh_EJmhEeWTOvbfd7_4-A" association="_dbO9QJ5AEemkbek818V8NQ">
            <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_qME1sJ5EEemkbek818V8NQ" value="1"/>
            <upperValue xmi:type="uml:LiteralUnlimitedNatural" xmi:id="_qMIgEJ5EEemkbek818V8NQ" value="1"/>
          </ownedEnd>
        </packagedElement>
        <packagedElement xmi:type="uml:Association" xmi:id="_ugAF0J5AEemkbek818V8NQ" name="ControlConstructHasLtp" memberEnd="_ugCiEp5AEemkbek818V8NQ _ugDwMJ5AEemkbek818V8NQ">
          <eAnnotations xmi:type="ecore:EAnnotation" xmi:id="_ugCiEJ5AEemkbek818V8NQ" source="org.eclipse.papyrus">
            <details xmi:type="ecore:EStringToStringMapEntry" xmi:id="_ugCiEZ5AEemkbek818V8NQ" key="nature" value="UML_Nature"/>
          </eAnnotations>
          <ownedEnd xmi:type="uml:Property" xmi:id="_ugDwMJ5AEemkbek818V8NQ" name="_controlConstruct" type="_Vuh_EJmhEeWTOvbfd7_4-A" association="_ugAF0J5AEemkbek818V8NQ"/>
        </packagedElement>
        <packagedElement xmi:type="uml:Association" xmi:id="___65UJ5AEemkbek818V8NQ" name="ControlConstructHasForwrdingDomains" memberEnd="___8ugp5AEemkbek818V8NQ ___9Vkp5AEemkbek818V8NQ">
          <eAnnotations xmi:type="ecore:EAnnotation" xmi:id="___8ugJ5AEemkbek818V8NQ" source="org.eclipse.papyrus">
            <details xmi:type="ecore:EStringToStringMapEntry" xmi:id="___8ugZ5AEemkbek818V8NQ" key="nature" value="UML_Nature"/>
          </eAnnotations>
          <ownedEnd xmi:type="uml:Property" xmi:id="___9Vkp5AEemkbek818V8NQ" name="_controlConstruct" type="_Vuh_EJmhEeWTOvbfd7_4-A" association="___65UJ5AEemkbek818V8NQ"/>
        </packagedElement>
        <packagedElement xmi:type="uml:Association" xmi:id="_TwKTMJ5NEemkbek818V8NQ" name="ControlConstructPointsToTopLevelEquipment" memberEnd="_TwNWgZ5NEemkbek818V8NQ _TwXHgJ5NEemkbek818V8NQ">
          <eAnnotations xmi:type="ecore:EAnnotation" xmi:id="_TwMvcJ5NEemkbek818V8NQ" source="org.eclipse.papyrus">
            <details xmi:type="ecore:EStringToStringMapEntry" xmi:id="_TwNWgJ5NEemkbek818V8NQ" key="nature" value="UML_Nature"/>
          </eAnnotations>
          <ownedEnd xmi:type="uml:Property" xmi:id="_TwXHgJ5NEemkbek818V8NQ" name="_controlConstruct" type="_Vuh_EJmhEeWTOvbfd7_4-A" association="_TwKTMJ5NEemkbek818V8NQ"/>
        </packagedElement>
        <packagedElement xmi:type="uml:Association" xmi:id="_ej9ncJ5iEemkbek818V8NQ" name="LtpReferencesEquipment" memberEnd="_ekADsJ5iEemkbek818V8NQ _ekAqwp5iEemkbek818V8NQ">
          <eAnnotations xmi:type="ecore:EAnnotation" xmi:id="_ej_coJ5iEemkbek818V8NQ" source="org.eclipse.papyrus">
            <details xmi:type="ecore:EStringToStringMapEntry" xmi:id="_ej_coZ5iEemkbek818V8NQ" key="nature" value="UML_Nature"/>
          </eAnnotations>
          <ownedEnd xmi:type="uml:Property" xmi:id="_ekAqwp5iEemkbek818V8NQ" name="_logicalTerminationPoint" type="_eEpDMFX4EeOVGaP4lO41SQ" association="_ej9ncJ5iEemkbek818V8NQ"/>
        </packagedElement>
    </xsl:copy>
  </xsl:template>
  <!-- 
    Rename extensible ENUM LayerprotocolName to LayerProtocolNameType  -->
  <!-- Temporary fix.. concatenated the string changeinpostprocessing to the attribute name and removing the same in postprocessing script because of design complexity -->
  <xsl:template match="packagedElement[@name = 'LayerProtocolName']" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:attribute name="name">LayerProtocolNamxxType</xsl:attribute>
      <xsl:apply-templates select="node()  | text()"/>
    </xsl:copy>
  </xsl:template>
  <!-- 
   define type for CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::terminationState - set to Boolean -->
  <xsl:template match="ownedAttribute[@name = 'terminationState' ]" >
    <xsl:copy>
      <xsl:apply-templates select="* | @* | text()"/>
      <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#Boolean"/>
    </xsl:copy>
  </xsl:template>
  <!-- 
    define type for CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::configuredClientCapacity - set to String -->
  <xsl:template match="ownedAttribute[@name = 'configuredClientCapacity' ]" >
    <xsl:copy>
      <xsl:apply-templates select="* | @* | text()"/>
      <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
    </xsl:copy>
  </xsl:template>
  <!-- 
    add yang key definitions  -->
  <!-- ... for existing OpenModel_Profile:OpenModelAttribute -->
  <xsl:template match="OpenModel_Profile:OpenModelAttribute">
    <xsl:if test="key('ownedAttributeRef', @base_StructuralFeature)">
      <OpenModel_Profile:OpenModelAttribute>
        <xsl:apply-templates select="* | @* | text()"/>
        <xsl:if test="key('keyRef',  @base_StructuralFeature, $keyLookupDoc)">
          <xsl:attribute name="partOfObjectKey" select="key('keyRef',  @base_StructuralFeature, $keyLookupDoc)/@value"/>
          <xsl:call-template name="setAsKey">
            <xsl:with-param name="object" select="key('ownedAttributeRef', @base_StructuralFeature)"/>
          </xsl:call-template>
        </xsl:if>
      </OpenModel_Profile:OpenModelAttribute>
    </xsl:if>
  </xsl:template>
  <!-- ... for existing OpenModel_Profile:OpenModelAttribute -->
  <xsl:template match="/xmi:XMI">
    <xsl:copy>
      <xsl:apply-templates select="@* | node() | text()"/>

      <OpenModel_Profile:OpenModelStatement xmi:id="{@xmi:id}-open-model-statement" base_Model="{@xmi:id}" namespace="urn:onf:yang:extensible-network-function" organization="Open Networking Foundation (ONF)" description="This model defines a technology agnostic core model for network functions." copyright="Copyright 2019 Open Networking Foundation (ONF). All rights reserved." license="Licensed under the Apache License, Version 2.0 (the &#34;License&#34;);&#xA;you may not use this file except in compliance with the License.&#xA;You may obtain a copy of the License at&#xA;&#xA;    http://www.apache.org/licenses/LICENSE-2.0&#xA;&#xA;Unless required by applicable law or agreed to in writing, software&#xA;distributed under the License is distributed on an &#34;AS IS&#34; BASIS,&#xA;WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.&#xA;See the License for the specific language governing permissions and&#xA;limitations under the License.">
        <contact xmi:type="OpenModel_Profile:Contact" xmi:id="onf-core-nf-contact" projectWeb="https://wiki.opennetworking.org/pages/viewpage.action?pageId=262963204" projectEmail="&lt;mailto:information-modeling@opennetworking.org&gt;" editorName="Nigel Davis" editorEmail="&lt;mailto:ndavis@ciena.com&gt;"/>
        <revision xmi:type="OpenModel_Profile:Revision" xmi:id="onf-core-nf-revision-2019-11-27" date="2019-11-27" version="v1.4" description="Package equipment-specification has been deleted,&#xA;
       because of wrong key statements and overall grouping never applied.&#xA;" additionalChanges="" reference="ONF-TR-512, RFC 6020 and RFC 6087"/>
        <revision xmi:type="OpenModel_Profile:Revision" xmi:id="onf-core-nf-revision-2019-11-22" date="2019-11-22" version="v1.4" description="Module name and name space changed to core-model-1-4.&#xA;" additionalChanges="" reference="ONF-TR-512, RFC 6020 and RFC 6087"/>
        <revision xmi:type="OpenModel_Profile:Revision" xmi:id="onf-core-nf-revision-2019-07-09" date="2019-07-09" version="v1.4" description="Corrected version derived from ONF-TR-512 v1.4&#xA;
       - Type of LayerProtocol/layerProtocolName simplfied to LayerProtocolNameType &#xA;
       - Type of Profile/profileName changed to ProfileNameType (same concept as for layerProtocolName &#xA;
       - FcSwitch added. &#xA;
       - remove references to UML model." additionalChanges="" reference="ONF-TR-512, RFC 6020 and RFC 6087"/>

        <revision xmi:type="OpenModel_Profile:Revision" xmi:id="onf-core-nf-revision-2019-07-05" date="2019-07-05" version="v1.4" description="Corrected version derived from ONF-TR-512 v1.4&#xA;
       - renaming of attribute lp to layer-protocol&#xA;
       - presence statement in root container according to RFC8407 4.10. Top-Level Data Definitions&#xA;
       - Feature names introduced" additionalChanges="" reference="ONF-TR-512, RFC 6020 and RFC 6087"/>
        
        <revision xmi:type="OpenModel_Profile:Revision" xmi:id="onf-core-nf-revision-2019-05-25" date="2019-05-25" version="v1.4" description="Initial version derived from ONF-TR-512 v1.4" changeLog="https://github.com/OpenNetworkingFoundation/5G-xHaul/tree/experimental/models/tools" additionalChanges="Additional manual changes" reference="ONF-TR-512, RFC 6020 and RFC 6087"/>
        <revision xmi:type="OpenModel_Profile:Revision" xmi:id="onf-core-nf-revision-2019-05-05" date="2019-05-05" version="v0.0" description="Initial version" changeLog="https://github.com/OpenNetworkingFoundation/5G-xHaul/tree/experimental/models/tools" additionalChanges="Initial version" reference="ONF-TR-512, RFC 6020 and RFC 6087"/>
      </OpenModel_Profile:OpenModelStatement>
      <!-- add additional yang-keys -->
      <xsl:for-each select="$keyLookupDoc/keys/key">
        <xsl:if test="fn:not( key('openAttributeRef', @id, $thisLookupDoc) )">
          <OpenModel_Profile:OpenModelAttribute xmi:id="{@id}" base_StructuralFeature="{@base_StructuralFeature}" partOfObjectKey="{@value}"/>
        </xsl:if>
      </xsl:for-each>
      <!-- add Rootelement steriotype to ControlConstruct -->
      <OpenInterfaceModel_Profile:RootElement xmi:id="_FeKXkI-DEempwbJEMKKhVw" base_Class="_Vuh_EJmhEeWTOvbfd7_4-A"/>
    </xsl:copy>
  </xsl:template>

  <!-- 
    add feature names for "conditions" if not exists -->
  <xsl:template match="OpenModel_Profile:OpenModelAttribute[@condition and  @condition != '']" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:choose>
        <xsl:when test="fn:key('yangFeatures', @xmi:id , $yangFeaturesLookupDoc)">
          <xsl:attribute name="condition"><xsl:value-of select="fn:key('yangFeatures', @xmi:id , $yangFeaturesLookupDoc)/@name"/><xsl:text>&#xD;</xsl:text><xsl:value-of select="/@condition"/></xsl:attribute>
        </xsl:when>
      </xsl:choose>
      <xsl:apply-templates select="node()|comment()"/>
    </xsl:copy>
  </xsl:template>



  <!-- add attribute 'externalManagedId to GlobalClass -->
  <xsl:template match="packagedElement[@name='GlobalClass']">
    <xsl:copy>
      <xsl:apply-templates select="@*"/> 
            <ownedAttribute xmi:type="uml:Property" xmi:id="_5-IdYJ49Eemkbek818V8NQ" name="externalManagedId" type="_3EHRQJ1WEemVGaFq9YMDhg">
              <ownedComment xmi:type="uml:Comment" xmi:id="_5-IdYZ49Eemkbek818V8NQ">
                <body>A list of external managed universal identifiers, set by an external tool. There must not be any function implemented on the ControlConstruct itself next to updating the list on request and storing it persitenly. </body>
              </ownedComment>
            </ownedAttribute>      <xsl:apply-templates select="node() | text()"/>
      </xsl:copy>
  </xsl:template>
  <!-- add generalization to GlobalClass from CascPort -->
  <xsl:template match="packagedElement[@name='CascPort']">
    <xsl:copy>
      <xsl:apply-templates select="@*"/> 
            <generalization xmi:type="uml:Generalization" xmi:id="_b0yxAI_0EemsmLFVZ2jgzQ" general="_iVJ1kI2wEeO38ZmbECnvbg"/>
      <xsl:apply-templates select="node() | text()"/>
      </xsl:copy>
  </xsl:template>
  <!-- add generalization to GlobalClass from ControlPort -->
  <xsl:template match="packagedElement[@name='ControlPort']">
    <xsl:copy>
      <xsl:apply-templates select="@*"/> 
            <generalization xmi:type="uml:Generalization" xmi:id="_b0yxAI_0EemsmLFVZ2jgzQ" general="_iVJ1kI2wEeO38ZmbECnvbg"/>
      <xsl:apply-templates select="node() | text()"/>
      </xsl:copy>
  </xsl:template>

  <!-- avoiding naming confilcts for class and data-type "Address" -->
  <xsl:template match="packagedElement[@xmi:id='_A15msMDaEeWbqPZwR-Ot6A']">
    <xsl:copy>
      <xsl:apply-templates select="@*"/> 
      <xsl:attribute name="name">dtAddress</xsl:attribute>
      <xsl:apply-templates select="node() | text()"/>
    </xsl:copy>
  </xsl:template>

  <!-- see issue: https://github.com/openBackhaul/core/issues/2 -->
  <xsl:template match="lowerValue[@xmi:id='_gqUk0VYgEeOVGaP4lO41SQ']">
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_gqUk0VYgEeOVGaP4lO41SQ" value="0"/>
  </xsl:template>

  <!-- see issue: https://github.com/openBackhaul/core/issues/3 -->
  <xsl:template match="lowerValue[@xmi:id='_csyJwI2uEeO38ZmbECnvbg']">
    <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_csyJwI2uEeO38ZmbECnvbg" value="0"/>
  </xsl:template>

  <!-- temporary -->
  <xsl:template name="addUmlReference">
    <xsl:param name="node"/>
    <xsl:param name="visible"/>
    <xsl:if test="$visible = fn:true()">
      <xsl:text>&#xA;</xsl:text>
      <xsl:text>&#xA;</xsl:text>
      <xsl:text>uml:identifier = &quot;</xsl:text>
      <xsl:value-of select="$node/@xmi:id"/>
      <xsl:text>&quot;</xsl:text>
      <xsl:text>&#xA;</xsl:text>
      <xsl:text>uml:reference  = &quot;</xsl:text>
      <xsl:for-each select="$node/ancestor::*">
        <xsl:if test="@name">
          <xsl:text>/</xsl:text>
          <xsl:value-of select="@name"/>
        </xsl:if>
      </xsl:for-each>
      <xsl:text>&quot;</xsl:text>
    </xsl:if>
  </xsl:template>
  <xsl:template match="body">
    <body>
      <xsl:value-of select="text()"/>
      <xsl:call-template name="addUmlReference">
        <xsl:with-param name="node" select="../.."/>
        <xsl:with-param name="visible" select="fn:false()"/>
      </xsl:call-template>
    </body>
  </xsl:template>

  <!-- functions -->
  <xsl:template name="pruneIfDefined">
    <xsl:param name="id"/>
    <xsl:choose>
      <xsl:when test="fn:key('prunedElementById', $id, $pruningLookupDoc)/@prune = fn:true()">
        <xsl:call-template name="pruned">
          <xsl:with-param name="object" select="."/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
      <xsl:copy>
          <xsl:apply-templates select="@*|node()|comment()"/>
      </xsl:copy>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template> 

  <!-- To change the datatype of physical-port-reference from string to leafref to point to a instance in the equipment list -->
  <xsl:template match="ownedAttribute[@xmi:id = '_RLDi4BieEeSh8KVgZCMyDw' ]" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:attribute name="type">_8SXNej-HEeaRI-H69PghuA</xsl:attribute>
      <xsl:attribute name="aggregation">shared</xsl:attribute>
      <xsl:attribute name="association">_X1qQMD-QEeaRI-H69PghuA</xsl:attribute>
      <xsl:apply-templates select="node()  | text()"/>
    </xsl:copy>
  </xsl:template>
  <!-- To include the literal NONE to the enumeration ROUTE_SELECTION_REASON, so that it will generate the identity ROUTE_SELECTION_REASON_NONE   -->
  <xsl:template match="packagedElement[@name='RouteSelectionReason']">
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
            <ownedLiteral xmi:type="uml:EnumerationLiteral" xmi:id="_cswHkCi-EeaGGvAxxSe1uA1" name="NONE">
              <ownedComment xmi:type="uml:Comment" xmi:id="_lFJX8GnPEeaBUOurxzA2sw1" annotatedElement="_cswHkCi-EeaGGvAxxSe1uA1">
                <body>No reason</body>
              </ownedComment>
            </ownedLiteral>
      <xsl:apply-templates select="node() | text()"/>
      </xsl:copy>
 </xsl:template>
 <!-- To include the literal NONE to the enumeration SWITCH_STATE_REASON, so that it will generate the identity SWITCH_STATE_REASON_NONE   -->
 <xsl:template match="packagedElement[@name='SwitchStateReason']">
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
            <ownedLiteral xmi:type="uml:EnumerationLiteral" xmi:id="_zRKlICi9EeaGGvAxxSe1uA1" name="NONE">
              <ownedComment xmi:type="uml:Comment" xmi:id="_zRKlICi9EeaGGvAxxSe1uA2" annotatedElement="_zRKlICi9EeaGGvAxxSe1uA1">
                <body>No reason</body>
              </ownedComment>
            </ownedLiteral>
      <xsl:apply-templates select="node() | text()"/>
      </xsl:copy>
 </xsl:template>
 <!-- To change the comment of the attribute occupying-fru  -->
  <xsl:template match="ownedComment[@xmi:id='_rR5jEFfREearRtXLY7gquw']">
      <ownedComment xmi:type="uml:Comment" xmi:id="_rR5jEFfREearRtXLY7gquw" annotatedElement="_X1q3Qj-QEeaRI-H69PghuA">
                <body>The FRU that is occupying the holder.
A holder may be unoccupied.
An FRU may occupy more than one holder (using or blocking are intentionally not distinguished here).</body>
              </ownedComment>
      </xsl:template>
   <!-- To remove the charecter &#xD; from all the ownedComment body -->
   <xsl:character-map name="cmap">
        <xsl:output-character character="&#xD;" string=""/>
    </xsl:character-map>
</xsl:stylesheet>
