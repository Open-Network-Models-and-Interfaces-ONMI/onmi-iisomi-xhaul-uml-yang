# Code
A common folder to share code for the 4th ONF Wireless PoC.

According to the software architecture ODL internal applications are stored in folder "apps" (applications), while the ODL DLUX client applications are stored in folder "ux" (user experience).

## Software Architecture
The following figure shows the proposed software architecture.
Please consider it as a "working document" or guidelines.

![Software architecture](software_architecture.png?raw=true "Software architecture")

## Installation

This chapter describes how to install the SDN-Controller OpenDaylight and the applications
of the 4. ONF Microwave Transport Network Proof-of-Concept on Ubuntu 16.04.
These instructions should/could work also on other Debian derivative distributions.

There are two choices:

  - **Choice 1**: ODL for test and demonstration. Simple installation without need to compile, preconfigured for 4. ONF PoC.
  - **Choice 2**: ODL for application development. Installation to be able to develop and compile apps.

### Choice 1: Installation for test&demo (tar package, pre-compiled and configured)

Environment for this test&demo configuration, recommended to use.
  - Ubuntu 16.04 LTS Desktop version
  - Java 8, (Recommended: openJdk 8)
  - Browser: Google Chrome (Ubuntu or Windows version for external client)
  - VM with about 2-3 Cores and 4-6 GB RAM and 20 GB HD space
  - Base directory for ODL installation: ~/odl
  - Downloads are to: ~/Downloads
  - Best option but not required: $JAVA_HOME points to java (similar to: JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64)
  - SECURITY HINT: This configuration is not suitable to be public available via Internet.

