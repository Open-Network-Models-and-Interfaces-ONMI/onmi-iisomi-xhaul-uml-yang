# Create app for ODL Boron and some backgrounds

## Common information

### Karaf

   - What does it do/ OSGi
   - How does it come and the directory structure
   - Bundles and Features
   - Command line
   - Problems

### network applications

   - commons
   - Karaf / Yang and the device model
   - DLUX

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
