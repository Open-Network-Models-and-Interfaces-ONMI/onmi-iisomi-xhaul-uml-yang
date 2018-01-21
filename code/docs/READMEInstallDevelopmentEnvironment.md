## 1. Setup ODL network app development environment

Description of how to get an development environment for creating network applications on top of opendaylight.
The development environment is a single server solution with graphical front-end for the developer.
The ODL Boron release is used as basis.

### 1.1. Server setup

Server setup for a development server with eclipse as IDE, ODL Boron Karaf container and NE Simulators.
Remote Desktop is used to access the server via a VPN connection.
  - From Windows PC: MS Remote Desktop
  - From Ubuntu PC: There are some. Example: Remmina Remote Desktop Client (sudo apt install remmina)

Capacity of the VM Server should be about 4 CPUs and 8 Gig of RAM and 50 Gig of HDD.

#### Base software:

  - ubuntu server edition (16.04.03 LTS)
  - xfce desktop
  - xrdp : remote management GUI
    - For setup that supports copy and paste use the PPA Version 0.9.x
    - version standard repository version 0.6.x is basically also working.

#### xrdp PPA install

    1. Do the following steps and restart server if done.
    Answer yes, if asked about overwritin etc/xrdp/xrdp.ini

    ```
    sudo add-apt-repository ppa:hermlnx/xrdp
    sudo apt-get update
    sudo apt-get install xrdp
    sudo apt-get upgrade
    ```

    2. Switch of extensive gui features. In ubuntu desktop goto menu on the left right corner
    to **Applications-> Setting -> Windows Manager Tweaks**, select folder Compositor and
    disable it by unchecking the option.

    3. Improve performance (if required)

    Change configuration in /etc/xrdp/xrdp.ini
      - Security level high to low

    4. Restart server to activate xrdp.

    5. Login with RPC application connect to server. Use defaults and enter existing user an password.


#### Adaption for Windows Client:
  - Adapt TAB key handling ([details askubuntu](https://askubuntu.com/questions/352121/bash-auto-completion-with-xubuntu-and-xrdp-from-windows)):<br/>
    edit the `~/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-keyboard-shortcuts.xml` file to unset the following mapping
    ```
    <       <property name="&lt;Super&gt;Tab" type="string" value="switch_window_key"/>
    ---
    >       <property name="&lt;Super&gt;Tab" type="string" value="empty"/>
    ```
    Note that there may be two entries, and the first already has the value "empty". If this is the case, edit the second entry.

### 1.2 Directory structure

home
  - eclipse (Eclipse installation directory)
  - odl (Workspace)
    - SDN-Projects-Boron (network application)
    - other projects go here
    - distribution-karaf-0.5.3-Boron-SR3 (opendaylight karaf run-time environment)

Prereq:
    - Access to highstreet technologies gitlab server and to project "SDN-Projects-Boron"
    - Gerrit account [Create account](https://wiki.opendaylight.org/view/OpenDaylight_Controller:Gerrit_Setup)


### 1.3 Install Java, eclipse, mvn, draw

  According to CENTENNIAL/code/README.md
  - openjdk (sudo apt-get install)
  - mvn, configure maven for ODL
  - bower
  - ODL Boron distribution

  And this software
  - libre office draw  (sudo apt-get install libreoffice-draw)
  - eclipse via oomph for ODL Development

  Example eclipse configuration for user "Herbert"

  ![eclipse parameters](READMEInstallDevelopmentEnvironment_1_eclipseinst.png?raw=true "Eclipse parameters")

  After install .. change setting below for Secure Store:

  ![eclipse adaption](READMEInstallDevelopmentEnvironment_2_secureStore.png?raw=true "Secure store option")

  Add plugins from eclipse marketplace
    - "GitHub Flavored Markdown viewer plugin 1.8.3" (GFM)
    -

### 2. Create the app

App creation starting point with the ODL example project: [OpenDaylight Controller:MD-SAL:Startup Project Archetype](https://wiki.opendaylight.org/view/OpenDaylight_Controller:MD-SAL:Startup_Project_Archetype)

Create the application by using the related artifacts:

  ```
  mvn archetype:generate -DarchetypeGroupId=org.opendaylight.controller -DarchetypeArtifactId=opendaylight-startup-archetype \
    -DarchetypeRepository=http://nexus.opendaylight.org/content/repositories/opendaylight.release/ \
    -DarchetypeCatalog=remote -DarchetypeVersion=1.2.3-Boron-SR3
  ```

Parameters are like this:
  ```
  groupId: eu.sendate.pathmanagement
  artifactId: ethpathmanager
  version: 0.1.0-SNAPSHOT
  package: eu.sendate.pathmanagement
  classPrefix: ${artifactId.substring(0,1).toUpperCase()}${artifactId.substring(1)}
  copyright: sendate.eu
  copyrightYear: 2018
  ```

Import to eclipse with eclipse -> File -> Import; Maven -> Existing Maven Projects
Switch off eclipse->Project-> Build automatically

=> Add RPC for hello world
=> Change Copyright for new implementation

### Remarks

  - Karaf Intro and Install
  - Simulators (Three times)
