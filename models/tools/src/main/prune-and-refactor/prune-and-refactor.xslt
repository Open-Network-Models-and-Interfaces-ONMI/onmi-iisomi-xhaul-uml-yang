<?xml version="1.0" encoding="UTF-8"?>
<!-- A stylesheet to prune and refactor the ONF Core Model 1.3 for a southbound API between communication devices and SDN-Controllers -->
<!-- Martin Skorupski. Copyright (c) 2017, higshtreet technologies GmbH -->
<!-- 
Changes made on the ONF Core Model v1.3        

-->
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:xmi="http://www.omg.org/spec/XMI/20131001" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmlns:OpenModel_Profile="http:///schemas/OpenModel_Profile/_aG1hkAPxEeewDI5jM-81FA/21" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:RootElement="http:///schemas/RootElement/_B4YnAGFbEeeiJ9-h1KDHig/45">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no"/>
	<xsl:param name="tool">core-model</xsl:param>
	<xsl:variable name="keyLookupDoc" select="fn:document('keys.xml')"/>
	<xsl:variable name="packagesBlackListLookupDoc" select="fn:document('packagesBlackList.xml')"/>
	<xsl:variable name="classesWithoutKeyLookupDoc" select="fn:document('classesWithoutKey.xml')"/>
	<xsl:variable name="removedLookupDoc" select="fn:document('removed.xml')"/>
	<!-- keys -->
	<xsl:key name="keyRef" match="key" use="@base_StructuralFeature"/>
	<xsl:key name="packageRef" match="package" use="@ref"/>
	<xsl:key name="deprecatedRef" match="OpenModel_Profile:Deprecated" use="@base_Element"/>
	<xsl:key name="classesWithoutKeyRef" match="class" use="@name"/>
	<xsl:key name="removedClassByNameRef" match="class" use="@name"/>
	<xsl:key name="removedAttributeByNameRef" match="ownedAttribute" use="@name"/>
	<xsl:key name="removedAttributeByIdRef" match="ownedAttribute" use="@id"/>
	<xsl:key name="removedEnumerationByNameRef" match="enumeration" use="@name"/>
	<!-- templates -->
	<xsl:template match="uml:Package">
		<uml:Package>
			<xsl:apply-templates select="@*"/>
			<ownedComment xmi:type="uml:Comment" xmi:id="prune-and-refactor-0000" annotatedElement="{@xmi:id}">
				<body>This module contains a collection of YANG definitions for managing a single control component, such as wireless, RAN, IoT and other devices.</body>
			</ownedComment>
			<xsl:apply-templates select="*"/>
		</uml:Package>
	</xsl:template>
	<!-- removals -->
	<xsl:template match="packagedElement[@xmi:type='uml:Package']">
		<xsl:choose>
			<xsl:when test="key('packageRef', @name, $packagesBlackListLookupDoc)">
				<!-- remove package, if part of black list -->
				<xsl:call-template name="removed">
					<xsl:with-param name="object" select="."/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<!-- copy package -->
				<xsl:copy>
					<xsl:apply-templates select="@* | * | text()"/>
				</xsl:copy>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>	
	<!-- define missing types -->
	<xsl:template match="ownedAttribute[@name = 'profileProxyMode' ]">
		<xsl:copy>
			<xsl:apply-templates select="* | @* | text()"/>
			<type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#Integer"/>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="ownedAttribute[@name = 'signalProperty' ]">
		<xsl:copy>
			<xsl:attribute name="type">_JMSg8JwzEea1Nbypr6RfLw</xsl:attribute>
			<xsl:apply-templates select="* | @* | text()"/>
		</xsl:copy>
	</xsl:template>
	<!-- modify types -->
	<xsl:template match="ownedAttribute[@xmi:id = '_RMJegI22EeO38ZmbECnvbg' ]">
		<!-- LocalClass::localId from Name to String -->
		<xsl:copy>
			<xsl:apply-templates select="*[fn:name() != 'lowerValue' and fn:name(.) != 'upperValue'] | @*[ fn:name(.) != 'type'] | text()"/>
			<type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="ownedAttribute[@xmi:id = '_HbgJsERYEeasL6dcjI1vEA' ]">
		<!-- Conector::Position from Postiion to String, due to './project/core-model.yang:2227: error: circular dependency for leafref "/core-model:connector/core-model:position"'-->
		<xsl:copy>
			<xsl:apply-templates select="*[fn:name() != 'lowerValue' and fn:name(.) != 'upperValue'] | @*[ fn:name(.) != 'type'] | text()"/>
			<type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="ownedAttribute[@xmi:id = '_um5noERXEeasL6dcjI1vEA' ]">
		<!-- Conector::Position from Postiion to String, due to './project/core-model.yang:2227: error: circular dependency for leafref "/core-model:connector/core-model:position"'-->
		<xsl:copy>
			<xsl:apply-templates select="*[fn:name() != 'lowerValue' and fn:name(.) != 'upperValue'] | @*[ fn:name(.) != 'type'] | text()"/>
			<type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="ownedAttribute[@xmi:id = '_sTeXw0ddEeasL6dcjI1vEA' ]">
		<!-- Conector::Position from Postiion to String, due to './project/core-model.yang:2227: error: circular dependency for leafref "/core-model:connector/core-model:position"'-->
		<xsl:copy>
			<xsl:apply-templates select="*[fn:name() != 'lowerValue' and fn:name(.) != 'upperValue'] | @*[ fn:name(.) != 'type'] | text()"/>
			<type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="ownedAttribute[@xmi:id = '_4DkhskddEeasL6dcjI1vEA' ]">
		<!-- Conector::Position from Postiion to String, due to './project/core-model.yang:2227: error: circular dependency for leafref "/core-model:connector/core-model:position"'-->
		<xsl:copy>
			<xsl:apply-templates select="*[fn:name() != 'lowerValue' and fn:name(.) != 'upperValue'] | @*[ fn:name(.) != 'type'] | text()"/>
			<type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
		</xsl:copy>
	</xsl:template>
