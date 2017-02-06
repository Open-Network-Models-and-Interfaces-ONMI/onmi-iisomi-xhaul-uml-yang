<?xml version="1.0" encoding="UTF-8"?>
<!-- A stylesheet to prune and refactor the ONF Core Model 1.2 for a configuration API between microwave devices and SDN-Controllers -->
<!-- Changes made on the ONF Core Model 1.1 -> 1.2 
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
       - add attribute uuid to CoreModel::CoreFoundationModule::SuperClassesAndCommonPackages::ObjectClasses::LocalClass used at yang key
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
 -->
<xsl:stylesheet version="2.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:xs="http://www.w3.org/2001/XMLSchema" 
xmlns:fn="http://www.w3.org/2005/xpath-functions" 

xmlns:xmi="http://www.omg.org/spec/XMI/20131001" 
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xmlns:OpenModel_Profile="http:///schemas/OpenModel_Profile/_NDJbQJNqEeWP45fAG0gIqg/12" 
xmlns:RootElement="http:///schemas/RootElement/_7S2aYHpQEeaVjtpstJMDXA/37" 
xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore" 
xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" 
>
	<!-- output defintions -->
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no"/>
	<!-- key definitions -->
	<xsl:key name="openAttributeRef" match="OpenModel_Profile:OpenModelAttribute" use="@xmi:id"/>
	<xsl:key name="ownedAttributeRef" match="ownedAttribute" use="@xmi:id"/>
	<xsl:key name="keyRef" match="key" use="@base_StructuralFeature"/>
	<xsl:param name="tool">core-model</xsl:param>
	<xsl:variable name="keyLookupDoc" select="fn:document('keys.xml')"/>
	<xsl:variable name="thisLookupDoc" select="fn:document('../input/CoreModel.uml')"/>
	<!-- tempates -->
	<xsl:template match="packagedElement[@xmi:type='uml:Package' and @name = 'ExplanatoryFiguresUsedIndDocumentsAndSlides' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>
	<xsl:template match="packagedElement[@xmi:type='uml:Package' and @name = 'CoreModelEnhancements' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>
	<xsl:template match="packagedElement[@xmi:type='uml:Package' and @name = 'Topology' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>
	<xsl:template match="packagedElement[@xmi:type='uml:Package' and @name = 'Examples' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>
	<xsl:template match="packagedElement[@xmi:type='uml:Package' and @name = 'FruNonFruRules' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>
	<xsl:template match="packagedElement[@xmi:type='uml:Package' and @name = 'EquipmentToFunction' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>
	<xsl:template match="packagedElement[@xmi:type='uml:Package' and @name = 'EquipmentSpecification' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>
	<xsl:template match="packagedElement[@xmi:type='uml:Package' and @name = 'CoreSpecificationModel' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Enumeration' and @name = 'OperationalState' and fn:starts-with( ./ownedComment/body, 'OBSOLETE' )]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Enumeration' and @name = 'Directionality' and fn:starts-with( ./ownedComment/body, 'OBSOLETE' )]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="ownedAttribute[@name = '_ltppList' and fn:starts-with( ./ownedComment/body, 'OBSOLETE' )]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'SdnController' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'NetworkControlDomain' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'Link' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'LinkPort' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'FcRoute' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'Address' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'DesiredOutcomeConstraints' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'ElementConstraints' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'OutcomeElementConstraints' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'SpecificClassStructure' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'SpecificPattern' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'Ltp' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name = 'FdAndLinkRuleSet' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:Association' and @name = 'NcdControlsNes' ]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="ownedAttribute[@name = '_nameAndValueAuthorityRef']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="ownedAttribute[@name = '_globalClassRef']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="ownedAttribute[@name = '_localClassRef']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="ownedAttribute[@name = '_linkRefList']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="ownedAttribute[@name = '_fcRouteRefList']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="ownedAttribute[@name = '_configurationAndSwitchControlList']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="ownedAttribute[@name = '_fcSpecRef']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="ownedAttribute[@name = '_configurationAndSwitchControlRef']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="ownedAttribute[@name = '_configurationAndSwitchControl']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="ownedAttribute[@name = '_profileProxyRefList']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="ownedAttribute[@name = 'abortAfterDurationWithActionRule']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="ownedAttribute[@name = '_ownedMappingInteractionRule']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

	<xsl:template match="packagedElement[@xmi:type='uml:DataType' and @name = 'NameAndValue']/ownedAttribute[@name = '_nameAndValueAuthority' or @name = '_globalClass' or @name = '_localClass']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

    <xsl:template match="ownedAttribute[@name = '_port']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

    <xsl:template match="ownedAttribute[@name = '_address']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

    <xsl:template match="ownedAttribute[@name = '_desiredOutcomeConstraints']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

    <xsl:template match="ownedAttribute[@name = '_fdRuleSet']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

   <!-- modifications in equipement model -->
    <xsl:template match="ownedAttribute[@name = '_addressedByHolder']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

    <xsl:template match="ownedAttribute[@name = '_encapsulatedNonFru']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

    <xsl:template match="ownedAttribute[@name = '_nonFruSupportPosition']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

    <xsl:template match="ownedAttribute[@name = '_supportConstraints']">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

    <!-- remove spec model -->
    <xsl:template match="*[fn:ends-with(@name, 'Spec')]">
		<xsl:call-template name="removed">
			<xsl:with-param name="object" select="."/>
		</xsl:call-template>
    </xsl:template>

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
			<xsl:apply-templates select="* | @* | text()"/>
			<xsl:for-each select="$keyLookupDoc/keys/key">
				<xsl:if test="fn:not( key('openAttributeRef', @id, $thisLookupDoc) )">
					<OpenModel_Profile:OpenModelAttribute xmi:id="{@id}" base_StructuralFeature="{@base_StructuralFeature}" partOfObjectKey="{@value}"/>
				</xsl:if>
			</xsl:for-each>
		</xsl:copy>
	</xsl:template>
	<!-- 
    add feature names for "conditions" if not exists -->
    <!--
