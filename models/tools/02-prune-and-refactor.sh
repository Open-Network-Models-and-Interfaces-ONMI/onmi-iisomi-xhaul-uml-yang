#!/usr/bin/env bash
# Martin Skorupski. Copyright (c) 2017, highstreet technologies GmbH

processor="./src/main/resources/lib/saxon9he.jar";
       in="./src/main/resources/TR-512_v1._3_Publish/OnfModel/CoreModel.uml";
     xslt="./src/main/prune-and-refactor/prune-and-refactor.xslt";
      out="./src/main/resources/EAGLE-Open-Model-Profile-and-Tools/UmlYangTools/xmi2yang/project/CoreModel.xml";

java -jar $processor -s:"$in" -xsl:"$xslt" -o:"$out";
