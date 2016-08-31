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

### Step #2 Clone, build and install the applications.
Before the application can be build the apache build manager maven needs to be installed and configured.

```
wget https://archive.apache.org/dist/maven/maven-3/3.3.3/binaries/apache-maven-3.3.3-bin.tar.gz
sudo tar xzvf apache-maven-3.3.3-bin.tar.gz -C /usr/share/
sudo update-alternatives --install /usr/bin/mvn mvn /usr/share/apache-maven-3.3.3/bin/mvn 150
sudo update-alternatives --config mvn
```
OpenDaylight requires specific maven settings.

```
cp -n ~/.m2/settings.xml{,.orig}
curl -L -s -o ~/.m2/settings.xml https://raw.githubusercontent.com/opendaylight/odlparent/master/settings.xml
```

Open a new terminal and clone the ONF Git reposotory for the open source project 

```
git clone https://github.com/OpenNetworkingFoundation/CENTENNIAL.git
cd CENTENNIAL/03-WTP-PoC/code
```



First the applications and OSGi Java bundels must be build with the command:
```
mvn clean install -DskipTests
```
Copy manually the bundles into the karaf system folder.
```
mkdir -p $KARAF_HOME/system/cn && \
mkdir -p $KARAF_HOME/system/cn/com && \
cp -R ~/.m2/repository/cn/com/zte $KARAF_HOME/system/cn/com  && \
cp -R ~/.m2/repository/com/hcl $KARAF_HOME/system/com  && \
cp -R ~/.m2/repository/com/highstreet $KARAF_HOME/system/com
```

Now you are able to start the bundles in the karaf console:
```
bundle:install -s \
mvn:com.highstreet.technologies.odl.dlux/mwtnCommons-bundle/0.3.0-SNAPSHOT \
mvn:com.highstreet.technologies.odl.dlux/mwtnConnect-bundle/0.3.0-SNAPSHOT \
mvn:com.highstreet.technologies.odl.dlux/mwtnCompare-bundle/0.3.0-SNAPSHOT \
mvn:com.highstreet.technologies.odl.dlux/mwtnConfig-bundle/0.3.0-SNAPSHOT \
mvn:com.highstreet.technologies.odl.dlux/mwtnTopology-bundle/0.3.0-SNAPSHOT \
mvn:cn.com.zte.odl.dlux/mwtnSpectrum-bundle/0.3.0-SNAPSHOT \
mvn:com.highstreet.technologies.odl.dlux/mwtnClosedLoop-bundle/0.3.0-SNAPSHOT \
mvn:com.highstreet.technologies.odl.dlux/mwtnEvents-bundle/0.3.0-SNAPSHOT \
mvn:com.hcl.odl.dlux/mwtnTest-bundle/0.3.0-SNAPSHOT \
mvn:com.highstreet.technologies.odl.dlux/mwtnLog-bundle/0.3.0-SNAPSHOT \
mvn:com.highstreet.technologies.odl.dlux/odlChat-bundle/0.3.0-SNAPSHOT
```

To uninstall the bundles you can use the following command:
```
bundle:uninstall \
"ODL :: Microwave Transport Network :: odlChat-bundle" \
"ODL :: Microwave Transport Network :: mwtnTest-bundle" \
"ODL :: Microwave Transport Network :: mwtnLog-bundle" \
"ODL :: Microwave Transport Network :: mwtnEvents-bundle" \
"ODL :: Microwave Transport Network :: mwtnClosedLoop-bundle" \
"ODL :: Microwave Transport Network :: mwtnSpectrum-bundle" \
"ODL :: Microwave Transport Network :: mwtnTopology-bundle" \
"ODL :: Microwave Transport Network :: mwtnConfig-bundle" \
"ODL :: Microwave Transport Network :: mwtnCompare-bundle" \
"ODL :: Microwave Transport Network :: mwtnConnect-bundle" \
"ODL :: Microwave Transport Network :: mwtnCommons-bundle"
```
