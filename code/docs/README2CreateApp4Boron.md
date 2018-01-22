# Create app for ODL Boron and some backgrounds

## Common information and workshop tasks

### Overall

  - Setup Single server development environment
  - User's home and the tools to use
  - Git/ Maven and co mvn command, .m2
  + Hands on server setup (See README.md)
  + Demo ODL, GUI and Simulators
  + Demo Eclipse

### Karaf

   - OSGi and what does Karaf do
   - How does it come and the directory structure
   - Bundles and Features
   - Start&stop
   - command line
   - Debug and log files
   - Problems

### Network applications

   - commons bundle and parents
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
