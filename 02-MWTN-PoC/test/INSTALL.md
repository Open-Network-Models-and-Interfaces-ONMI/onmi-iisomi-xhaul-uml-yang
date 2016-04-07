How to Install ONF Microwave Transport Network Test Framework
=============================================================

This document describes how to install the ONF Microwave Transport Network Test
Framework on Ubuntu 14.04. These instructions should also work on other Debian
derivative distributions.

Requirements
------------

To run the test framework you will need the following software:

  - node.js: the JavaScript runtime environment.

      ```
      sudo apt-get install nodejs npm jq
      sudo update-alternatives --install /usr/bin/node node /usr/bin/nodejs 150
      sudo update-alternatives --config node
      ```

  - grunt: the JavaScript task runner.

      ```
      sudo npm install -g grunt-cli
      ```

  - java-jdk: the Java development kit.

      ```
      sudo add-apt-repository ppa:openjdk-r/ppa
      sudo apt-get update 
      sudo apt-get install openjdk-8-jdk
      sudo update-alternatives --config java
      sudo update-alternatives --config javac
      ```

  - maven: the Apache build manager for Java projects.

      ```
      wget https://archive.apache.org/dist/maven/maven-3/3.3.3/binaries/apache-maven-3.3.3-bin.tar.gz
      sudo tar xzvf apache-maven-3.3.3-bin.tar.gz -C /usr/share/
      sudo update-alternatives --install /usr/bin/mvn mvn /usr/share/apache-maven-3.3.3/bin/mvn 150
      sudo update-alternatives --config mvn
      ```

  - docker: the operating-system-level virtualization system on Linux.

      ```
      sudo apt-get install curl
      curl -fsSL https://get.docker.com/ | sh
      sudo usermod -aG docker <user1>
      ...
      sudo usermod -aG docker <userN>
      sudo reboot
      ```

