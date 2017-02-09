#!/bin/bash
#
# build-yang
# Yang generation from UML including pruning and refactoring
#
# Copyright (C) 2016 highstreet technologies GmbH
# Author: Martin Skorupski <martin.skorupski@highstreet-technologies.com>
#
  input="./input";                      # input folder with *.uml files
    par="./pruneAndRefactor";           # source folder for pruning and refactoring 
project="./xmi2yang/project"; # project folder of xmi2yang tool

function log {
    time="`TZ=\"Z\" date +%Y-%m-%dT%H:%M:%S,%3NZ`";
    tool="build-yang";
    info="INFO ";
    echo "$time | $tool | $info | $1";
}  

function post-processing {
  # core-model
  sed -i -e 's/name,uuid/uuid/g' $1;
  sed -i -e 's/uuid,name/uuid/g' $1;
  sed -i -e "s/key 'uuid name';/key 'uuid';/g" $1;
  sed -i -e "s/key 'name uuid';/key 'uuid';/g" $1;
  sed -i -e "s/\/core-model:global-pac/\/core-model:global-pac\/core-model:uuid/g" $1;
  sed -i -e "s/core-model:fd-and-link-rule-set\//core-model:fd-and-link-rule-set\/core-model:fd-rule/g" $1;
  sed -i -e "s/core-model:aggregate-function\//core-model:aggregate-function\/core-model:atomic-function/g" $1;
  sed -i -e "s/core-model:support-constraints\//core-model:support-constraints\/core-model:constrained-supported-non-fru/g" $1;
  sed -i -e "s/core-model:elemental-signals\//core-model:support-constraints\/core-model:pin/g" $1;
  sed -i -e "s/core-model:pin-group\//core-model:pin-group\/core-model:pin/g" $1;
  sed -i -e "s/core-model:signal-ref-pt\//core-model:signal-ref-pt\/core-model:ltp/g" $1;
  sed -i -e "s/core-model:fd-and-link-rule\//core-model:fd-and-link-rule\/core-model:rule-type/g" $1;
  sed -i -e "s/container network-element {/container network-element {\n                presence  \"\";/g" $1;
  sed -i -e "s/container operation-envelope {/container operation-envelope {\n                    presence  \"\";/g" $1;
  sed -i -e "s/container mw-air-interface-pac {/container mw-air-interface-pac {\n                presence  \"\";/g" $1;
  sed -i -e "s/container mw-air-interface-diversity-pac {/container mw-air-interface-diversity-pac {\n                presence  \"\";/g" $1;
  sed -i -e "s/container mw-ethernet-container-pac {/container mw-ethernet-container-pac {\n                presence  \"\";/g" $1;
  sed -i -e "s/container mw-tdm-container-pac {/container mw-tdm-container-pac {\n                presence  \"\";/g" $1;

  sed -i -e "s/grouping fc-port {/list forwarding-construct {\n                key 'uuid';\n                uses forwarding-construct;\n                description \"none\";\n            }\n            grouping fc-port {/g" $1;
  sed -i -e "s/grouping holder {/list equipment {\n                    key 'uuid';\n                    uses equipment;\n                                description \"none\";\n}\n                grouping holder {/g" $1;
  # spelling

#2017-02-09T06:14:17.078Z |   spelling | INFO  | adminisatratve better administrative,administrate,administratrix,administration,administrator,administrable
#2017-02-09T06:14:17.149Z |   spelling | INFO  | conector better connector,convector,corrector,connection,reconnect,collector,Concorde,connected
#2017-02-09T06:14:17.230Z |   spelling | INFO  | quantised better quantized,quantified,quarantined,antiquated,quantile,quantizer,quantize
#2017-02-09T06:14:17.271Z |   spelling | INFO  | characeristics better characteristics,characteristic,characterizes,characterizations,charismatics,characterized,Eucharistic
#2017-02-09T06:14:19.552Z |   spelling | INFO  | permenantly better permanently,permanent,temperamentally,experimentally,permanency,predominant,developmental
#2017-02-09T06:14:19.884Z |   spelling | INFO  | mechanicall better mechanical,mechanically,mechanicals,mechanic all,mechanic-all,mechanical l,mechanistically,mechanochemically,mechanic,mechanistic,technicality,nontechnical
  sed -i -e 's/adminisatratve/administrative/g' $1;
  sed -i -e 's/conector/connector/g' $1;
  sed -i -e 's/quantised/quantized/g' $1;
  sed -i -e 's/characeristics/characteristics/g' $1;
  sed -i -e 's/mechanicall/mechanical/g' $1;




  # g.874.1
  sed -i -e "s/prefix g.874.1-model;/prefix g.874.1-model;\n\n    import core-model {\n        prefix core-model;\n    }\n\n/g" $1;

  # microwave-model
  sed -i -e "s/prefix microwave-model;/prefix microwave-model;\n    import g.874.1-model {\n        prefix g;\n    }\n/g" $1;
  sed -i -e "s/prefix microwave-model;/prefix microwave-model;\n\n    import core-model {\n        prefix core-model;\n    }/g" $1;
  sed -i -e "s/type integer/type int32/g" $1; # MEGA hack - check with Thorsten....

  log "  Post processed: $1";
}

# Start
clear;
log "Start";

# clean project folder
rm -f "$project"/*.yang;
rm -f "$project"/*.xml;
rm -f  "$project"/*.txt;
cp "$project"/config.txt.owl "$project"/config.txt 
log "Folder $project cleaned!";


# ONF CoreModel 1.2
  in="CoreModel.uml";
xslt="CM-PruningAndRefactor-4MW.xslt";
 out="CoreModel.xml";
java -jar $par/saxon9he.jar -s:$input/$in -xsl:$par/$xslt -o:"$project/$out";
log "$project/$out generated!";

  in="CoreModel.xml";
xslt="uml2CentralisedDatabase.xslt";
 out="CoreModel.json";
java -jar $par/saxon9he.jar -s:"$project/$in" -xsl:$par/$xslt -o:"$project/$out";
log "$project/$out generated!";


# G.874.1
  in="g874.1-model.uml";
xslt="G.874.1-PruningAndRefactor-4MW.xslt";
 out="G.874.1.xml";
java -jar $par/saxon9he.jar -s:$input/$in -xsl:$par/$xslt -o:"$project/$out";
log "$project/$out generated!";

  in="G.874.1.xml";
xslt="uml2CentralisedDatabase.xslt";
 out="G.874.1.json";
java -jar $par/saxon9he.jar -s:"$project/$in" -xsl:$par/$xslt -o:"$project/$out";
log "$project/$out generated!";


# MicrowaveModel 1.0
  in="MicrowaveModel.uml";
xslt="mwModelPreProcessor.xslt";
 out="MicrowaveModel.xml";
java -jar $par/saxon9he.jar -s:$input/$in -xsl:$par/$xslt -o:"$project/$out";
log "$project/$out generated!";


  in="MicrowaveModel.xml";
xslt="uml2CentralisedDatabase.xslt";
 out="MicrowaveModel.json";
java -jar $par/saxon9he.jar -s:"$project/$in" -xsl:$par/$xslt -o:"$project/$out";
log "$project/$out generated!";

# generate yang from pruned and refactored uml
cd "$project/..";
node main;
log "yang modules generated!";


log "Checking yang modules ...!";
cd "./project";
files=(*.yang);
for item in ${files[*]}
do
  post-processing "$item"
  log "  $item";
  pyang "$item"; 
done
log "Yang modules checked!";

pyang -f tree *.yang >> MicrowaveModel.tree.txt
pyang --lint *.yang
log "Tree view generated!";

# End
log "End";
