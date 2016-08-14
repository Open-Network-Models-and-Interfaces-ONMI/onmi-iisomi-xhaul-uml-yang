# Code
A common folder to share code for the 3. ONF MWTN PoC.

According to the software architecture ODL internal applications are stored in folder "apps" (applications), while the ODL DLUX client applications are stored in folder "ux" (user experience).

## Software Architecture
The following figure shows the proposed software architecture. 
Please consider it as a "working document" or guidelines.

![Software architecture](software_architecture.png?raw=true "Software architecture")

## Installation
Please consider:
* [Persistent database](./apps/persistentDatabase#installation)
* [MWTN comments](./ux/mwtnCommons/mwtnCommons-module/src/main/resources/mwtnCommons/README.md#installation)

Currently there is a karaf feature.xml definition missing, because the entire use cases and its implementation is under discussion. (sko: please feel free to start the development of the feature.xml ;) ) The procedure to run the OSGi bundel in karaf is:

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
