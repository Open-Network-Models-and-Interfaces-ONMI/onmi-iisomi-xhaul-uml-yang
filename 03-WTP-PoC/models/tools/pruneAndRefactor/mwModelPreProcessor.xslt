<?xml version="1.0" encoding="UTF-8"?>
<!-- Mit XMLSpy v2006 sp2 U bearbeitet (http://www.altova.com) von Martin Skorupski (Ingenieurbüro für Informationstechnik · ibit) -->
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:xmi="http://www.omg.org/spec/XMI/20131001" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmlns:OpenModel_Profile="http:///schemas/OpenModel_Profile/_0tU-YNyQEeW6C_FaABjU5w/14">
	<!-- output defintions -->
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no"/>
	<!-- keys -->
	<xsl:param name="showObsolete" >false</xsl:param>
	<xsl:variable name="lookupDoc" select="document('PriorityLookup.xml')"/>
	<xsl:key name="attributePriority" match="attribute" use="@id"/>
	<xsl:key name="classPriority" match="class" use="@id"/>
	<xsl:key name="attRef" match="ownedAttribute" use="@xmi:id"/>
	<xsl:key name="obsoleteRefs" match="OpenModel_Profile:Obsolete" use="@base_Element"/>
	
	<xsl:template match="packagedElement[ @xmi:type = 'uml:Signal' ]">
		<xsl:if test="$showObsolete = 'true' or fn:not( key('obsoleteRefs', @xmi:id) )">
			<!-- <xsl:message>
				<xsl:value-of select="@name"/>
				<xsl:text> </xsl:text>
				<xsl:value-of select="fn:count( key('obsoleteRefs', @xmi:id) )"/>
			</xsl:message> -->
			<xsl:copy>
				<xsl:apply-templates select="* | @* | text()"/>
			</xsl:copy>
		</xsl:if>
	</xsl:template>
	<xsl:template match="packagedElement[ @xmi:type = 'uml:Enumeration' ]">
		<xsl:if test="$showObsolete = 'true' or fn:not( key('obsoleteRefs', @xmi:id) )">
			<!-- <xsl:message>
				<xsl:value-of select="@name"/>
				<xsl:text> </xsl:text>
				<xsl:value-of select="fn:count( key('obsoleteRefs', @xmi:id) )"/>
			</xsl:message> -->
			<xsl:copy>
				<xsl:apply-templates select="* | @* | text()"/>
			</xsl:copy>
		</xsl:if>
	</xsl:template>
	<xsl:template match="packagedElement[ @xmi:type = 'uml:DataType' ]">
		<xsl:if test="$showObsolete = 'true' or fn:not( key('obsoleteRefs', @xmi:id) )">
			<!-- <xsl:message>
				<xsl:value-of select="@name"/>
				<xsl:text> </xsl:text>
				<xsl:value-of select="fn:count( key('obsoleteRefs', @xmi:id) )"/>
			</xsl:message> -->
			<xsl:copy>
				<xsl:apply-templates select="* | @* | text()"/>
			</xsl:copy>
		</xsl:if>
	</xsl:template>
	<xsl:template match="packagedElement[ @xmi:type = 'uml:Class' ]">
	   <xsl:if test="$showObsolete = 'true' or fn:not( key('obsoleteRefs', @xmi:id) )"> 
			<!-- <xsl:message>
				<xsl:value-of select="@name"/>
				<xsl:text> </xsl:text>
				<xsl:value-of select="fn:count( key('obsoleteRefs', @xmi:id) )"/>
			</xsl:message> -->
			<xsl:copy>
				<xsl:apply-templates select="* | @* | text()"/>
			</xsl:copy>
		</xsl:if>
	</xsl:template>
	<xsl:template match="ownedAttribute">
		<xsl:choose>
			<xsl:when test="$showObsolete = 'true' or fn:not( key('obsoleteRefs', @xmi:id) )">
				<!-- <xsl:message>
					<xsl:text>- </xsl:text>
					<xsl:value-of select="@name"/>
					<xsl:text> (</xsl:text>
					<xsl:value-of select="../@name"/>
					<xsl:text>) </xsl:text>
					<xsl:value-of select="fn:count( key('obsoleteRefs', @xmi:id) )"/>
				</xsl:message> -->
				<xsl:copy>
					<xsl:apply-templates select="* | @* | text()"/>
				</xsl:copy>
			</xsl:when>
			<xsl:otherwise>
				<!-- <xsl:message>
					<xsl:text>- - - - - - - - - - - - - - - - </xsl:text>
					<xsl:value-of select="@name"/>
					<xsl:text> (</xsl:text>
					<xsl:value-of select="../@name"/>
					<xsl:text>) </xsl:text>
					<xsl:value-of select="fn:count( key('obsoleteRefs', @xmi:id) )"/>
				</xsl:message> -->
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="fn:count( key('obsoleteRefs', @xmi:id) ) &gt; 1">
			<!-- <xsl:message>
				<xsl:text>############## </xsl:text>
				<xsl:value-of select="@name"/>
				<xsl:text> </xsl:text>
				<xsl:value-of select="@xmi:id"/>
				<xsl:text> (</xsl:text>
				<xsl:value-of select="../@name"/>
				<xsl:text>) </xsl:text>
			</xsl:message> -->
		</xsl:if>
	</xsl:template>
	
	<xsl:template match="packagedElement[ @xmi:type = 'uml:Package']">
	   <xsl:if test="$showObsolete = 'true' or fn:not( key('obsoleteRefs', @xmi:id) )"> 
			<!-- <xsl:message>
				<xsl:value-of select="@name"/>
				<xsl:text> </xsl:text>
				<xsl:value-of select="fn:count( key('obsoleteRefs', @xmi:id) )"/>
			</xsl:message> -->
			<xsl:copy>
				<xsl:apply-templates select="* | @* | text()"/>
			</xsl:copy>
		</xsl:if>
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
</xsl:stylesheet>
