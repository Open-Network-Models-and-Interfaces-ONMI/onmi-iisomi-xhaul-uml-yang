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
		    <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_3EHRQZ1WEemVGaFq9YMDhi" value="0" />
            </ownedAttribute>
            <ownedAttribute xmi:type="uml:Property" xmi:id="_3EHRQp1WEemVGaFq9YMDhg" name="externalManagedUuid">
		    <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
		    <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_3EHRQp1WEemVGaFq9YMDhh" value="0" />
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
	 <revision xmi:type="OpenModel_Profile:Revision" xmi:id="onf-core-nf-revision-2023-07-26" date="2023-07-26" version="v1.4" description="Model for the Transport SDN Pilot at Telefonica Germany.&#xA;
       Please view https://github.com/openBackhaul/core/issues for changes.&#xA;" additionalChanges="" reference="ONF-TR-512, RFC 6020 and RFC 6087"/>
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
  <!--xsl:template match="ownedAttribute[@xmi:id = '_RLDi4BieEeSh8KVgZCMyDw' ]" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:attribute name="type">_8SXNej-HEeaRI-H69PghuA</xsl:attribute>
      <xsl:attribute name="aggregation">shared</xsl:attribute>
      <xsl:attribute name="association">_X1qQMD-QEeaRI-H69PghuA</xsl:attribute>
      <xsl:apply-templates select="node()  | text()"/>
    </xsl:copy>
  </xsl:template-->
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
<ownedLiteral xmi:type="uml:EnumerationLiteral" xmi:id="_zRKlICi9EeaGGvAxxSe1uA6" name="MANUAL">
            </ownedLiteral>
<ownedLiteral xmi:type="uml:EnumerationLiteral" xmi:id="_zRKlICi9EeaGGvAxxSe1uA3" name="FORCED">              
            </ownedLiteral>
<ownedLiteral xmi:type="uml:EnumerationLiteral" xmi:id="_zRKlICi9EeaGGvAxxSe1uA4" name="DEGRADE">              
            </ownedLiteral>
<ownedLiteral xmi:type="uml:EnumerationLiteral" xmi:id="_zRKlICi9EeaGGvAxxSe1uA5" name="FAIL">              
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

      <!-- To change the comment of the attribute manufacture-date  -->
  <xsl:template match="ownedComment[@xmi:id='_mW_OgIM7EeePYJZQb-Dcag']">
      <ownedComment xmi:type="uml:Comment" xmi:id="__mW_OgIM7EeePYJZQb-Dcag" annotatedElement="_YrPlQEQuEeasL6dcjI1vEA">
	      <body>This attribute represents the date on which this instance is manufactured. 
		      The date type is a profile of the ISO 8601 standard for representation of dates using the Gregorian calendar. 
		      The profile is defined by the full-date production in Section 5.6 of RFC 3339. 
		      Values shall follow the pattern: ^\\d{4}-\\d{2}-\\d{2}$ . 
		      Reference: RFC 3339: Date and Time on the Internet: Timestamps.</body>
              </ownedComment>
      </xsl:template>
   <!-- To remove the charecter &#xD; from all the ownedComment body -->
   <xsl:character-map name="cmap">
        <xsl:output-character character="&#xD;" string=""/>
</xsl:character-map>

<!-- changing encapsulated-fc from container to leafref -->

<xsl:template match="ownedAttribute[@xmi:id = '_6W86MHXEEeeqyuooNTTDCg' ]" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:attribute name="aggregation">shared</xsl:attribute>
      <xsl:apply-templates select="node()  | text()"/>
    </xsl:copy>
 </xsl:template>
<!-- changing coordinated-fc from container to leafref -->
<xsl:template match="ownedAttribute[@xmi:id = '_QRnFkdv0EeaL7dYp0KdCwA' ]" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:attribute name="aggregation">shared</xsl:attribute>
      <xsl:apply-templates select="node()  | text()"/>
    </xsl:copy>
</xsl:template>
<!-- changing _configurationAndSwitchControl from container to leafref >
<xsl:template match="ownedAttribute[@xmi:id = '_1EKuQJo5EeOyHKqw-cQ_eg' ]" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:attribute name="aggregation">shared</xsl:attribute>
      <xsl:apply-templates select="node()  | text()"/>
    </xsl:copy>
</xsl:template-->

<!-- changing _internalConfigurationAndSwitchControl from container to leafref >
<xsl:template match="ownedAttribute[@xmi:id = '_tbetAJ4HEeOO3om500DFKg' ]" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:attribute name="aggregation">shared</xsl:attribute>
      <xsl:apply-templates select="node()  | text()"/>
    </xsl:copy>
