#  pruning-and-refactoring
this is the place where the configuration of different UML modules take place, so that these modules are converted into YANG files through the automated uml2yang converter.

# Step to follow

## Rre-Requisits
make your that xmi-converter is installed as mentioned in the README under the following link
https://github.com/OpenNetworkingFoundation/5G-xHaul/tree/experimental/models/tools


##  Create a new Module
pull the latest version from github (experimental) if avaialble
  
  1) $ git status
  2) $ git pull origin experimental
  3) $ cd models/tools/pruning-and-refactoring
  4) $ mkdir <module-name> e.g ip-interface
  5) $ cd <module-name>
  6) $ mkdir –R src/main/resources
  7) $ cd src/main/resources
  8) $ mkdir <UMLFileName> e.g. "IpInterface"
  9) $ mkdir "xslt"
  10) copy the existing xslts from another module under the "xslt" directory 
      "global-functions.xslt" & prune-and-refactor-<module-name>.xslt
  11) rename the existing file name to "prune-and-refactor-<module-name>.xslt 
      e.g. prune-and-refactor-ip-interface.xslt
  
##  Add a new module into the pom.xml file 
  1) $ cd models/tools/pruning-and-refactoring
  2) edit pom.xml and add the new module name
   <modules>
     <module> <module-name> </module>
     e.g. <module> ip-interface </module>
   </modules>
   
## Copy UML file and the related resources for the given module
 1) $ cd models/tools/pruning-and-refactoring/<module-name>/src/main/resources
     e.g. <module-name --> ip-interface
 2) $ mkdir <UMLFileName> e.g. “IpInterface” 
 3) $ cd models/tools/pruning-and-refactoring/ip-interface/src/main/resources/<UMLFileName>
 4) paste the following files and directories downloaded from the openbackhaul github.
   - CommonDataTyes
   - Gendoc
   - UmlProfiles
   - <UMLFileName>.di
   - <UMLFileName>.notation
   - <UMLFileName>.uml
  e.g. IpInterface.di, IpInterface.notation, IpInterface.uml
 
 ## Edit the local pom.xml file
 each module contains its local pom.xml file which contains the information about the resource path and the xslt file.
  
  1) $ cd models/tools/pruning-and-refactoring/<module-name>
  2) copy an existing pom.xml from an existing module
  3) edit the <module-name> as an artifact
     <artifactId><module-name></artifactId>
     e.g. <artifactId>ip-interface</artifactId>
	
	<artifactId><module-name></artifactId>
	 e.g. ip-interface
	<transformationSet>
        <dir>${basedir}/src/main/resources/<UMLFileName></dir>
        ....
	</transformationSet>       
	e.g. UMLFileName --> IpInterface
    
   4) add path of the xslt file  
       <stylesheet>${basedir}/src/main/resources/xslt/prune-and-refactor-<module-name>.xslt</stylesheet>
       e.g.
      <stylesheet>${basedir}/src/main/resources/xslt/prune-and-refactor-ip-interface.xslt</stylesheet>
  

## Convert UML to YANG 
  1) $ cd "/5G-xHaul/models/tools"
  2) $ mvn clean install
  3) In case of successful execution, go the to following directory to find the generated yang files and the yang trees.
  $ cd /5G-xHaul/models/tools/distribution