#### Step *1: Get tar file with karaf/ODL

  Use a browser for the download (Chrome).
  - Copy into browser: [https://drive.google.com/file/d/0BwbcJFD90EFQbEVCaTMyS3ZOY1E/view?usp=sharing](https://drive.google.com/file/d/0BwbcJFD90EFQbEVCaTMyS3ZOY1E/view?usp=sharing)
  - Ignore Message about unknown format and select "Download".
  - Download should be into ~/Downloads (Reference download directory for this step-by-step instructions)
  - Filename is: onf-wireless-4th-poc-karaf-0.5.1-Boron-SR1-2017-06-13.tar.gz

#### Step *2: Unpack tar-file

  Expand with tar in a directory of you choice under your home. Recommended is be ~/odl
  cd to selected directory. Create if necessary.

  ```
  cd ~/odl
  tar -xvf ../Downloads/onf-wireless-4th-poc-karaf-0.5.1-Boron-SR1-2017-06-13.tar.gz
  ```

#### Step *3: Setup environment variables

  Edit your ~/.profile an add at the end the entry for ODL/ karaf home directory

   ```
   cd ~
   vi .profile
   ```
   Add at the end of .profile:
   ```
   export ODL_KARAF_HOME=$HOME/odl/onf-wireless-4th-poc-karaf-0.5.1-Boron-SR1-2017-06-13
   ```
   To activate varable best option is to logout and login user again.
   Verify with:
   ```
   echo $ODL_KARAF_HOME
   ```


#### Step *4: Prepare

   If the file "$ODL_KARAF_HOME/etc/org.ops4j.pax.web.cfg" exists, remove it.
   ```
   rm $ODL_KARAF_HOME/etc/org.ops4j.pax.web.cfg
   ```


#### Step *5:  Do a clean start to install

  In the shell command line do the following steps.

  ```
  cd $ODL_KARAF_HOME
  ./bin/karaf clean
   ```
  Wait till command line is prompted, like "opendaylight-user@root>".
  Copy into the command line the following lines.
  Each command needs some time. Time to complete, about 5 minutes.

   ```
  feature:install odl-netconf-connector-all
  feature:install odl-netconf-topology
  feature:install odl-restconf-all
  sleep 5000
  feature:install odl-mdsal-apidocs
  feature:install odl-dlux-all
  feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/0.4.0-SNAPSHOT/xml/features
  feature:install elasticsearch
  feature:install odl-mwtn-all
  bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnEvents-bundle/0.4.0-SNAPSHOT
   ```
  If no error occurred leave karaf command line and shutdown ODL with "logout".

  ```
  logout
  ```
  ODL is stopped now.

  **Hint: A second restart of ODL is necessary (see Step 5) to be able to login successfully.**

#### Step *5: Do a restart

  ```
   cd $ODL_KARAF_HOME
   ./bin/karaf
  ```

  After about 2-3 Minutes ODL start and you can connect with the browser.
  **HINT: If ODL is started via "./bin/karaf" it is always stopped if you leave the command line with logout.**

  Connect with browser on odl-ubuntu-server with localhost to verify installation:
  * [Localhost login "http://127.0.0.1:8181/index.html"](http://127.0.0.1:8181/index.html)
  * [Localhost ES-Viewer "http://127.0.0.1:9200/_plugin/head"](http://127.0.0.1:9200/_plugin/head)


  Ports, used between Browser-client and ODL: 9200, 8085, 8185, 8181.

### Choice 2: Installation for ODL application development (compile apps)

#### Step #1 Preparations

  - java-jdk: the Java development kit.

    Java8 is mandatory, below one of thousend procedures to install java8 on ubuntu.

      ```
      wget http://www.java.net/download/jdk8u60/archive/b07/binaries/jdk-8u60-ea-bin-b07-linux-x64-17_mar_2015.tar.gz
      sudo tar -xzvf jdk-8u60-ea-bin-b07-linux-x64-17_mar_2015.tar.gz
      sudo mkdir /usr/lib/jvm
      sudo mv ~/jdk1.8.0_60/ /usr/lib/jvm/
      sudo chown -R root:root /usr/lib/jvm/jdk1.8.0_60/
      sudo update-alternatives --install "/usr/bin/java" "java" "/usr/lib/jvm/jdk1.8.0_60/bin/java" 0
      sudo update-alternatives --install "/usr/bin/javac" "javac" "/usr/lib/jvm/jdk1.8.0_60/bin/javac" 0
      sudo update-alternatives --set java /usr/lib/jvm/jdk1.8.0_60/bin/java
      sudo update-alternatives --set javac /usr/lib/jvm/jdk1.8.0_60/bin/javac
      ```

      Add the following two lines at the end of the profile file
      ```
      export JAVA_HOME=/usr/lib/jvm/jdk1.8.0_60
      export PATH=$PATH:$JAVA_HOME/bin
      ```
      ... and activate the profile.
      ```
      source /etc/profile
      ```

      Verify java installation :
      ```
      update-alternatives --list java
      update-alternatives --list javac
      echo $JAVA_HOME
      java -version
      ```

  - maven: the Apache build manager for Java projects.
           Follow the [maven installation](https://maven.apache.org/install.html) instructions.

       Here a short version.

      ```
      wget https://archive.apache.org/dist/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz
      sudo tar xzvf apache-maven-3.3.9-bin.tar.gz -C /usr/share/
      sudo update-alternatives --install /usr/bin/mvn mvn /usr/share/apache-maven-3.3.9/bin/mvn 150
      sudo update-alternatives --config mvn
      export PATH=/usr/share/apache-maven-3.3.9/bin:$PATH
      ```

      Feel to update PATH variable in /etc/environment.

      OpenDaylight requires specific maven settings. Please see  [ODL wiki](https://wiki.opendaylight.org/view/GettingStarted:Development_Environment_Setup#Edit_your_.7E.2F.m2.2Fsettings.xml)

      ```
      mkdir -p ~/.m2 && \
      cp -n ~/.m2/settings.xml{,.orig} ; \
      wget -q -O - https://raw.githubusercontent.com/opendaylight/odlparent/master/settings.xml > ~/.m2/settings.xml
      ```

  - git: the version control system.

      ```
      sudo apt-get install git
      ```

  - node.js: the JavaScript runtime environment.

      ```
      sudo apt-get install nodejs npm jq --
      sudo update-alternatives --install /usr/bin/node node /usr/bin/nodejs 150
      sudo update-alternatives --config node
      sudo ln -s /usr/bin/nodejs /usr/bin/node
      curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
      sudo apt-get install -y nodejs
      sudo npm install -g npm
      ```
      Please see also the instrucion for the [test automation app](https://github.com/OpenNetworkingFoundation/CENTENNIAL/blob/master/test/INSTALL.md).

  - bower: the package manager for the web components.

      ```
      sudo npm install -g bower
      ```

The setup can be verified with the following commands:

package | min. Version
------- | -----------
java -version | 1.8
mvn --version | 3.3.9
git --version | 2.7.4
node --version | 6.7.0
npm --version | 3.10.3
jq --version | 1.5
bower --version | 1.7.9


#### Step #2 - OpenDaylight and database

Example directory structure under user's home:
```
drwxrwxr-x  5 your_user_name your_user_name 4096 Okt 25 17:18 ./
drwxr-xr-x 25 your_user_name your_user_name 4096 Okt 25 16:50 ../
drwxrwxr-x 15 your_user_name your_user_name 4096 Okt 20 14:26 CENTENNIAL/
drwxrwxr-x 14 your_user_name your_user_name 4096 Okt 25 20:04 distribution-karaf-0.5.1-Boron-SR1/
drwxrwxr-x  6 your_user_name your_user_name 4096 Okt 25 17:18 elasticsearch-head/
```

##### Step #2.1 - Download Karaf/ Opendaylight package and unpack
The 4th ONF Wireless PoC applications are developed for OpenDaylight Boron-SR1 release.

```
wget https://nexus.opendaylight.org/content/repositories/public/org/opendaylight/integration/distribution-karaf/0.5.1-Boron-SR1/distribution-karaf-0.5.1-Boron-SR1.tar.gz
tar -xvzf distribution-karaf-0.5.1-Boron-SR1.tar.gz
cd distribution-karaf-0.5.1-Boron-SR1/
```
The folder "distribution-karaf-0.5.1-Boron-SR1/" is also called "$ODL_KARAF_HOME" in the following sections.
Add an environment variable with an editor to the end of ~/.profile and ~/.bashrc

```
export ODL_KARAF_HOME="$HOME/distribution-karaf-0.5.1-Boron-SR1"
```
 Activate the change with
```
. .profile
```

##### Step #2.2 - Download CENTENNIAL applications
Clone the ONF Git repository for the open source project

```
cd ~
git clone https://github.com/OpenNetworkingFoundation/CENTENNIAL.git
cd CENTENNIAL/code
```

##### Step #2.3 -  Start Karaf and install ElasticSearch
Start karaf with:
```
cd $ODL_KARAF_HOME
./bin/karaf
```

For installation and remote access of the persistent database ElasticSearch,
please follow the instructions in [Install persistent database](./apps/persistentDatabase#installation)

#### Step #3 Modify, build, install and start the PoC applications and OpenDaylight
Karaf is not running for the next steps. In Karaf CLI shutdown and confirm (yes) if necessary.
```
shutdown
```

##### Step #3.1 - Patch
For a robust web GUI it is necessary to add a ["patch"](https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/code/apps/dlux) to ODL DLUX.
```
cp ./apps/dlux/loader.implementation-0.4.1-Boron-SR1.jar $ODL_KARAF_HOME/system/org/opendaylight/dlux/loader.implementation/0.4.1-Boron-SR1
```

Install necessary web components.
```
cd ./ux/mwtnCommons/mwtnCommons-module/src/main/resources/mwtnCommons/
bower install
cd ../../../../../../../
```

##### Step #3.2 - Build
Build the applications for the 4th ONF Wireless PoC at folder 'CENTENNIAL/code'.
```
mvn clean install -DskipTests
```
It takes some time (frist time 20min, in my case) ...


Copy manually the bundles into the karaf system folder.
```
mkdir -p $ODL_KARAF_HOME/system/cn
mkdir -p $ODL_KARAF_HOME/system/cn/com
cp -R ~/.m2/repository/org/opendaylight/mwtn $ODL_KARAF_HOME/system/org/opendaylight
cp -R ~/.m2/repository/cn/com/zte $ODL_KARAF_HOME/system/cn/com
cp -R ~/.m2/repository/com/hcl $ODL_KARAF_HOME/system/com
cp -R ~/.m2/repository/com/highstreet $ODL_KARAF_HOME/system/com
```

##### Step #3.3 - Install and run
Start karaf with clean:
```
cd $ODL_KARAF_HOME
./bin/karaf clean
```

Install the karaf features with the following command:
```
feature:install odl-netconf-connector-all odl-l2switch-switch
feature:install odl-netconf-topology
feature:install odl-restconf-all odl-mdsal-apidocs odl-dlux-all odl-toaster
```
Now you should be able to add the new bundles in the karaf console.
```
feature:repo-add mvn:org.apache.karaf.decanter/apache-karaf-decanter/1.1.0/xml/features
feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/0.4.0-SNAPSHOT/xml/features
```
 ... and install them:
```
feature:install elasticsearch
feature:install odl-mwt-models odl-mwtn-all
```
It takes some time ...

[Spectrum Management application](https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/code/apps/spectrum):
```
feature:repo-add mvn:com.highstreet.technologies.odl.app.spectrum/scheduler-features/0.4.0-SNAPSHOT/xml/features
bundle:install -s mvn:net.iharder/base64/2.3.9
bundle:install -s mvn:com.github.briandilley.jsonrpc4j/jsonrpc4j/1.2.0
bundle:install -s mvn:com.sun.jersey/jersey-client/1.17
feature:install odl-scheduler odl-scheduler-api odl-scheduler-rest odl-scheduler-ui
```
[Closed Loop Automation application](https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/code/apps/closedLoopAutomation):
```
feature:repo-add mvn:com.highstreet.technologies.odl.app/closedLoopAutomation-features/0.4.0-SNAPSHOT/xml/features
feature:install odl-closedLoopAutomation
```

Subsequent starts are without clean:
```
cd $ODL_KARAF_HOME
./bin/karaf
```
