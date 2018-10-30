<?xml version="1.0" encoding="UTF-8"?>
<!--
################################################################################
# Script to convert yang modules into other formats
# Author: martin.skorupski@highstreet-technologies.com
# 
# Copyright 2018 higshtreet technologies GmbH
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
-->
<!-- A stylesheet converting yin modules into json files for lookup by karaf-ux-framework -->
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:yin="urn:ietf:params:xml:ns:yang:yin:1">
  <xsl:output method="text" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <xsl:text>{ "schmea-information": {&#xA;</xsl:text>
    <xsl:apply-templates select="//yin:description"/>
    <xsl:text>}&#xA;}</xsl:text>
  </xsl:template>
  <xsl:template match="yin:status">
    <xsl:text>"status": "</xsl:text>
    <xsl:value-of select="@value"/>
    <xsl:text>",&#xa;</xsl:text>
  </xsl:template>
  <xsl:template match="yin:description">
    <xsl:if test="../@name">
      <xsl:text>&#xA;"</xsl:text>
      <xsl:value-of select="../@name"/>
      <xsl:text>": {&#xA;</xsl:text>
      <xsl:text>"id": "</xsl:text>
      <xsl:value-of select="../@name"/>
      <xsl:text>", &#xA;</xsl:text>
      <xsl:text>"is-read-only": </xsl:text>
      <xsl:value-of select="'false'"/>
      <xsl:text>, &#xA;</xsl:text>
      <xsl:apply-templates select="../status"/>
      <xsl:text>"description": [</xsl:text>
      <xsl:apply-templates select="yin:*"/>
      <xsl:text>]&#xA;}</xsl:text>
      <xsl:if test="fn:position() != fn:last()">
        <xsl.text>,</xsl.text>
      </xsl:if>
    </xsl:if>
  </xsl:template>
  <xsl:template match="yin:text">
    <xsl.text>"</xsl.text>
    <xsl:value-of select="fn:normalize-space(.)"/>
    <xsl.text>"</xsl.text>
    <xsl:if test="fn:position() != fn:last()">
      <xsl.text>,</xsl.text>
    </xsl:if>
  </xsl:template>
  <!--
  <xsl:template match="yin:module">
    <xsl:apply-templates select="yin:grouping | yin:leaf | yin:list"/>
  </xsl:template>
  <xsl:template match="yin:grouping">
    <xsl:text>"</xsl:text>
    <xsl:value-of select="@name"/>
    <xsl:text>"": {&#xA;</xsl:text>
    <xsl:text>"id": </xsl:text>
    <xsl:value-of select="@name"/>
    <xsl:text>",&#xA;</xsl:text>
    <xsl:text>"description": </xsl:text>
    <xsl:value-of select="@name"/>
    <xsl:text>"}&#xA;</xsl:text>
  </xsl:template>
  <xsl:template match="*">
    <!- - <xsl:value-of select="fn:name(.)"></xsl:value-of> - ->
    <xsl:apply-templates select="*"/>
  </xsl:template> -->
</xsl:stylesheet>
