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
  # sed -i -e "s/prefix core-model;/prefix core-model;\n\n    import ietf-yang-types {\n        prefix yang;\n    }\n/g" $1;
  sed -i -e "s/type core-model:date-and-time;/type yang:date-and-time;/g" $1;
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

  sed -i -e "s/grouping fc-port {/list forwarding-construct {\n                key 'uuid';\n                uses forwarding-construct;\n                description \"none\";\n            }\n            grouping fc-port {/g" $1;
  sed -i -e "s/grouping holder {/list equipment {\n                    key 'uuid';\n                    uses equipment;\n                                description \"none\";\n}\n                grouping holder {/g" $1;
  # spelling
  sed -i -e 's/adminisatratve/administrative/g' $1;
  sed -i -e 's/conector/connector/g' $1;
  sed -i -e 's/quantised/quantized/g' $1;
  sed -i -e 's/characeristics/characteristics/g' $1;
  sed -i -e 's/mechanicall/mechanical/g' $1;

  # g.874.1
  sed -i -e "s/type core-model:date-and-time;/type yang:date-and-time;/g" $1;
  sed -i -e "s/prefix g.874.1-model;/prefix g.874.1-model;\n    import ietf-yang-types {\n        prefix yang;\n    }\n/g" $1;
  sed -i -e "s/prefix g.874.1-model;/prefix g.874.1-model;\n\n    import core-model {\n        prefix core-model;\n    }/g" $1;

  # microwave-model
  sed -i -e "s/type core-model:date-and-time;/type yang:date-and-time;/g" $1;
  sed -i -e "s/20101120140000.0Z+1/2017-01-01T00:00:00.0Z/g" $1;
  sed -i -e "s/_format:.*/ \";/g" $1;


  sed -i -e "s/prefix microwave-model;/prefix microwave-model;\n    import ietf-yang-types {\n        prefix yang;\n    }\n/g" $1;
  sed -i -e "s/prefix microwave-model;/prefix microwave-model;\n    import g.874.1-model {\n        prefix g;\n    }/g" $1;
  sed -i -e "s/prefix microwave-model;/prefix microwave-model;\n\n    import core-model {\n        prefix core-model;\n    }/g" $1;
  sed -i -e "s/type integer/type int32/g" $1; # MEGA hack - check with Thorsten....

  # turn mandatory top level microwave containers into presence containers
  # names="(mw-air-interface-pac|mw-air-interface-diversity-pac|mw-ethernet-container-pac|mw-tdm-container-pac)"
  # taking into account that optional if-feature statement must stay first
  # perl -0777 -i -pe "s/(list\s+${names}\s+{\s*\n(\s+if-feature\s.*;\s*\n)?)(\s+)/\1\4presence \"\";\n\4/g" $1

  log "  Post processed: $1";
}

# Start
clear;
log "Start";

# clean project folder
rm -f "$project"/*.yang;
# rm -f "$project"/*.xml;
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

# onf-ethernet-conditional-packages.xml
  in="onf-ethernet-conditional-packages.uml";
 out="onf-ethernet-conditional-packages.xml";
cp "$input/$in" "$project/$out";
log "$project/$out generated!";

  in="onf-ethernet-conditional-packages.xml";
xslt="uml2CentralisedDatabase.xslt";
 out="onf-ethernet-conditional-packages.json";
java -jar $par/saxon9he.jar -s:"$project/$in" -xsl:$par/$xslt -o:"$project/$out";
log "$project/$out generated!";

# onf-core-model-conditional-packages.xml
  in="onf-core-model-conditional-packages.uml";
 out="onf-core-model-conditional-packages.xml";
cp "$input/$in" "$project/$out";
log "$project/$out generated!";

  in="onf-core-model-conditional-packages.xml";
xslt="uml2CentralisedDatabase.xslt";
 out="onf-core-model-conditional-packages.json";
java -jar $par/saxon9he.jar -s:"$project/$in" -xsl:$par/$xslt -o:"$project/$out";
log "$project/$out generated!";


# End
log "End";

