# xmi-converter

A project that converts xmi (papyrus uml) into other formats, with focus on yang.
The current version is experimental and used to understand and improve IISOMI UML-Guidelines, UML-YANG-Guidelines and the UML-YANG-Tools.

For the translation of Papyrus UML in xmi format to yang the [EagleUmlYang](https://github.com/OpenNetworkingFoundation/EagleUmlYang) tool was copied (commit 7db0e718daba597cd0654adb2eb873505be48fa6). All modifications made here should be contributed back.

## How to get here

This project is under the branch "experimental" of https://github.com/OpenNetworkingFoundation/5G-xHaul.

```bash
mkdir -p $HOME/workspace
cd $HOME/workspace
git clone https://github.com/OpenNetworkingFoundation/5G-xHaul
cd 5G-xHaul
git checkout experimental
cd models/tools
```

## Prerequisites

In order to run the UML-TO-YANG tool and verify the generated yang modules, the following tools and applications are required.
The following commands are tested on ubuntu 18.04.

### java

Please install a Java8 OpenJDK and verify its successful installation.

```bash
sudo apt update
sudo apt install openjdk-8-jdk
java -version
```

### Apache Maven

Please install Apache Maven and verify its successful installation.

```bash
sudo apt update
udo apt install maven
mvn --version
```

The following step is optional but used for ONAP and OpenDaylight development.

```bash
mkdir -p $HOME/.m2
if [ -e $HOME/.m2/settings.xml ] ; then cp -n $HOME//.m2/settings.xml{,.orig} ; fi
wget -q -O - https://git.onap.org/oparent/plain/settings.xml > $HOME/.m2/settings.xml
```

### git

Please install git and verify its successful installation.

```bash
sudo apt update
sudo apt install git
git --version
```

### node

Please install nodejs and verify its successful installation.

```bash
sudo apt update
sudo apt install nodejs npm
nodejs --version
```

### pyang

Please install pyang and verify its successful installation.

```bash
sudo apt update
sudo apt install python3-pip
pip3 install pyang
pyang --version
```

## Usage

The maven script copies the UML files into the project folder of the EagleUmlYang tool and excecutes the node.js script.
The result should be valid yang modules. Thoses are check with pyang. 

Please note: in later releases the copy process fo the UML files will be replaced by a "pruning-and-refactoring" process.
A potential post-processing of the generated yang modules should be avoided. 

```bash
mvn clean install
```

## Test

In order to test the current version and implementation and to figure out what is the best way to attach technology specific conditional packages to core-(information-)model three test UML projects were created.

Please see folder **./src/main/resources/papyrus/test-xmi-to-yang** and import the papyrus projects into your eclipse.

The following figures show how conditional packages can be attached to a core-model:

### Test core model

![test-core-model](./docs/images/TestCoreModel.png "Test core model")

### Test technology specific coditional package model

![test-technology-specific-coditional-package-model](./docs/images/TestTechnologySpecificPac.png "Test technology specific coditional package model")

### Test another coditional package model

![test-another-coditional-package-model](./docs/images/TestAnotherPac.png "Test another coditional package model")

## Expectation

The excpeted result by the UML-TO-YANG tool is documented in file:

[expected yang tree](src/test/resources/expected.tree)