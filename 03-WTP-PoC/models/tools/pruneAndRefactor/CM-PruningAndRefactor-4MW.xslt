<?xml version="1.0" encoding="UTF-8"?>
<!-- A stylesheet to prune and refactor the ONF Core Model 1.1 for a configuration API between microwave devices and SDN-Controllers -->
<!-- Changes made on the ONF Core Model 1.1 
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
       - add yang key definitions according to keys.xml
-->
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:xmi="http://www.omg.org/spec/XMI/20131001" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmlns:OpenModel_Profile="http:///schemas/OpenModel_Profile/_0tU-YNyQEeW6C_FaABjU5w/14">
	<!-- output defintions -->
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no"/>
	<!-- key definitions -->
	<xsl:key name="openAttributeRef" match="OpenModel_Profile:OpenModelAttribute" use="@base_StructuralFeature"/>
	<xsl:key name="ownedAttributeRef" match="ownedAttribute" use="@xmi:id"/>
	<xsl:key name="keyRef" match="key" use="@base_StructuralFeature"/>
	<xsl:variable name="keyLookupDoc" select="document('keys.xml')"/>
	<xsl:variable name="thisLookupDoc" select="document('../input/CoreModel.uml')"/>
	<!-- tempates -->
	<xsl:template match="packagedElement[@xmi:type='uml:Package' and @name = 'ExplanatoryFiguresUsedIndDocumentsAndSlides' ]"/>
	<xsl:template match="packagedElement[@xmi:type='uml:Package' and @name = 'CoreModelEnhancements' ]"/>
	<xsl:template match="packagedElement[@xmi:type='uml:Package' and @name = 'TopologyPacs' ]"/>
	<xsl:template match="packagedElement[@xmi:type='uml:Enumeration' and @name = 'OperationalState' and fn:starts-with( ./ownedComment/body, 'OBSOLETE' )]"/>
	<xsl:template match="packagedElement[@xmi:type='uml:Enumeration' and @name = 'Directionality' and fn:starts-with( ./ownedComment/body, 'OBSOLETE' )]"/>
	<xsl:template match="ownedAttribute[@name = '_ltppList' and fn:starts-with( ./ownedComment/body, 'OBSOLETE' )]"/>
	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'SdnController' ]"/>
	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'NetworkControlDomain' ]"/>
	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'Link' ]"/>
	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'LinkPort' ]"/>
	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'FcRoute' ]"/>
	<xsl:template match="ownedAttribute[@name = '_nameAndValueAuthorityRef']"/>
	<xsl:template match="ownedAttribute[@name = '_globalClassRef']"/>
	<xsl:template match="ownedAttribute[@name = '_localClassRef']"/>
	<xsl:template match="ownedAttribute[@name = '_linkRefList']"/>
	<xsl:template match="ownedAttribute[@name = '_fcRouteRefList']"/>
	<xsl:template match="ownedAttribute[@name = '_configurationAndSwitchControlList']"/>
	<xsl:template match="ownedAttribute[@name = '_fcSpecRef']"/>
	<xsl:template match="ownedAttribute[@name = '_configurationAndSwitchControlRef']"/>
	<xsl:template match="ownedAttribute[@name = '_configurationAndSwitchControl']"/>
	<xsl:template match="ownedAttribute[@name = '_profileProxyRefList']"/>
	<xsl:template match="ownedAttribute[@name = '_ltpSpec']"/>
	<xsl:template match="ownedAttribute[@name = '_lpSpec']"/>
	<!-- 
    define type for CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::terminationState - set to Boolean -->
	<xsl:template match="ownedAttribute[@name = 'terminationState' ]">
		<xsl:copy>
			<xsl:apply-templates select="* | @* | text()"/>
			<type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#Boolean"/>
		</xsl:copy>
	</xsl:template>
	<!-- 
    define type for CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::configuredClientCapacity - set to String -->
	<xsl:template match="ownedAttribute[@name = 'configuredClientCapacity' ]">
		<xsl:copy>
			<xsl:apply-templates select="* | @* | text()"/>
			<type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
		</xsl:copy>
	</xsl:template>
	<!-- 
    add Q.822 to  CoreModel::CoreNetworkModule::TypeDefinitions  -->
	<!--
    add attribute uuid to CoreModel::CoreFoundationModule::SuperClassesAndCommonPackages::ObjectClasses::LocalClass used at yang key -->
	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'LocalClass' ]">
		<xsl:copy>
			<xsl:apply-templates select="* | @* | text() "/>
			<ownedAttribute xmi:type="uml:Property" xmi:id="_dCWWgOLVEeWM2vUDE3Xqhw" name="uuid" type="_SU3Q4I30EeO38ZmbECnvbg">
				<ownedComment xmi:type="uml:Comment" xmi:id="_qn2i4OLVEeWM2vUDE3Xqhw" annotatedElement="_dCWWgOLVEeWM2vUDE3Xqhw">
					<body>A global identifier for the LocalClass, which is used as reference.</body>
				</ownedComment>
			</ownedAttribute>
		</xsl:copy>
	</xsl:template>
	<!-- 
    add yang key definitions  -->
	<!-- ... for existing OpenModel_Profile:OpenModelAttribute -->
	<xsl:template match="OpenModel_Profile:OpenModelAttribute">
		<xsl:if test="key('ownedAttributeRef', @base_StructuralFeature)">
			<OpenModel_Profile:OpenModelAttribute>
				<xsl:copy-of select="@*"/>
				<xsl:if test="key('keyRef',  @base_StructuralFeature, $keyLookupDoc)">
					<xsl:attribute name="partOfObjectKey" select="1"/>
				</xsl:if>
			</OpenModel_Profile:OpenModelAttribute>
		</xsl:if>
	</xsl:template>
	<!-- ... for existing OpenModel_Profile:OpenModelAttribute -->
	<xsl:template match="/xmi:XMI">
		<xsl:copy>
			<xsl:apply-templates select="* | @* | text()"/>
			<xsl:for-each select="$keyLookupDoc/keys/key">
				<xsl:if test="fn:not( key('openAttributeRef', @base_StructuralFeature, $thisLookupDoc) )">
					<OpenModel_Profile:OpenModelAttribute xmi:id="{@id}" base_StructuralFeature="{@base_StructuralFeature}" partOfObjectKey="1"/>
				</xsl:if>
			</xsl:for-each>
		</xsl:copy>
	</xsl:template>
	<!-- 
    rename CoreModel to CoreModelForMicrowave 
	<xsl:template match="@name[. = 'CoreModel']">
		<xsl:attribute name="name">CoreModelForMicrowave</xsl:attribute>
	</xsl:template> -->
	<!-- 
    check for wrong charset  -->
	<xsl:template match="body">
		<xsl:variable name="data" select="."/>
		<xsl:variable name="analyse">
			<xsl:analyze-string select="." regex=".">
				<xsl:matching-substring>
					<xsl:choose>
						<xsl:when test="fn:string-to-codepoints(.) = 8220">
							<xsl:text>'</xsl:text>
						</xsl:when>
						<xsl:when test="fn:string-to-codepoints(.) = 8221">
							<xsl:text>'</xsl:text>
						</xsl:when>
						<xsl:when test="fn:string-to-codepoints(.) = 8211">
							<xsl:text>-</xsl:text>
						</xsl:when>
						<xsl:when test="fn:string-to-codepoints(.) > 128">
							<xsl:text>?</xsl:text>
							<xsl:message>
								<xsl:text>Char of code:  </xsl:text>
								<xsl:value-of select="fn:string-to-codepoints(.)"/>
								<xsl:text> not supported. Replaced by '?'. </xsl:text>
								<xsl:value-of select="$data"/>
							</xsl:message>
						</xsl:when>
					</xsl:choose>
				</xsl:matching-substring>
			</xsl:analyze-string>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$analyse = ''">
				<xsl:copy>
					<xsl:apply-templates select="* | @* | text() "/>
				</xsl:copy>
			</xsl:when>
			<xsl:otherwise>
				<body>
					<xsl:analyze-string select="." regex=".">
						<xsl:matching-substring>
							<xsl:choose>
								<xsl:when test="fn:string-to-codepoints(.) = 8220">
									<xsl:text>'</xsl:text>
								</xsl:when>
								<xsl:when test="fn:string-to-codepoints(.) = 8221">
									<xsl:text>'</xsl:text>
								</xsl:when>
								<xsl:when test="fn:string-to-codepoints(.) = 8211">
									<xsl:text>-</xsl:text>
								</xsl:when>
								<xsl:when test="fn:string-to-codepoints(.) > 128">
									<xsl:text>?</xsl:text>
									<xsl:message>
										<xsl:text>Char of code:  </xsl:text>
										<xsl:value-of select="fn:string-to-codepoints(.)"/>
										<xsl:text> not supported. Replaced by '?'. </xsl:text>
										<xsl:value-of select="$data"/>
									</xsl:message>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="."/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:matching-substring>
					</xsl:analyze-string>
				</body>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- 
    If not stated differently above, copy elements, as they are -->
	<xsl:template match="* | @* | text()">
		<xsl:copy>
			<xsl:apply-templates select="* | @* | text() "/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>