<!-- others -->
	<xsl:template match="OpenModel_Profile:Deprecated">
		<!-- output must not have deprecated things - (unsually) they are removed -->
	</xsl:template>
	<!--     add yang key definitions  -->
	<xsl:template match="OpenModel_Profile:OpenModelAttribute">
		<xsl:copy>
			<xsl:apply-templates select="@* | * | text()"/>
			<xsl:if test="key('keyRef', @base_StructuralFeature, $keyLookupDoc)">
				<xsl:attribute name="partOfObjectKey"><xsl:value-of select="key('keyRef', @base_StructuralFeature, $keyLookupDoc)/@value"/></xsl:attribute>
			</xsl:if>
		</xsl:copy>
	</xsl:template>
	<!-- functions -->
	<xsl:template name="removed">
		<xsl:param name="object"/>
		<xsl:call-template name="log">
			<xsl:with-param name="message">
				<xsl:for-each select="0 to xs:integer(fn:string-length('packagedElement') - fn:string-length(fn:name($object)) - 1)">
					<xsl:text> </xsl:text>
				</xsl:for-each>
				<xsl:value-of select="fn:name($object)"/>
				<xsl:text>: </xsl:text>
				<xsl:apply-templates select="$object" mode="ancestor"/>
				<xsl:value-of select="$object/@name"/>
				<xsl:text> removed!</xsl:text>
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
	<xsl:template match="*" mode="ancestor">
		<xsl:for-each select="ancestor::*">
			<xsl:value-of select="@name"/>
			<xsl:text>/</xsl:text>
		</xsl:for-each>
	</xsl:template>
	<xsl:template match="@* | * | text()">
		<xsl:choose>
			<xsl:when test="@xmi:type='uml:Class' and fn:not( ownedAttribute ) and fn:not( generalization )">
				<!-- removed classes with no attaibues, attributes refering to this class as type, will be of type string -->
				<xsl:call-template name="removed">
					<xsl:with-param name="object" select="."/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="key('removedClassByNameRef', @name, $removedLookupDoc)"> 
				<!-- removed classes with no attaibues, attributes refering to this class as type, will be of type string -->
				<xsl:call-template name="removed">
					<xsl:with-param name="object" select="."/>
				</xsl:call-template>
			</xsl:when>

			<xsl:when test="key('deprecatedRef', @xmi:id)">
				<!-- removedd, because deprecated -->
				<xsl:call-template name="removed">
					<xsl:with-param name="object" select="."/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="key('classesWithoutKeyRef', @name, $classesWithoutKeyLookupDoc)">
				<!-- classes without key attribute - geralization for GlobalClass added. The GlobalClass::uuid becomes the key attribute -->
				<xsl:copy>
					<xsl:apply-templates select="@* | * | text()"/>
					<generalization xmi:type="uml:Generalization" xmi:id="{fn:generate-id(.)}" general="_iVJ1kI2wEeO38ZmbECnvbg" marked="marked"/>
				</xsl:copy>
			</xsl:when>

			<xsl:when test="key('removedAttributeByNameRef', @name, $removedLookupDoc)"> 
				<!-- removed classes with no attaibues, attributes refering to this class as type, will be of type string -->
				<xsl:call-template name="removed">
					<xsl:with-param name="object" select="."/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="key('removedAttributeByIdRef', @xmi:id, $removedLookupDoc)"> 
				<!-- removed classes with no attaibues, attributes refering to this class as type, will be of type string -->
				<xsl:call-template name="removed">
					<xsl:with-param name="object" select="."/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="@xmi:type='uml:Enumeration' and key('removedEnumerationByNameRef', @name, $removedLookupDoc)"> 
				<!-- removed classes with no attaibues, attributes refering to this class as type, will be of type string -->
				<xsl:call-template name="removed">
					<xsl:with-param name="object" select="."/>
				</xsl:call-template>
			</xsl:when>


			<xsl:otherwise>
				<xsl:copy>
					<xsl:apply-templates select="@* | * | text()"/>
				</xsl:copy>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
