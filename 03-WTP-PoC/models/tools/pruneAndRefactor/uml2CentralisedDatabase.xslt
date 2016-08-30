<?xml version="1.0" encoding="UTF-8"?>
<!-- A stylesheet to store static information of the schema in persistent 
  database -->
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:xmi="http://www.omg.org/spec/XMI/20131001"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore"
  xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML"
  xmlns:OpenModel_Profile="http:///schemas/OpenModel_Profile/_0tU-YNyQEeW6C_FaABjU5w/14">
  <!-- output defintions -->
  <xsl:output method="text" version="1.0" encoding="UTF-8"
    indent="yes" />
  <!-- key definitions -->
  <xsl:key name="openAttributeRef" match="OpenModel_Profile:OpenModelAttribute"
    use="@base_StructuralFeature" />
  <xsl:key name="ownedAttributeRef" match="ownedAttribute" use="@xmi:id" />
  <xsl:key name="keyRef" match="key" use="@base_StructuralFeature" />
  <xsl:variable name="keyLookupDoc" select="document('keys.xml')" />
  <xsl:variable name="thisLookupDoc" select="document('../input/CoreModel.uml')" />
  <!-- tempates -->
  <xsl:template match="/">
    <xsl:text>{&quot;schema-information&quot;:{</xsl:text>
    <xsl:apply-templates select="//packagedElement[@xmi:type = 'uml:Class']" />
    <xsl:text>}}</xsl:text>
  </xsl:template>
  <xsl:template match="packagedElement">
  </xsl:template>
  <xsl:template match="packagedElement[@xmi:type = 'uml:Class']">
    <xsl:text>&quot;</xsl:text>
    <xsl:call-template name="getKeyFromName">
        <xsl:with-param name="name" select="@name"></xsl:with-param>
    </xsl:call-template>
    <xsl:text>&quot;:{</xsl:text>
    <!-- id -->
    <xsl:text>&quot;id&quot;:&quot;</xsl:text>
    <xsl:call-template name="getKeyFromName">
        <xsl:with-param name="name" select="@name"></xsl:with-param>
    </xsl:call-template>
    <xsl:text>&quot;,</xsl:text>
    <!-- uml-id -->
    <xsl:text>&quot;uml-id&quot;:&quot;</xsl:text>
    <xsl:value-of select="@xmi:id" />
    <xsl:text>&quot;,</xsl:text>
    <!-- uml-type -->
    <xsl:text>&quot;uml-type&quot;:&quot;</xsl:text>
    <xsl:value-of select="@xmi:type" />
    <xsl:text>&quot;,</xsl:text>
    <!-- is-read-only -->
    <xsl:text>&quot;is-read-only&quot;:</xsl:text>
    <xsl:choose>
      <xsl:when test="@isReadOnly">
        <xsl:value-of select="@isReadOnly" />
      </xsl:when>
      <xsl:otherwise>
        <xsl:text>false</xsl:text>
      </xsl:otherwise>
    </xsl:choose>
    <xsl:text>,</xsl:text>
    <!-- description -->
    <xsl:apply-templates select="ownedComment" />
    <xsl:text>}</xsl:text>
    <xsl:text>,
</xsl:text>
    <xsl:apply-templates select="ownedAttribute" />
  </xsl:template>
  <xsl:template match="ownedAttribute">
    <xsl:text>&quot;</xsl:text>
    <xsl:call-template name="getKeyFromName">
        <xsl:with-param name="name" select="@name"></xsl:with-param>
    </xsl:call-template>
    <xsl:text>&quot;:{</xsl:text>
    <!-- id -->
    <xsl:text>&quot;id&quot;:&quot;</xsl:text>
    <xsl:call-template name="getKeyFromName">
        <xsl:with-param name="name" select="@name"></xsl:with-param>
    </xsl:call-template>
    <xsl:text>&quot;,</xsl:text>
    <!-- uml-id -->
    <xsl:text>&quot;uml-id&quot;:&quot;</xsl:text>
    <xsl:value-of select="@xmi:id" />
    <xsl:text>&quot;,</xsl:text>
    <!-- uml-type -->
    <xsl:text>&quot;uml-type&quot;:&quot;ownedAttribute&quot;,</xsl:text>
    <!-- type -->
    <xsl:text>&quot;type&quot;:&quot;</xsl:text>
    <xsl:value-of select="@type"></xsl:value-of>
    <xsl:apply-templates select="type"></xsl:apply-templates>
    <xsl:text>&quot;,</xsl:text>
    <!-- order number -->
    <xsl:text>&quot;order-number&quot;:&quot;</xsl:text>
    <xsl:value-of select="position()"></xsl:value-of>
    <xsl:text>&quot;,</xsl:text>
    <!-- is-read-only -->
    <xsl:text>&quot;is-read-only&quot;:</xsl:text>
    <xsl:choose>
      <xsl:when test="@isReadOnly">
        <xsl:value-of select="@isReadOnly" />
      </xsl:when>
      <xsl:otherwise>
        <xsl:text>false</xsl:text>
      </xsl:otherwise>
    </xsl:choose>
    <xsl:text>,</xsl:text>
    <!-- unit and key -->
    <xsl:apply-templates select="key('openAttributeRef', @xmi:id)" />
    <!-- description -->
    <xsl:apply-templates select="ownedComment" />
    <xsl:text>}</xsl:text>
    <xsl:text>,
</xsl:text>
  </xsl:template>
  <xsl:template match="type">
    <xsl:value-of select="@href"></xsl:value-of>
  </xsl:template>
  <xsl:template match="ownedComment">
    <xsl:text>
&quot;description&quot;:[</xsl:text>
    <xsl:apply-templates select="body" />
    <xsl:text>]</xsl:text>
  </xsl:template>
  <xsl:template match="body">
    <xsl:text>&quot;</xsl:text>
    <xsl:value-of select="fn:translate(fn:normalize-space(.), '&quot;', ' ' )" />
    <xsl:text>&quot;</xsl:text>
    <xsl:if test="position() != last()">
      <xsl:text>,</xsl:text>
    </xsl:if>
  </xsl:template>
  <xsl:template match="OpenModel_Profile:OpenModelAttribute">
    <!-- is-key -->
    <xsl:if test="@partOfObjectKey">
      <xsl:text>&quot;is-key&quot;:</xsl:text>
      <xsl:value-of select="@partOfObjectKey"></xsl:value-of>
      <xsl:text>,</xsl:text>
    </xsl:if>
    <!-- unit -->
    <xsl:if test="@unit">
      <xsl:text>&quot;unit&quot;:&quot;</xsl:text>
      <xsl:value-of select="@unit"></xsl:value-of>
      <xsl:text>&quot;,</xsl:text>
    </xsl:if>
  </xsl:template>
  <!-- functions -->
  <xsl:template name="getKeyFromName">
      <xsl:param name="name"></xsl:param>
      <xsl:value-of select="fn:translate($name, ' ', '-')"></xsl:value-of>
  </xsl:template>

  <!-- If not stated differently above, copy elements, as they are -->
  <xsl:template match="* | @* | text()">
    <xsl:copy>
      <xsl:apply-templates select="* | @* | text() " />
    </xsl:copy>
  </xsl:template>
</xsl:stylesheet>