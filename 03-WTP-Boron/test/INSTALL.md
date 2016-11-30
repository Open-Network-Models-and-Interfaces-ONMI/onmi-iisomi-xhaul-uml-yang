How to Install ONF Microwave Transport Network Test Framework
=============================================================

This document describes how to install the ONF Microwave Transport Network Test
Framework on Ubuntu 14.04. These instructions should also work on other Debian
derivative distributions.

Requirements
------------

To run the Test Framework you will need the following software:

  - node.js: the JavaScript runtime environment.

      ```
      curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
      sudo apt-get install -y nodejs
      ```

  - check node.js, npm installations: versions
	
      ```
      node -v  (expected v6.7.0)
      npm -v (expected 3.10.3)
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
      wget https://archive.apache.org/dist/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz
      sudo tar xzvf apache-maven-3.3.9-bin.tar.gz -C /usr/share/
      sudo update-alternatives --install /usr/bin/mvn mvn /usr/share/apache-maven-3.3.9/bin/mvn 150
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


Contact
-------

paolo.spallaccini@hcl.com

[INSTALL.md]:INSTALL.md