</xsl:template-->

<!-- changing _encapsulatedCasc from container to leafref >
<xsl:template match="ownedAttribute[@xmi:id = '_UJ_6IXXIEeeqyuooNTTDCg' ]" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:attribute name="aggregation">shared</xsl:attribute>
      <xsl:apply-templates select="node()  | text()"/>
    </xsl:copy>
</xsl:template-->
<!-- changing _configuration-and-switch-control in layerprotocol from container to leafref >
<xsl:template match="ownedAttribute[@xmi:id = '_d6vwsMQhEeWlWIVxswb46A' ]" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:attribute name="aggregation">shared</xsl:attribute>
      <xsl:apply-templates select="node()  | text()"/>
    </xsl:copy>
</xsl:template-->
<!-- To include the comment for the attribute is-hot-swappable  -->
<xsl:template match="ownedAttribute[@name='isHotSwappable']">
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
            <ownedComment xmi:type="uml:Comment" xmi:id="_yb3zEEQgEeasL6dcjI1vCC" annotatedElement="_yb3zEEQgEeasL6dcjI1vEA">
		    <body>This attribute shall be set on true, if the described equipment could be inserted or removed from the running system, + 
			    (without the need of powering the system down or restarting it) + 
			    (without being damaged or causing damage to any other element in the system where the equipment is inserted/removed) +
			    (without causing traffic interruption or an alteration on the performance of other components or parts of the system not directly supported by this equipment.) 
			    The aforementioned characteristic shall not require any manual change on other components of the system. 
			    Potential traffic interruption on the interfaces supported by the component, which is being replaced, shall not matter to the value of the is-hot-swappable attribute.</body>
              </ownedComment>
      <xsl:apply-templates select="node() | text()"/>
      </xsl:copy>
</xsl:template>
<!-- changing _selectedFcPort in fc-switch from list to leafref -->
<xsl:template match="ownedAttribute[@xmi:id = '_2PdiYI8lEeOw_ste-s6RrA' ]" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:attribute name="aggregation">shared</xsl:attribute>
      <xsl:apply-templates select="node()  | text()"/>
    </xsl:copy>
</xsl:template>
<!--  modify type for manufactureDate - set to String -->
  <xsl:template match="ownedAttribute[@name = 'manufactureDate' ]" >
    <xsl:copy>
      <xsl:apply-templates select="*[fn:not(fn:name(.) = 'upperValue')] | @*[fn:not(fn:name(.) = 'type')] | text()"/>
      <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
    </xsl:copy>
  </xsl:template>
  <!-- see issue: https://github.com/openBackhaul/core/issues/30 -->
  <xsl:template match="lowerValue[@xmi:id='_qmEbMD-QEeaRI-H69PghuA']">
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_qmEbMD-QEeaRI-H69PghuA" value="1"/>
  </xsl:template>



  <!-- see issue: https://github.com/openBackhaul/core/issues/32 -->

  <!-- To change the name-and-value-authority/uuid to optional-->
  <xsl:template match="lowerValue[@xmi:id='_VM-4EI31EeO38ZmbECnvbg']">
    <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_VM-4EI31EeO38ZmbECnvbg" value="0" />
  </xsl:template>

  <!-- To change the local-id-and-class/local-id to optional-->
  <xsl:template match="lowerValue[@xmi:id='_yRTdYsDwEeWbqPZwR-Ot6A']">
    <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_yRTdYsDwEeWbqPZwR-Ot6A" value="0" />
  </xsl:template>

  <!-- To change the local-id-and-class/class-of-instance to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_F1nxkMDxEeWbqPZwR-Ot6A']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_F1nxkMDxEeWbqPZwR-Ot6B" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the logical-termination-point/ltp-direction to optional-->
  <xsl:template match="lowerValue[@xmi:id='_TbSEkEDBEeWQeOKbNUpP9A']">
    <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_TbSEkEDBEeWQeOKbNUpP9A" value="0" />
  </xsl:template>

  <!-- To change the layer-protocol/termination-state to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_p2YfoGeEEeWmgIwAIZlYKQ']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_p2YfoGeEEeWmgIwAIZlYKR" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the layer-protocol/lpDirection to optional-->
  <xsl:template match="lowerValue[@xmi:id='_HFnvcEDBEeWQeOKbNUpP9A']">
    <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_HFnvcEDBEeWQeOKbNUpP9A" value="0" />
  </xsl:template>

  <!-- To change the layer-protocol-name-and-qualifier/layer-protocol-name to optional-->
  <!-- handled in the tool regarding this -->

