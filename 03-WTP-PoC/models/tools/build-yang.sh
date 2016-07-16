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
project="./xmi2yang tool-v1.3/project"; # project folder of xmi2yang tool

function log {
    time="`TZ=\"Z\" date +%Y-%m-%dT%H:%M:%S,%3NZ`";
    tool="build-yang"
    info="INFO "
    echo "$time | $tool | $info | $1";
}  

# Start
log "Start";

# clean project folder
rm "$project"/*.yang;
rm "$project"/*.xml;
rm "$project"/*.txt;
log "Folder $project cleaned!";

# G.874.1
  in="g874.1-model.uml";
xslt="G.874.1-PruningAndRefactor-4MW.xslt";
 out="G.874.1-ForMicrowave.xml";
java -jar $par/saxon9he.jar -s:$input/$in -xsl:$par/$xslt -o:"$project/$out";
log "$project/$out generated!";


# ONF CoreModel 1.1
  in="CoreModel.uml";
xslt="CM-PruningAndRefactor-4MW.xslt";
 out="CoreModel-ForMicrowave.xml";
java -jar $par/saxon9he.jar -s:$input/$in -xsl:$par/$xslt -o:"$project/$out";
log "$project/$out generated!";


# MicrowaveModel 1.0
  in="MicrowaveModel.uml";
xslt="mwModelPreProcessor.xslt";
 out="MicrowaveModel.xml";
java -jar $par/saxon9he.jar -s:$input/$in -xsl:$par/$xslt -o:"$project/$out";
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
  log "  $item";
  pyang "$item"; 
done
log "Yang modules checked!";

pyang -f tree CoreModel-CoreNetworkModule-ObjectClasses.yang MicrowaveModel-ObjectClasses-MwConnection.yang >> MicrowaveModel.tree.txt
log "Tree view generated!";

# End
log "End";
