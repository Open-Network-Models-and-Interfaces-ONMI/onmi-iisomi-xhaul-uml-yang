<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:xmi="http://www.omg.org/spec/XMI/20131001" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:OpenModel_Profile="http:///schemas/OpenModel_Profile/_NDJbQJNqEeWP45fAG0gIqg/12" xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:variable name="lookupDoc" select="document('PriorityLookup.xml')"/>
	<xsl:key name="attributePriority" match="attribute" use="@id"/>
	<xsl:key name="classPriority" match="class" use="@id"/>
	<xsl:template match="/">
		<root>
			<xsl:apply-templates select="//ownedAttribute"/>
			<xsl:apply-templates select="//packagedElement[@xmi:type='uml:Class']"/>
		</root>
	</xsl:template>
	<xsl:template match="ownedAttribute">
		<xsl:if test="key('attributePriority', @xmi:id, $lookupDoc)/@priority != 1">
			<OpenModel_Profile:Obsolete xmi:id="{ fn:generate-id(.) }" base_StructuralFeature="{@xmi:id}" base_Element="{@xmi:id}"/>
			<!-- <attribute name="{@name}" id="{@xmi:id}" priority="{ key('attributePriority', @xmi:id, $lookupDoc)/@priority }"/> -->
		</xsl:if>
	</xsl:template>
	<xsl:template match="packagedElement">
			<!-- <object name="{@name}" id="{@xmi:id}" priority="{ key('classPriority', @xmi:id, $lookupDoc)/@priority }"/> -->
		<xsl:if test="not( key('classPriority', @xmi:id, $lookupDoc) )">
			<OpenModel_Profile:Obsolete xmi:id="{ fn:generate-id(.) }" base_Class="{@xmi:id}" base_Element="{@xmi:id}"/>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