<!-- To change the fd-port/role to optional-->
  <xsl:template match="lowerValue[@xmi:id='_eVO2UCT7Eee9I5wuRX6wwQ']">
    <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_eVO2UCT7Eee9I5wuRX6wwQ" value="0" />
  </xsl:template>

  <!-- To change the fd-port/fd-port-direction to optional-->
  <xsl:template match="lowerValue[@xmi:id='_fxO6QiT7Eee9I5wuRX6wwQ']">
    <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_fxO6QiT7Eee9I5wuRX6wwQ" value="0" />
  </xsl:template>

  <!-- To change the fc-port/is-internal-port to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_CSlIwNViEeWhfIeymCGl5Q']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_CSlIwNViEeWhfIeymCGl5R" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the fc-port/role to optional-->
  <xsl:template match="lowerValue[@xmi:id='_Y9kz4FeGEeOVGaP4lO41SQ']">
    <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_Y9kz4FeGEeOVGaP4lO41SQ" value="0" />
  </xsl:template>

  <!-- To change the fc-port/fc-port-direction to optional-->
  <xsl:template match="lowerValue[@xmi:id='_Dd7akEDCEeWQeOKbNUpP9A']">
    <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_Dd7akEDCEeWQeOKbNUpP9A" value="0" />
  </xsl:template>

  <!-- To change the fc-switch/hold-off-time to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_oGqn6FLNEeO75dO39GbF8Q']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_oGqn6FLNEeO75dO39GbF8R" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the fc-switch/prot-type to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_oGqn6lLNEeO75dO39GbF8Q']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_oGqn6lLNEeO75dO39GbF8R" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the fc-switch/switch-selection-reason to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_XjsGkCi_EeaGGvAxxSe1uA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_XjsGkCi_EeaGGvAxxSe1uB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the fc-switch/wait-to-restore-time to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_oGqn5lLNEeO75dO39GbF8Q']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_oGqn5lLNEeO75dO39GbF8R" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the casc-port/port-role to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_C4GqoNvwEeaL7dYp0KdCwA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_C4GqoNvwEeaL7dYp0KdCwB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the casc-port-role-properties/signalling-format to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_WNkx0GCHEeeJH-mSlR-JCw']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_WNkx0GCHEeeJH-mSlR-JCx" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the casc-port-role-properties/monitoring-details to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_kib-kGCHEeeJH-mSlR-JCw']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_kib-kGCHEeeJH-mSlR-JCx" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the casc-port-role-properties/control-details to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_wQGfkGCHEeeJH-mSlR-JCw']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_wQGfkGCHEeeJH-mSlR-JCx" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the name-and-value/value to optional-->

  <!-- To change the clock/run-mode to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_MCMUQHXCEeeqyuooNTTDCg']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_MCMUQHXCEeeqyuooNTTDCh" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the equipment-structure/category to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_gLJ28EQvEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_gLJ28EQvEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the holder-structure/holder-category to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_r240kERLEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_r240kERLEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the holder-structure/is-captive to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_4XbukERMEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_4XbukERMEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the holder-structure/is-guided to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_-1CEIERMEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_-1CEIERMEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the holder-structure/is-quantised-space to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_Lj7_sERNEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_Lj7_sERNEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the connector/connector-type to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_NBXLMEgXEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_NBXLMEgXEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the connector/role to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_Y4R7QC8IEeexxefg2F1i1Q']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_Y4R7QC8IEeexxefg2F1i1R" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the connector/orientation to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_r6M6MEQ-EeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_r6M6MEQ-EeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the connector/pin-layout to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_EaxH4kdeEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_EaxH4kdeEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the holder/holder-location to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_l6LE4ERTEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_l6LE4ERTEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the position/relative-position to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_U_6mYERXEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_U_6mYERXEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the spatial-properties-of-type/height to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_k_CVUEQyEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_k_CVUEQyEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the spatial-properties-of-type/width to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_n6nVoEQyEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_n6nVoEQyEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the spatial-properties-of-type/length to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_uIPVgEQyEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_uIPVgEQyEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the operator-augmented-equipment-instance/asset-instance-identifier to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_87VIs4M8EeePYJZQb-Dcag']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_87VIs4M8EeePYJZQb-Dcah" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the thermal-rating/thermal-rating-name to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_r6BzkGsaEeiRh-lc79MSRw']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_r6BzkGsaEeiRh-lc79MSRx" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the thermal-rating/maximum-temperature to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_-8q-EGsaEeiRh-lc79MSRw']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_-8q-EGsaEeiRh-lc79MSRx" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the thermal-rating/minimum-temperature to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_fFTHYGsbEeiRh-lc79MSRw']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_fFTHYGsbEeiRh-lc79MSRx" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the power-rating/power-rating-name to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_g6bmkGsnEeiRh-lc79MSRw']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_g6bmkGsnEeiRh-lc79MSRx" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the power-rating/power-rating-value to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_sGvuAGsnEeiRh-lc79MSRw']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_sGvuAGsnEeiRh-lc79MSRx" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the signal-property-rule/signal-property-name to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_MjTgEJwzEea1Nbypr6RfLw']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_MjTgEJwzEea1Nbypr6RfLx" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the signal-property-rule/signal-property-value-rule to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_jx5GkJwzEea1Nbypr6RfLw']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_jx5GkJwzEea1Nbypr6RfLx" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the metaclass-class/metaclass-class-name to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_oIBGkGImEeerc4Zz6ufSeg']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_oIBGkGImEeerc4Zz6ufSeh" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the external-managed-universal-id/manager-identifier to optional-->
  <!--included value in the same pruning file in the section "add Type ExternalManagedUniversalId" -->

  <!-- To change the external-managed-universal-id/external-managed-uuid to optional-->
  <!--included value in the same pruning file in the section "add Type ExternalManagedUniversalId" -->

  <!-- To change the installed-software-component/name to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_JopIgD4sEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_JopIgD4sEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the installed-software-component/version to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_KBj-0D4sEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_KBj-0D4sEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the running-software-process/name to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_xlPEwD4pEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_xlPEwD4pEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the running-software-process/process-id to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_ubjXAD4pEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_ubjXAD4pEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the running-software-process/run-state to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_xaU1QD4pEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_xaU1QD4pEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the running-software-process/priority to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_u54RwD4pEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_u54RwD4pEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the running-software-process/invoking-user to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_vUB3ID4pEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_vUB3ID4pEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the running-software-process/invoking-command to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_v6c98D4pEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_v6c98D4pEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the running-software-process/time-invoked to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_wyWPQD4pEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_wyWPQD4pEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the running-software-process/description to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_ydEEoD4pEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_ydEEoD4pEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the file/size to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_2lnLMD4lEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_2lnLMD4lEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the file/checksum to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_UWPF4D4nEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_UWPF4D4nEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the file/last-modify-time to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_QdB_sD4nEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_QdB_sD4nEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the file-system-entry/local-name to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_ejfX8D3CEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_ejfX8D3CEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the file-system-entry/path-name to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_ZbaD0D3CEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_ZbaD0D3CEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the file-system-entry/create-date to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_in2m0D4mEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_in2m0D4mEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the file-system-entry/is-read-only to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_A15GoD3CEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_A15GoD3CEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the file-system-entry/is-hidden to optional-->
  <xsl:template match="ownedAttribute[@xmi:id='_NdUhMD3CEei6HehkJk8P-g']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_NdUhMD3CEei6HehkJk8P-h" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
  </xsl:template>

  <!-- To change the name-and-value/value to optional-->
  <xsl:template match="lowerValue[@xmi:id='_Z3im4I3uEeO38ZmbECnvbg']">
    <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_Z3im4I3uEeO38ZmbECnvbg" value="0" />
  </xsl:template>

  <!-- To change the local-class/local-id to optional-->
