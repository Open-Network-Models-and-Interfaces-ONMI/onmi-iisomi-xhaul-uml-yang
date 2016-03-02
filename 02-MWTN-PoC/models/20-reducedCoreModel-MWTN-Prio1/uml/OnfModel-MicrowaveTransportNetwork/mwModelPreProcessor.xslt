<?xml version="1.0" encoding="UTF-8"?>
<!-- Mit XMLSpy v2006 sp2 U bearbeitet (http://www.altova.com) von Martin Skorupski (Ingenieurbüro für Informationstechnik · ibit) -->
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:xmi="http://www.omg.org/spec/XMI/20131001" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:OpenModel_Profile="http:///schemas/OpenModel_Profile/_NDJbQJNqEeWP45fAG0gIqg/12" xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML">
	<!-- output defintions -->
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
	<!-- keys -->
	<xsl:variable name="lookupDoc" select="document('PriorityLookup.xml')"/>
	<xsl:key name="attributePriority" match="attribute" use="@id"/>
	<xsl:key name="classPriority" match="class" use="@id"/>
	<xsl:key name="attRef" match="ownedAttribute" use="@xmi:id"/>
	<xsl:key name="obsoleteRefs" match="OpenModel_Profile:Obsolete" use="@base_Element"/>
	<xsl:template match="packagedElement[ @xmi:type = 'uml:Class' ]">
		<xsl:if test="fn:not( key('obsoleteRefs', @xmi:id) )">
			<xsl:message>
				<xsl:value-of select="@name"/>
				<xsl:text> </xsl:text>
				<xsl:value-of select="fn:count( key('obsoleteRefs', @xmi:id) )"/>
			</xsl:message>
			<xsl:copy>
				<xsl:apply-templates select="* | @* | text()"/>
			</xsl:copy>
		</xsl:if>
	</xsl:template>
	<xsl:template match="ownedAttribute">
	
	<xsl:choose>
		<xsl:when test="fn:not( key('obsoleteRefs', @xmi:id) )">
			<xsl:message>
				<xsl:text>- </xsl:text>
				<xsl:value-of select="@name"/>
				<xsl:text> (</xsl:text>
				<xsl:value-of select="../@name"/>
				<xsl:text>) </xsl:text>
				<xsl:value-of select="fn:count( key('obsoleteRefs', @xmi:id) )"/>
			</xsl:message>
			<xsl:copy>
				<xsl:apply-templates select="* | @* | text()"/>
			</xsl:copy>
		</xsl:when>
	<xsl:otherwise>
			<xsl:message>
				<xsl:text>---------------- </xsl:text>
				<xsl:value-of select="@name"/>
				<xsl:text> (</xsl:text>
				<xsl:value-of select="../@name"/>
				<xsl:text>) </xsl:text>
				<xsl:value-of select="fn:count( key('obsoleteRefs', @xmi:id) )"/>
			</xsl:message>
	</xsl:otherwise>
	</xsl:choose>

		<xsl:if test="fn:count( key('obsoleteRefs', @xmi:id) ) &gt; 1">
			<xsl:message>
				<xsl:text>############## </xsl:text>
				<xsl:value-of select="@name"/>
				<xsl:text> </xsl:text>
				<xsl:value-of select="@xmi:id"/>
				<xsl:text> (</xsl:text>
				<xsl:value-of select="../@name"/>
				<xsl:text>) </xsl:text>
				</xsl:message>
		</xsl:if>
		
	</xsl:template>
	<xsl:template match="packagedElement[ @name = 'airInterfaceDiversityType' ]">
	<!-- igrnored: no enums defined -->
	</xsl:template>
	<xsl:template match="packagedElement[@name = 'TypeDefinitions' ]">
		<xsl:copy>
			<xsl:apply-templates select="* | @* | text()"/>
			<packagedElement xmi:type="uml:Class" xmi:id="_M8IDxceIEeSfd5vyUJsimg" name="«Q.822» numSuppressedIntervalsPkg">
				<eAnnotations xmi:id="_M8IDxseIEeSfd5vyUJsimg" source="http://www.eclipse.org/uml2/2.0.0/UML">
					<details xmi:id="_M8IDx8eIEeSfd5vyUJsimg" key="Archetype"/>
				</eAnnotations>
				<ownedAttribute xmi:id="_M8IDyMeIEeSfd5vyUJsimg" name="numSuppressedIntervals" visibility="public">
				            <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#Integer"/>
				
				</ownedAttribute>

			</packagedElement>
			<packagedElement xmi:type="uml:Class" xmi:id="_M8IDrceIEeSfd5vyUJsimg" name="«Q.822» historyDataMeasurementListPkg">
				<eAnnotations xmi:id="_M8IDrseIEeSfd5vyUJsimg" source="http://www.eclipse.org/uml2/2.0.0/UML">
					<details xmi:id="_M8IDr8eIEeSfd5vyUJsimg" key="Archetype"/>
				</eAnnotations>
				<ownedAttribute xmi:id="_M8IDsMeIEeSfd5vyUJsimg" name="cTPId" visibility="public">
					<eAnnotations xmi:id="_M8IDsceIEeSfd5vyUJsimg" source="http://www.eclipse.org/uml2/2.0.0/UML"/>
				            <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
				</ownedAttribute>

			</packagedElement>
			<packagedElement xmi:type="uml:Class" xmi:id="_M8IDsseIEeSfd5vyUJsimg" name="«Q.822» historyDataSuspectIntervalFlagPkg">
				<eAnnotations xmi:id="_M8IDs8eIEeSfd5vyUJsimg" source="http://www.eclipse.org/uml2/2.0.0/UML">
					<details xmi:id="_M8IDtMeIEeSfd5vyUJsimg" key="Archetype"/>
				</eAnnotations>
				<ownedAttribute xmi:id="_M8IDtceIEeSfd5vyUJsimg" name="cTPId" visibility="public">
					<eAnnotations xmi:id="_M8IDtseIEeSfd5vyUJsimg" source="http://www.eclipse.org/uml2/2.0.0/UML"/>
				            <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
				</ownedAttribute>

			</packagedElement>
			<packagedElement xmi:type="uml:Class" xmi:id="_M8IDzseIEeSfd5vyUJsimg" name="«Q.822» observedManagedObjectPkg">
				<eAnnotations xmi:id="_M8IDz8eIEeSfd5vyUJsimg" source="http://www.eclipse.org/uml2/2.0.0/UML">
					<details xmi:id="_M8ID0MeIEeSfd5vyUJsimg" key="Archetype"/>
				</eAnnotations>
				<ownedAttribute xmi:id="_M8ID0ceIEeSfd5vyUJsimg" name="observedObjectClass" visibility="public">
				            <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>

				</ownedAttribute>
				<ownedAttribute xmi:id="_M8ID0seIEeSfd5vyUJsimg" name="observedObjectInstance" visibility="public">
            <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>
				
				</ownedAttribute>
			</packagedElement>
			<packagedElement xmi:type="uml:Class" xmi:id="_M8IDyceIEeSfd5vyUJsimg" name="«Q.822» objectDeleteNotificationPkg">
				<eAnnotations xmi:id="_M8IDyseIEeSfd5vyUJsimg" source="http://www.eclipse.org/uml2/2.0.0/UML">
					<details xmi:id="_M8IDy8eIEeSfd5vyUJsimg" key="Archetype"/>
				</eAnnotations>
				<ownedAttribute xmi:id="_M8IDzMeIEeSfd5vyUJsimg" name="cTPId" visibility="public">
					<eAnnotations xmi:id="_M8IDzceIEeSfd5vyUJsimg" source="http://www.eclipse.org/uml2/2.0.0/UML"/>
					            <type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String"/>

				</ownedAttribute>
			</packagedElement>
		</xsl:copy>
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
