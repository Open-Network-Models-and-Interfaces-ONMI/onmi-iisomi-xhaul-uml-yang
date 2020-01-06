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
<!-- A stylesheet to prune and refactor the ethernet container for YANG generation -->
<!-- Changes made on the Wire Interface Model
- ignore all package-imports

 -->
<xsl:stylesheet version="2.0" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:OpenModel_Profile="http:///schemas/OpenModel_Profile/_aG1hkAPxEeewDI5jM-81FA/21" xmlns:OpenInterfaceModel_Profile="http:///schemas/OpenInterfaceModel_Profile/_YFPa8LptEeiytveF7IdLXg/9" xmlns:RootElement="http:///schemas/RootElement/_B4YnAGFbEeeiJ9-h1KDHig/45" xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmlns:xmi="http://www.omg.org/spec/XMI/20131001" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <!-- imports -->
  <xsl:import href="./global-functions.xslt"/>
  <!-- output defintions -->
  <xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
  <!-- key definitions -->
  <!-- templates -->
<<<<<<< HEAD
  <!--<xsl:template match="packageImport[importedPackage/@href = 'pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#_0']"/> </xsl:stylesheet> -->
=======
  <xsl:template match="packageImport[importedPackage/@href = 'pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#_0']"/> 
>>>>>>> 3b10c6265d9026f44ce5cb7a1f73a0fd9d02cf1c
</xsl:stylesheet>
