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

<xsl:stylesheet version="2.0" 
  xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore" 
  xmlns:fn="http://www.w3.org/2005/xpath-functions"
  xmlns:onap="urn:onap:yangtools:xslt:1" 
  xmlns:OpenInterfaceModel_Profile="http:///schemas/OpenInterfaceModel_Profile/_YFPa8LptEeiytveF7IdLXg/9" 
  xmlns:OpenModel_Profile="http:///schemas/OpenModel_Profile/_FV6mYP4LEeiJYfiYi3RAYQ/29" 
  xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" 
  xmlns:xmi="http://www.omg.org/spec/XMI/20131001" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:xs="http://www.w3.org/2001/XMLSchema" 
  xmlns:yin="urn:ietf:params:xml:ns:yang:yin:1" 
 >
  <!--output -->
  <xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
  <!--params -->
	<xsl:param name="tool">core-model</xsl:param>
  <!-- default -->
  <xsl:template match="@*|node()|comment()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()|comment()"/>
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