# In protection context if LTP of protection where entire LTP is to be excluded from use for protection.
# In protection context if server of protection where entire server is to be excluded from use for protection.
# In protection context if server of protection where entire server is to be excluded from use for protection.
# In protection context where the FcPort is to be excluded from use for protection.
    -->
	<xsl:template match="@condition">
        <xsl:attribute name="condition"> 
        <xsl:for-each select="fn:tokenize(.,'&#xD;')">
            <xsl:choose>
                <xsl:when test="position() eq 1 and fn:starts-with(., 'In protection context if LTP')">
                    <xsl:text>protection-exclude-ltp&#xD;</xsl:text>
                </xsl:when>
                <xsl:when test="position() eq 1 and fn:starts-with(., 'In protection context if server')">
                    <xsl:text>protection-exclude-server&#xD;</xsl:text>
                </xsl:when>
                <xsl:when test="position() eq 1 and fn:starts-with(., 'In protection context where the FcPort')">
                    <xsl:text>protection-exclude-fc-port&#xD;</xsl:text>
                </xsl:when>
            </xsl:choose>
        </xsl:for-each>
        <xsl:value-of select="."/>
        </xsl:attribute>
	</xsl:template>
    <!-- 
    correct CoreModel::CoreFoundationModel::StateModel::ObjectClasses::State_Pac::adminsatratveState -> administrativeState -->
    <xsl:template match="ownedAttribute[@name = 'adminsatratveState' ]">
      <xsl:copy>
        <xsl:apply-templates select="@*"/>
        <xsl:attribute name="name">administrativeState</xsl:attribute>
        <xsl:apply-templates select="* | text()"/>
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
	<xsl:template match="*" mode="ancestor">
        <xsl:for-each select="ancestor::*">
            <xsl:value-of select="@name" />
            <xsl:text>/</xsl:text>
        </xsl:for-each>	
	</xsl:template>
	<!-- functions -->
	<xsl:template name="removed">
		<xsl:param name="object"></xsl:param>
		<xsl:call-template name="log">
			<xsl:with-param name="message">
                <xsl:for-each select="0 to xs:integer(fn:string-length('packagedElement') - fn:string-length(fn:name($object)) - 1)">
                    <xsl:text> </xsl:text>
                </xsl:for-each>
                <xsl:value-of select="fn:name($object)" />
                <xsl:text>: </xsl:text>
                <xsl:apply-templates select="$object" mode="ancestor" />
                <xsl:value-of select="$object/@name" />
                <xsl:text> removed!</xsl:text>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:template>
	<xsl:template name="setAsKey">
		<xsl:param name="object"></xsl:param>
		<xsl:call-template name="log">
			<xsl:with-param name="message">
                <xsl:for-each select="0 to xs:integer(fn:string-length('packagedElement') - fn:string-length(fn:name($object)) - 1)">
                    <xsl:text> </xsl:text>
                </xsl:for-each>
                <xsl:value-of select="fn:name($object)" />
                <xsl:text>: </xsl:text>
                <xsl:apply-templates select="$object" mode="ancestor" />
                <xsl:value-of select="$object/@name" />
                <xsl:text> set as key!</xsl:text>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:template>
	<xsl:template name="log">
		<xsl:param name="level">INFO </xsl:param>
		<xsl:param name="message"/>
		<xsl:message>
			<xsl:sequence select="fn:string(fn:adjust-dateTime-to-timezone(xs:dateTime( fn:current-dateTime() ), xs:dayTimeDuration('PT0H') ) )"/>
			<xsl:text> | </xsl:text>
			<xsl:value-of select="$tool"/>
			<xsl:text> | </xsl:text>
			<xsl:value-of select="$level"/>
			<xsl:text> | </xsl:text>
			<xsl:value-of select="$message"/>
		</xsl:message>
	</xsl:template>

</xsl:stylesheet>

