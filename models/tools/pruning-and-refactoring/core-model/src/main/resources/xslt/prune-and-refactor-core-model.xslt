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
       - rename CoreModel to CoreNetworkFunction (reverted)
       - add OpenModelStatement
       - add Rootelement steriotype to ControlConstruct
       - add generalization to GlobalClass from CascPort
       - avoiding naming confilcts for class and data-type "Address"
       - modify type for CoreModel::CoreNetworkModule::ObjectClasses::GlobalClass::localId - set to String
       - modify type for LayerProtocol::layerProtocolName - set to extensible ENUM
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
<xsl:stylesheet version="2.0" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:OpenModel_Profile="http:///schemas/OpenModel_Profile/_aG1hkAPxEeewDI5jM-81FA/21" xmlns:OpenInterfaceModel_Profile="http:///schemas/OpenInterfaceModel_Profile/_YFPa8LptEeiytveF7IdLXg/9" xmlns:RootElement="http:///schemas/RootElement/_B4YnAGFbEeeiJ9-h1KDHig/45" xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmlns:xmi="http://www.omg.org/spec/XMI/20131001" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" exclude-result-prefixes="fn onap">
  <!-- imports -->
  <xsl:import href="./global-functions.xslt"/>
  <!-- output defintions -->
  <xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no"/>
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
 

  <!-- rename CoreModel to CoreNetworkFunctions 
  <xsl:template match="@name[. = 'CoreModel']" >
    <xsl:attribute name="name">CoreNetworkFunction</xsl:attribute>
  </xsl:template>-->
  <!-- add high-level description and centralized TypeDefinitions-->
  <xsl:template match="uml:Package[@xmi:id = '_oGqilVLNEeO75dO39GbF8Q']" >
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <ownedComment xmi:type="uml:Comment" xmi:id="_uHEawDdIEeOHDrwRRcUeVQ" annotatedElement="../@xmi:id">
        <body>This module contains a collection of YANG definitions for management and control of network fuctions.</body>
      </ownedComment>
      <packagedElement xmi:type="uml:Package" xmi:id="core-model-type-definitions" name="TypeDefinitions">
        <xsl:apply-templates select="//packagedElement[@xmi:type='uml:Package' and @name='TypeDefinitions']/node()"/>
      </packagedElement>
      <xsl:apply-templates select="node() | text()"/>
    </xsl:copy>
  </xsl:template>
  <!-- 
     add reference to uml, for ownedAttributes, in case no comment is provided by UML -->
  <xsl:template match="ownedAttribute[fn:not(ownedComment) and fn:not(fn:key('prunedElementById', @xmi:id, $pruningLookupDoc)/@prune = fn:true())]">
    <xsl:copy>
      <xsl:apply-templates select="* | @*[fn:not(fn:name(.) = 'type')] | text()"/>
      <ownedComment xmi:type="uml:Comment" xmi:id="{fn:generate-id(.)}" annotatedElement="{../@xmi:id}">
        <body>
          <xsl:text>Please add a comment to UML.</xsl:text>
          <xsl:call-template name="addUmlReference">
            <xsl:with-param name="node" select="."/>
            <xsl:with-param name="visible" select="fn:true()"/>
          </xsl:call-template>
        </body>
      </ownedComment>
    </xsl:copy>
  </xsl:template>
  <!-- 
     modify type for CoreModel::CoreNetworkModule::ObjectClasses::GlobalClass::localId - set to String -->
  <xsl:template match="ownedAttribute[@name = 'localId' ]" >
    <xsl:copy>
      <xsl:apply-templates select="* | @*[fn:not(fn:name(.) = 'type')] | text()"/>
      <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
    </xsl:copy>
  </xsl:template>
  <!-- 
    modify type for LayerProtocol::layerProtocolName - set to extensible ENUM -->
  <xsl:template match="ownedAttribute[@name = 'layerProtocolName' ]" >
    <xsl:copy>
<xsl:attribute name="type">_MbUkMIQ4EeiXzpgfQWpR-Q</xsl:attribute>
      <xsl:apply-templates select="*[fn:not(fn:name(.) = 'type')] | @* | text()"/>
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
      <OpenModel_Profile:OpenModelStatement xmi:id="{@xmi:id}-open-model-statement" base_Model="{@xmi:id}" namespace="urn:onf:yang:core-network-function" organization="Open Networking Foundation (ONF)" description="This model defines a technology agnostic core model for network functions." copyright="Copyright 2019 Open Networking Foundation (ONF). All rights reserved." license="Licensed under the Apache License, Version 2.0 (the &#34;License&#34;);&#xA;you may not use this file except in compliance with the License.&#xA;You may obtain a copy of the License at&#xA;&#xA;    http://www.apache.org/licenses/LICENSE-2.0&#xA;&#xA;Unless required by applicable law or agreed to in writing, software&#xA;distributed under the License is distributed on an &#34;AS IS&#34; BASIS,&#xA;WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.&#xA;See the License for the specific language governing permissions and&#xA;limitations under the License.">
        <contact xmi:type="OpenModel_Profile:Contact" xmi:id="onf-core-nf-contact" projectWeb="https://wiki.opennetworking.org/pages/viewpage.action?pageId=262963204" projectEmail="&lt;mailto:information-modeling@opennetworking.org&gt;" editorName="Nigel Davis" editorEmail="&lt;mailto:ndavis@ciena.com&gt;"/>
        <revision xmi:type="OpenModel_Profile:Revision" xmi:id="onf-core-nf-revision-2019-05-25" date="2019-05-25" version="v1.4" description="Initial version derived from ONF-TR-512 v1.4" changeLog="https://github.com/OpenNetworkingFoundation/5G-xHaul/tree/experimental/models/tools" additionalChanges="Additional manual changes" reference="ONF-TR-512, RFC 6020 and RFC 6087"/>
        <revision xmi:type="OpenModel_Profile:Revision" xmi:id="onf-core-nf-revision-2019-05-05" date="2019-05-05" version="v0.0" description="Initial version" changeLog="https://github.com/OpenNetworkingFoundation/5G-xHaul/tree/experimental/models/tools" additionalChanges="Initial version" reference="ONF-TR-512, RFC 6020 and RFC 6087"/>
      </OpenModel_Profile:OpenModelStatement>
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
        <xsl:with-param name="visible" select="fn:true()"/>
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
  </xsl:stylesheet>
