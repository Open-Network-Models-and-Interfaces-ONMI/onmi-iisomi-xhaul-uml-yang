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
  - chromium

#### xrdp PPA install

Do the following steps and restart server if done.

1. Answer yes, if asked about overwriting etc/xrdp/xrdp.ini

    ```
    sudo add-apt-repository ppa:hermlnx/xrdp
    sudo apt-get update
    sudo apt-get install xrdp
    sudo apt-get upgrade
    ```

2. Switch of extensive gui features. In ubuntu desktop goto menu on the left right corner <br/>
   to **Applications-> Settings -> Windows Manager Tweaks**, select folder Compositor and
   disable it by unchecking the option.

3. Improve performance (if required)

  Change configuration in /etc/xrdp/xrdp.ini
      - Security level high to none

4. Change sudo vi /etc/xrdp/sessman.ini and add change to '.thinclient_drives' (see the dot)

    [Chansrv]
    ; drive redirection, defaults to xrdp_client if not set
    FuseMountName=.thinclient_drives


4. reboot server to activate xrdp configuration

5. Login with RPC application connect to server. Use defaults and enter existing user an password.


#### Adaption for Windows Client:
  - Adapt TAB key handling ([details askubuntu](https://askubuntu.com/questions/352121/bash-auto-completion-with-xubuntu-and-xrdp-from-windows)):<br/>
    edit the `~/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-keyboard-shortcuts.xml` file to unset the following mapping
    ```
    <       <property name="&lt;Super&gt;Tab" type="string" value="switch_window_key"/>
    ---
    >       <property name="&lt;Super&gt;Tab" type="string" value="empty"/>
    ```
    NOTE: There may be two entries, and the first already has the value "empty". If this is the case, edit the second entry.

#### Adding further tools

Add chromium as browser
    - See [details askubuntu](https://wiki.ubuntuusers.de/Chromium/Installation/)

    sudo apt-get install chromium-browser chromium-browser-l10n chromium-codecs-ffmpeg

### 1.2 Directory structure

home
  - eclipse (Eclipse installation directory)
  - odl (Workspace)
    - CENTENNIAL (network application)
    - other projects go here
    - distribution-karaf-0.6.1-Carbon (opendaylight karaf run-time environment)

Prereq:
    - Access to highstreet technologies gitlab server and to project "CENTENNIAL"
    - Gerrit account [Create account](https://wiki.opendaylight.org/view/OpenDaylight_Controller:Gerrit_Setup)


### 1.3 Install setup ODL_KARAF_HOME, Java, eclipse, mvn, draw and tools

  Setup in home directory .bashrc like follows and logout/login to activate.

     export ODL_KARAF_DIST="distribution-karaf-0.6.1-Carbon"
     export ODL_KARAF_HOME="$HOME/odl/$ODL_KARAF_DIST"
     export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"

  Verify

      echo $ODL_KARAF_HOME

  According to step 2.2 [CENTENNIAL/code/README.md](../README.md#step-22---download-CENTENNIAL-applications)
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
    - Elcipse YANG editor


### 2. Create app

See the documentation [create app documentation](READMECreateApp4Carbon.md)


### 3. Remarks

  - Karaf Intro and Install
  - Simulators (Three times)
