# Code
A common folder to share code for the 3. ONF MWTN PoC.

According to the software architecture ODL internal applications are stored in folder "apps" (applications), while the ODL DLUX client applications are stored in folder "ux" (user experience).

## Software Architecture
The following figure shows the proposed software architecture. 
Please consider it as a "working document" or guidelines.

![Software architecture](software_architecture.png?raw=true "Software architecture")

## Installation

The following instuctions are valid for an Ubuntu version.
Java 1.8 should be installed and the environment variable $JAVA_HOME should be set correctly.
In most of the cases the follow command fits.

```
export JAVA_HOME=/usr/lib/jvm/java-8-oracle
```

### Step #1 - Download, unpack and start OpenDaylight

The 3. ONF MWTN PoC applications are developed for the Beryllium-SR2 release.

```
wget https://nexus.opendaylight.org/content/groups/public/org/opendaylight/integration/distribution-karaf/0.4.2-Beryllium-SR2/distribution-karaf-0.4.2-Beryllium-SR2.tar.gz
tar -xvzf distribution-karaf-0.4.2-Beryllium-SR2.tar.gz
cd distribution-karaf-0.4.2-Beryllium-SR2/
```
The folder "Distribution-karaf-0.4.2-Beryllium-SR2/" is also called "$KARAF_HOME" in the following sections.

Start karaf with:

```
./bin/karaf
```

### Step #2 Preparations

Please follow the install instuctions of the [2. PoC](../../02-MWTN-PoC/test/INSTALL.md). 
In addition please install the package manager for web components:
```
sudo npm install -g bower
```

### Step #3 Clone, build and install the applications.
Open a new terminal and clone the ONF Git reposotory for the open source project 

```
git clone https://github.com/OpenNetworkingFoundation/CENTENNIAL.git
cd CENTENNIAL/03-WTP-PoC/code
```
Install nessesary web components.
```
cd ./ux/mwtnCommons/mwtnCommons-module/src/main/resources/mwtnCommons/
bower install
cd ../../../../../../../
```

Build the applications for the 3. ONF MWTN PoC.
```
mvn clean install -DskipTests
```
It takes some time ...


Copy manually the bundles into the karaf system folder.
```
mkdir -p $KARAF_HOME/system/cn && \
mkdir -p $KARAF_HOME/system/cn/com && \
cp -R ~/.m2/repository/org/opendaylight/mwtn $KARAF_HOME/system/org/opendaylight  && \
cp -R ~/.m2/repository/cn/com/zte $KARAF_HOME/system/cn/com  && \
cp -R ~/.m2/repository/com/hcl $KARAF_HOME/system/com  && \
cp -R ~/.m2/repository/com/highstreet $KARAF_HOME/system/com
```

Now you should be able to add the new bundles in the karaf console.
```
feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/0.3.0-SNAPSHOT/xml/features
```
For remote access of the persistent database ElasticSearch, please consider the instrcutions in the following chapter:
 -* [Persistent database](./apps/persistentDatabase#installation)


Install the karaf features with the following command:
```
feature:install \
odl-netconf-connector-all \
odl-restconf-all \
odl-l2switch-switch \
odl-mdsal-apidocs \
odl-dlux-all \odl-toaster \elasticsearch \
odl-mwtn-all

```
It takes some time ...
