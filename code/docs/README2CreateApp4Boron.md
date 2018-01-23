# Create app for ODL Boron and some backgrounds

## Common information and workshop tasks

### Overall

  - Demo ODL, GUI and Simulators
  - [Opendaylight](http://5g-crosshaul.eu/wp-content/uploads/2016/10/UC3M_5tonic_SdnOdlDay_19Oct2016.pdf)
    - Three slides: 6:MDSAL, 8:AppDev, 11:Karaf
  - Setup Single server development environment
    - Follow [DevEnv](READMEInstallDevelopmentEnvironment.md)
  - Demo Eclipse
  - User's home and the tools to use
  - Git/ Maven &co mvn command, .m2
  - [Documentation Boron](http://docs.opendaylight.org/en/stable-boron/)
  - Hands on server setup (See README.md)

### Karaf

   - OSGi and what does Karaf do
     - [osgi](https://en.wikipedia.org/wiki/OSGi)
     - [karaf](https://stackoverflow.com/questions/17350281/what-exactly-is-apache-karaf)
   - How does it come and the directory structure
     - Opendaylight karaf [odlkaraf](https://nexus.opendaylight.org/content/groups/public/org/opendaylight/integration/distribution-karaf/)
     - show setup
   - Bundles and Features
     - related xml files
   - Start&stop
     - commands start/stop/client
     - command karaf
   - command line
     - start and list features and bundles
   - Debug and log files
     - see read me
   - Problems
     - Startup timing

### Network applications

   - commons bundle and parents
     - See CENTENNIAL/code/features (features-parent)
     - binding-parent => Access of MDSAL
     - config-parent => Push config xml file
   - Karaf / Yang and the device model
   - DLUX, Angular JS, Chromium
   - Clone myapp
   - ODL Datamodel, Access the database and the Netconf model

## 1. Create app for ODL Boron

### 1.1. Prerequirements

- Development environment for ODL Boron according to Description "InstallDevelopmentEnvironment".
- Clone from git the projects CENTENNIAL and WirelessTranportEmulator to get the following structure
    ```
    odl
    ├── CENTENNIAL
    ├── WirelessTransportEmulator
    └── distribution-karaf-0.5.3-Boron-SR3
    ```

### 1.2. Create the app

Approach is to copy the template application in the CENTENNIAL repository apps directory and adapt it to the needs.<br/>
  - Northbound: Provide RPC northbound
  - Southbound: Monitors mountpoints connected to netconf devices.

The template app is located here:

    CENTENNIAL/code/apps/template/
    ├── api
    │   ├── pom.xml
    │   └── src
    ├── impl
    │   ├── pom.xml
    │   └── src
    └── pom.xml

Copy template to a new directory

    cd ~/odl/CENTENNIAL/code/apps
    cp -r template myapp

### 1.3. Adapt myapp

### 1.4. Change POM files

### 1.5. Adapt install.sh script

## 2.0 Test and debug app

### 2.1 Setup and connect netconf simulator


### 2.2 Setup ODL debug level


### Remarks

  - Karaf Intro and Install
  - Simulators
