# Tools
This folder contains a couple of scripts and tools, needed to generate YANG files from UML.

### Table of Contents
1. [Prerequisites](#prerequisites)
2. [Process](#process)
2. [Main Scripts](#main-scripts)

## Prerequisites

### Operating System

The expected operating system is "Ubuntu (64-bit)". Code and scripts are devloped for:

```
$ lsb_release -a
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu 17.10
Release:	17.10
Codename:	artful
```

However, it is assumed that the tool will run on other Linux versions too.

### Java

The Java Runtime Virtual Machine should depend on the Java versions of other important OpenSource projects, such as
- [OpenDaylight](http://docs.opendaylight.org/en/stable-nitrogen/release-notes/index.html?highlight=Java)
- [ONAP](https://wiki.onap.org/display/DW/Setting+Up+Your+Development+Environment)
- [ONOS](https://wiki.onosproject.org/display/ONOS/Requirements)

The current used version is Java 8.

The following command was used to install Java 8:
```
sudo apt-get install openjdk-8-jdk
```

### Node.js

[Node.js](https://nodejs.org/en/) is required by the [ONF UmlYangTool](https://github.com/OpenNetworkingFoundation/EAGLE-Open-Model-Profile-and-Tools/tree/ToolChain/UmlYangTools).
The following commands were used to install the latest version of Node.js:
```
sudo apt-get install nodejs npm jq --
sudo ln -s /usr/bin/nodejs /usr/bin/node
```

### Python

Python is required by pyang. Please see next chapter

The following commands were used to install Java 8:
```
sudo apt-get install python-setuptools
sudo python setup.py install
```

### Pyang

Pyang(https://github.com/mbj4668/pyang) is needed to validate generated Yang modules and to convert them to yang.tree or yin format.

The following commands were used to install pyang:
```
git clone https://github.com/mbj4668/pyang.git
cd pyang
sudo apt-get install python-setuptools
sudo python setup.py install
cd ..
```

### UnZip

The [Saxon XSLT processor](http://saxon.sourceforge.net/) and the [ONF CoreModel 1.3](https://www.dropbox.com/sh/zns6hihpk2du7k4/AABAYA8ON1edlSAJ8jLBzoZEa/TR%20512%20v1.3/TR-512_v1._3_Publish.zip) can be downloaded as zip files from the internet.
UnZip is used to exctract such files by command line.

The following commands was used to install UnZip.
```
sudo apt-get install unzip
```

## Process

The following figure shows the process to download, prune and refactor UML modules and then to convert them into yang.

![Process](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Process")


## Main scripts

Three scripts are availalble to run a set of commands for converting UML to Yang.

### 01-get-resources

The script automatically downloads the required external rescoures (e.g. UmlYangTools, SAXON, ...) and modifies them if needed. This way the entire UML to Yang generation environment is created. 

Usually this script should be excecuted only once. Please note that this script deletes all files in folder './src/main/resources'.

### 02-prune-and-refactor

The script modidifies the [Papyrus](https://www.eclipse.org/papyrus/) CoreModel.uml file, in order to automatically convert the infomration model (UML) into a data model (YANG).

Basically the all explainmentary Object Classes and Diagrams are removed, type definitions are corrected and yang keys are added.

The result will be used as input for the UmlYangTool.

### 03-uml-to-yang

Finally the this script will run the commands to generate yang modules, yang trees and yin modules form the pruned and refactord UML modules.

The output will be copied into the target folder.
