<?xml version="1.0" encoding="UTF-8"?>
<!-- Changes made on the mircoware.uml 
    - remove Package: AssociationToCore
    - add feature names for "conditions" if not exists
-->
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:xmi="http://www.omg.org/spec/XMI/20131001" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmlns:OpenModel_Profile="http:///schemas/OpenModel_Profile/_NDJbQJNqEeWP45fAG0gIqg/12">
	<!-- output defintions -->
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no"/>
	<!-- parameter -->
	<xsl:param name="tool">  p+r-mwim</xsl:param>
	<xsl:param name="showObsolete">false</xsl:param>
	<xsl:variable name="lookupDoc" select="fn:document('PriorityLookup.xml')"/>
	<xsl:variable name="previousLookupDoc" select="fn:document('../input/previousMicrowaveModel.uml')"/>
	<!-- keys -->
	<xsl:key name="attributePriority" match="attribute" use="@id"/>
	<xsl:key name="classPriority" match="class" use="@id"/>
	<xsl:key name="attRef" match="ownedAttribute" use="@xmi:id"/>
	<xsl:key name="idRef" match="*" use="@xmi:id"/>
	<xsl:key name="obsoleteRefs" match="OpenModel_Profile:Obsolete" use="@base_Element"/>
    <!-- templates -->
	<xsl:template match="packagedElement[ @xmi:type = 'uml:Signal' ]">
		<xsl:if test="$showObsolete = 'true' or fn:not( key('obsoleteRefs', @xmi:id) )">
			<xsl:call-template name="log">
				<xsl:with-param name="message">
					<xsl:value-of select="@name"/>
				</xsl:with-param>
			</xsl:call-template>
			<xsl:copy>
				<xsl:apply-templates select="* | @* | text()"/>
			</xsl:copy>
		</xsl:if>
	</xsl:template>
	<xsl:template match="packagedElement[ @xmi:type = 'uml:Enumeration' ]">
		<xsl:if test="$showObsolete = 'true' or fn:not( key('obsoleteRefs', @xmi:id) )">
			<xsl:call-template name="log">
				<xsl:with-param name="message">
					<xsl:value-of select="@name"/>
				</xsl:with-param>
			</xsl:call-template>
			<xsl:copy>
				<xsl:apply-templates select="* | @* | text()"/>
			</xsl:copy>
		</xsl:if>
	</xsl:template>
	<xsl:template match="packagedElement[ @xmi:type = 'uml:DataType' ]">
		<xsl:if test="$showObsolete = 'true' or fn:not( key('obsoleteRefs', @xmi:id) )">
			<xsl:call-template name="log">
				<xsl:with-param name="message">
					<xsl:value-of select="@name"/>
				</xsl:with-param>
			</xsl:call-template>
			<xsl:copy>
				<xsl:apply-templates select="* | @* | text()"/>
			</xsl:copy>
		</xsl:if>
	</xsl:template>
	<xsl:template match="packagedElement[ @xmi:type = 'uml:Class' ]">
		<xsl:if test="$showObsolete = 'true' or fn:not( key('obsoleteRefs', @xmi:id) )">
			<xsl:call-template name="log">
				<xsl:with-param name="message">
					<xsl:value-of select="@name"/>
				</xsl:with-param>
			</xsl:call-template>
			<xsl:copy>
				<xsl:apply-templates select="* | @* | text()"/>
			</xsl:copy>
		</xsl:if>
	</xsl:template>
	<xsl:template match="ownedAttribute">
		<xsl:choose>
			<xsl:when test="$showObsolete = 'true' or fn:not( key('obsoleteRefs', @xmi:id) )">
				<xsl:call-template name="log">
					<xsl:with-param name="message">
						<xsl:text>- </xsl:text>
						<xsl:value-of select="@name"/>
						<xsl:text> (</xsl:text>
						<xsl:value-of select="../@name"/>
						<xsl:text>) </xsl:text>
					</xsl:with-param>
				</xsl:call-template>
				<xsl:copy>
					<xsl:apply-templates select="* | @* | text()"/>
				</xsl:copy>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="log">
					<xsl:with-param name="message">
						<xsl:text>----------------</xsl:text>
						<xsl:value-of select="@name"/>
						<xsl:text> (</xsl:text>
						<xsl:value-of select="../@name"/>
						<xsl:text>) </xsl:text>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="fn:count( key('obsoleteRefs', @xmi:id) ) &gt; 1">
			<xsl:call-template name="log">
				<xsl:with-param name="message">
					<xsl:text>############## </xsl:text>
					<xsl:value-of select="@name"/>
					<xsl:text> </xsl:text>
					<xsl:value-of select="@xmi:id"/>
					<xsl:text> (</xsl:text>
					<xsl:value-of select="../@name"/>
					<xsl:text>) </xsl:text>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>
	<xsl:template match="packagedElement[ @xmi:type = 'uml:Package']">
        <xsl:choose>
		<xsl:when test="@name = 'AssociationToCore'" />
		<xsl:when test="@name = 'ExplanatoryOnly'" />
		<xsl:when test="$showObsolete = 'true' or fn:not( key('obsoleteRefs', @xmi:id) )">
			<xsl:call-template name="log">
				<xsl:with-param name="message">
					  <xsl:value-of select="@name"/> 
				</xsl:with-param>
			</xsl:call-template>
			<xsl:copy>
				<xsl:apply-templates select="* | @* | text()"/>
			</xsl:copy>
		</xsl:when>
        </xsl:choose>
	</xsl:template>
	<!-- 
    add feature names for "conditions" if not exists -->
	<xsl:template match="@condition">
        <xsl:variable name="apos" select="&quot;'&quot;"/>
        <xsl:attribute name="condition"> 
        <xsl:for-each select="fn:tokenize(.,'&#xD;')">
            <xsl:choose>
                <xsl:when test="position() eq 1 and fn:starts-with(., fn:concat('Feature ', $apos))">
                    <xsl:for-each select="fn:tokenize(., $apos)">
                        <xsl:if test="position() eq 2">
                            <xsl:sequence select="."/>
                            <xsl:text>&#xD;</xsl:text>
                        </xsl:if>
                    </xsl:for-each>
                </xsl:when>
            </xsl:choose>
        </xsl:for-each>
        <xsl:value-of select="."/>
        </xsl:attribute>
	</xsl:template>
	<!-- add high-level description -->
	<xsl:template match="uml:Model">
		<xsl:copy>
			<xsl:apply-templates select="@*"/>
                <ownedComment xmi:type="uml:Comment" xmi:id="_uHEawDdIEeOHDrwRRcUeVQ" annotatedElement="../@xmi:id">
                    <body>This module contains a collection of YANG definitions for managing wireless networks.</body>
                </ownedComment>
			<xsl:apply-templates select="* | text()"/>
		</xsl:copy>
	</xsl:template>
	<!-- ensure that "missing" default values are added from the previous uml  -->
	<xsl:template match="defaultValue">
		<xsl:copy>
            <xsl:choose>
                <xsl:when test="@xmi:id = '_1j9zMLiREeaQVsjMEL9uqw'">
                    <xsl:attribute name="value">disabled</xsl:attribute>
                </xsl:when>
                <xsl:when test="@xmi:id = '_bjYFYNmFEeWNurTV5r0nnA'">
                    <xsl:attribute name="value">0</xsl:attribute>
                </xsl:when>
                <xsl:when test="key('idRef', @instance)/@name">
                    <xsl:attribute name="value"><xsl:value-of select="fn:replace( fn:lower-case( key('idRef', @instance)/@name), '_', '-' )"></xsl:value-of></xsl:attribute>
                </xsl:when>
                <xsl:when test="fn:not(@value) and fn:not(key('idRef', @instance)/@name) and fn:not( key('idRef', @xmi:id, $previousLookupDoc)/@value and @xmi:type = 'uml:LiteralBoolean' )">
                    <xsl:attribute name="value">false</xsl:attribute>
                </xsl:when>
            </xsl:choose>
			<xsl:apply-templates select="* | @* | text()"/>
		</xsl:copy>
	</xsl:template>
	<!-- ensure that generalization to ONF::LocalClass are removed
             This template should be removed after the MicrowaveModel.uml was updated -->
	<xsl:template match="generalization[general/@href = '../OnfModel-CoreModel/CoreModel.uml#_k5nWYI2wEeO38ZmbECnvbg' ]">
		<xsl:call-template name="log">
			<xsl:with-param name="message">
				<xsl:value-of select="@name"/>
				<xsl:text>Generalization to ONF::LocalClass removed for </xsl:text>
				<xsl:value-of select="../@name"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:template>
	<xsl:template match="type[@href = 'pathmap://UML_LIBRARIES/EcorePrimitiveTypes.library.uml#EDate' ]">
		<type xmi:type="uml:DataType" href="../OnfModel-CoreModel/CoreModel.uml#_oGqi1lLNEeO75dO39GbF8Q"/>
	</xsl:template>
	<!-- generic -->
	<xsl:template match="* | @* | text()">
		<xsl:copy>
			<xsl:apply-templates select="* | @* | text()"/>
		</xsl:copy>
	</xsl:template>
	<!-- functions -->
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

