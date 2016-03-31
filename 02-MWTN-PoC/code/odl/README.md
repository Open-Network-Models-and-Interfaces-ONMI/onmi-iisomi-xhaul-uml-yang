Opendaylight: Steps to compile 
==============================

Pre-requisites : 
* maven 3.3.3
* git 2.1.4
* JDK 1.8.0

Compilation Steps :
-------------------

* Clone the repository from https://github.com/OpenNetworkingFoundation/CENTENNIAL.git
~~~~~~~
git clone https://github.com/OpenNetworkingFoundation/CENTENNIAL.git
~~~~~~~

* Setup Opendaylight profiles in the mvn settings as explained in the link below 

https://wiki.opendaylight.org/view/GettingStarted:Development_Environment_Setup

* Go to folder CENTENNIAL/02-MWTN-PoC/code/odl

* Compile the source code 
~~~~~
mvn clean install -DskipTests=true
~~~~~

(Note 1: mvn will download all the required dependency jar files from Opendaylight nexus repository. So internet connectivity is mandatory)
(Note 2: If you are behind proxy, mvn settings - ~/.m2/settings.xml - should be updated with proxy details ) 

* Opendaylight distribution will be created in karaf folder 


Running Opendaylight: 
---------------------

* Go to folder karaf/target/assembly/bin

* Start Karaf 
~~~~~~
./karaf clean 
~~~~~~
* All the required features will be installed automatically 

* Wait for karaf to install features (about 30 seconds) . Monitor the log by typing log:tail and verify odl-mwt-models is installed 
~~~~
2016-03-25 18:11:07,426 | INFO  | oupCloseable-6-1 | NetconfDevice                    | 229 - org.opendaylight.controller.sal-netconf-connector - 1.2.4.Lithium-SR4 | RemoteDevice{controller-config}: Netconf connector initialized successfully
~~~~

By this time all the 22-MWTG models will be copied to cache/schema directory 

* To check if MWTG related features are installed type following command in karaf cli
~~~~~~
feature:list -i | grep 'odl-mwt'
~~~~~~

Integration with OpenYuma Mediator
----------------------------------
* Clone OpenYuma repository from https://github.com/OpenClovis/OpenYuma.git
~~~~~~
git clone https://github.com/OpenClovis/OpenYuma.git
~~~~~~
* Modify the yang models 
This step is necessary as there is yang model revision compatibility between Opendaylight and OpenYuma. While majority of these are resolved, there are still more to be rectified. 
** comment out yang revisions xxx from ietf-yang-types.yang in OpenYuma/netconf/modules/ietf folder 
* Instrument  OpenYuma code for discovery initiation 
A reference implementation using curl library is already shared in the mailing list. In case any clarification is required, pls revert back. 
* Compile the source code 
~~~~~~~~
sudo make clean 
sudo make 
sudo make install 
~~~~~~~~
* Start netconf 