<xsl:template match="lowerValue[@xmi:id='_GzHo0I3wEeO38ZmbECnvbg']">
    <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_GzHo0I3wEeO38ZmbECnvbg" value="0" />
</xsl:template>

<!-- To change the equipment-type/type-name to optional-->
<xsl:template match="ownedAttribute[@xmi:id='_j105QEQsEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_j105QEQsEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
</xsl:template>

<!-- To change the equipment-type/version to optional-->
<xsl:template match="ownedAttribute[@xmi:id='_mig3EEQuEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_mig3EEQuEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
</xsl:template>

<!-- To change the equipment-type/model-identifier to optional-->
<xsl:template match="ownedAttribute[@xmi:id='_oUmxsEQsEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_oUmxsEQsEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
</xsl:template>


<!-- To change the manufacturer-properties/manufacturer-name to optional-->
<xsl:template match="ownedAttribute[@xmi:id='_cC-A8EQsEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_cC-A8EQsEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
</xsl:template>

<!-- To change the manufacturer-properties/manufacturer-identifier to optional-->
<xsl:template match="ownedAttribute[@xmi:id='_VTQLMEQtEeasL6dcjI1vEA']">
    <xsl:copy>
      <xsl:apply-templates select="@*" />
      <lowerValue xmi:type="uml:LiteralInteger" xmi:id="_VTQLMEQtEeasL6dcjI1vEB" value="0" />
      <xsl:apply-templates select="node() | text()" />
    </xsl:copy>
</xsl:template>
</xsl:stylesheet>
