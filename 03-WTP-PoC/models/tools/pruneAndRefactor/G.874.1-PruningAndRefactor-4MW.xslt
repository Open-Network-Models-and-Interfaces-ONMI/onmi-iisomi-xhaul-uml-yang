<?xml version="1.0" encoding="UTF-8"?>
<!-- A stylesheet to prune and refactor the G.874.1 Model for a configuration API between microwave devices and SDN-Controllers -->
<!-- Changes made on the G.874.1 Model
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
-->
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:xmi="http://www.omg.org/spec/XMI/20131001" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmlns:OpenModel_Profile="http:///schemas/OpenModel_Profile/_0tU-YNyQEeW6C_FaABjU5w/14">
	<!-- output definitions -->
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no"/>
	<!-- key definitions -->
	<xsl:key name="ownedAttributeRef" match="ownedAttribute" use="@xmi:id"/>
	<xsl:key name="openModelAttributeRef" match="OpenModel_Profile:OpenModelAttribute" use="@base_StructuralFeature"/>
	<!-- templates -->
	<xsl:template match="packagedElement[@xmi:type='uml:Class' and @name!='«X.721» Top' and @name!='«X.739» Scanner'  and @name!='«Q.822» CurrentData'  and @name!='«Q.822» HistoryData'  and @name!='OTN_CurrentData'  and @name!='OTN_HistoryData' ]"/>
	<xsl:template match="packagedElement[@xmi:type='uml:Package' and @name = 'OperationExceptions']"/>
	<xsl:template match="ownedAttribute[@name = 'packages']"/>
	<xsl:template match="ownedAttribute[@name = 'allomorphs']"/>
	<xsl:template match="ownedAttribute[fn:starts-with(@name, '«q.822» ') and fn:ends-with(@name, 'pkg')]"/>
	<xsl:template match="ownedAttribute[fn:starts-with(@name, '«q.822» ') and fn:ends-with(@name, 'pkg ')]"/>
  <xsl:template match="ownedAttribute[@name = 'linkType']"/>
  <xsl:template match="ownedAttribute[@name = 'operationalState']"/>
	<xsl:template match="packagedElement[@xmi:type='uml:Enumeration' and fn:starts-with(@name, 'ODU')]"/>
	<xsl:template match="packagedElement[@xmi:type='uml:Enumeration' and fn:starts-with(@name, 'OCh')]"/>
	<xsl:template match="packagedElement[@xmi:type='uml:Enumeration' and fn:starts-with(@name, 'OMS')]"/>
	<xsl:template match="packagedElement[@xmi:type='uml:DataType' and fn:starts-with(@name, 'ODU')]"/>
	<xsl:template match="packagedElement[@xmi:type='uml:DataType' and fn:starts-with(@name, 'OCh')]"/>
  <xsl:template match="packagedElement[@xmi:type='uml:DataType' and fn:starts-with(@name, 'OMS')]"/>
  <xsl:template match="packagedElement[@xmi:type='uml:DataType' and fn:starts-with(@name, 'OTM')]"/>
  <xsl:template match="packagedElement[@xmi:type='uml:DataType' and @name = 'ApplicationIdentifier']"/>
  <xsl:template match="packagedElement[@xmi:type='uml:DataType' and @name = 'DegThr']"/>
  <xsl:template match="packagedElement[@xmi:type='uml:DataType' and @name = 'NominalCentralFrequencyOrWavelength']"/>
  <xsl:template match="packagedElement[@xmi:type='uml:DataType' and @name = 'UasChoice']"/>

  <!-- 
    define type for G.874.1-model::Imported Information Object Classes::X.739::«X.739» Scanner::scannerId - set to UML:String -->
  <xsl:template match="ownedAttribute[@name = 'scannerId' ]">
    <xsl:copy>
      <xsl:apply-templates select="* | @* | text()"/>
      <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
    </xsl:copy>
  </xsl:template>
  <!-- 
    define type for G.874.1-model::Imported Information Object Classes::Q.822::«Q.822» HistoryData::historyDataId - set to UML:String -->
  <xsl:template match="ownedAttribute[@name = 'historyDataId' ]">
    <xsl:copy>
      <xsl:apply-templates select="* | @* | text()"/>
      <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
    </xsl:copy>
  </xsl:template>
  <!-- 
    define type for G.874.1-model::Imported Information Object Classes::X.739::«X.739» Scanner::administrativeState - set to ONF:AdministrativeState -->
  <xsl:template match="ownedAttribute[@name = 'administrativeState' ]">
    <xsl:copy>
      <xsl:apply-templates select="* | @* | text()"/>
      <type xmi:type="uml:DataType" href="../OnfModel-CoreModel/CoreModel.uml#_KSKOYLEuEeSZUdYfPSdgew"/>
    </xsl:copy>
  </xsl:template>
  <!-- 
    define type for G.874.1-model::Imported Information Object Classes::Q.822::«Q.822» HistoryData::periodEndTime - set to ONF:DateAndTime -->
  <xsl:template match="ownedAttribute[@name = 'periodEndTime' ]">
    <xsl:copy>
      <xsl:apply-templates select="* | @* | text()"/>
      <type xmi:type="uml:DataType" href="../OnfModel-CoreModel/CoreModel.uml#_oGqi1lLNEeO75dO39GbF8Q"/>
    </xsl:copy>
  </xsl:template>
  <!-- 
    define type for G.874.1-model::Imported Information Object Classes::Q.822::«Q.822» CurrentData::elapsedTime - set to Integer -> TODO: Units 's' -->
  <xsl:template match="ownedAttribute[@name = 'elapsedTime' ]">
    <xsl:copy>
      <xsl:apply-templates select="* | @* | text()"/>
      <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#Integer"/>
    </xsl:copy>
  </xsl:template>
  <!-- 
    define type for G.874.1-model::Imported Information Object Classes::X.739::«X.739» Scanner::granularityPeriod - set to ENUM ::= {15min, 24h} -->
  <xsl:template match="ownedAttribute[@name = 'granularityPeriod' ]">
      <ownedAttribute xmi:type="uml:Property" xmi:id="_M8IDWseIEeSfd5vyUJsimg" name="granularityPeriod" visibility="public" type="_Y6WUEEamEeabNPX3o7rjtw"/>
  </xsl:template>
  <xsl:template match="packagedElement[@xmi:type='uml:Package' and @name = 'Type Definitions']">
    <xsl:copy>
      <xsl:apply-templates select="* | @* | text()"/>
      <packagedElement xmi:type="uml:Enumeration" xmi:id="_Y6WUEEamEeabNPX3o7rjtw" name="GranularityPeriodType">
        <ownedComment xmi:type="uml:Comment" xmi:id="_Y6WUEUamEeabNPX3o7rjtw" annotatedElement="_Y6WUEEamEeabNPX3o7rjtw">
           <body>The enumeration with the options for granularity period of the performance data.</body>
        </ownedComment>
        <ownedLiteral xmi:type="uml:EnumerationLiteral" xmi:id="_Y6WUFEamEeabNPX3o7rjtw" name="UNKNOWN"/>
        <ownedLiteral xmi:type="uml:EnumerationLiteral" xmi:id="_Y6WUEkamEeabNPX3o7rjtw" name="PERIOD_15MIN"/>
        <ownedLiteral xmi:type="uml:EnumerationLiteral" xmi:id="_Y6WUE0amEeabNPX3o7rjtw" name="PERIOD_24HOURS"/>
      </packagedElement>
    </xsl:copy>
  </xsl:template>
	<!-- 
    use attribute G.874.1-model::Imported Information Object Classes::X.739::«X.739» Scanner::scannerId as yang key  -->
	<xsl:template match="OpenModel_Profile:OpenModelAttribute">
		<xsl:message>why not here?</xsl:message>
	</xsl:template>
	<!-- 
    check for wrong charset  -->
	<xsl:template match="body">
		<xsl:variable name="data" select="."/>
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
	</xsl:template>
	<!-- 
    If not stated differently above, copy elements, as they are -->
	<xsl:template match="* | @* | text()">
		<xsl:choose>
			<xsl:when test="fn:name(.) = 'OpenModel_Profile:OpenModelAttribute'">
				<xsl:variable name="name" select="key('ownedAttributeRef', @base_StructuralFeature)/@name"/>
				<OpenModel_Profile:OpenModelAttribute>
					<xsl:copy-of select="@*"/>
					<xsl:if test="$name = 'scannerId' or $name = 'historyDataId' ">
						<xsl:attribute name="partOfObjectKey" select="1"/>
					</xsl:if>
				</OpenModel_Profile:OpenModelAttribute>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy>
					<xsl:apply-templates select="* | @* | text() "/>
				</xsl:copy>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
