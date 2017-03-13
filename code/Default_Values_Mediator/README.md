## Default Values Mediator for Telefonica SDN Trial.

### Overview:
This is a NETCONF Server, based on OpenYuma, that implements the **_microwave-model_** and **_core-model_**, YANG model, offering a default values Mediator that takes as an input an XML file containing values for the majority of the YANG attributes. This provides a simple way of configuring the attributes, by simply modifying the desired value in the XML file and then just restarting the mediator.

This distribution is based on the Default Value Mediator available from the CENTENNIAL project at:
  
  https://github.com/OpenNetworkingFoundation/$DVM_HOME/Default_Values_Mediator

assuming DVM_HOME set to CENTENNIAL/code

### How to install:
#### For a mediator VM that was previously downloaded from the FTP server:

1. Make sure you copy the files from *YANG_files/CENTENNIAL* into */usr/share/yuma/modules/CENTENNIAL*

	```
	sudo rm /usr/share/yuma/modules/CENTENNIAL/*.yang
	sudo cp /home/compila/app/$DVM_HOME/Default_Values_Mediator/YANG_files/CENTENNIAL/*.yang /usr/share/yuma/modules/CENTENNIAL
	```

2.      a. Overwrite */home/compila/app/poc2-md/open-yuma/netconf/src/agt/agt_val.c* with the **agt_val.c** file that is available here.
	```
	cp /home/compila/app/$DVM_HOME/Default_Values_Mediator/agt_val.c /home/compila/app/poc2-md/open-yuma/netconf/src/agt/
	```

	b. Overwrite */home/compila/app/poc2-md/open-yuma/netconf/src/ncx/ncxconst.h* with the **ncxconst.h** file that is available here.
	```
	cp /home/compila/app/$DVM_HOME/Default_Values_Mediator/ncxconst.h /home/compila/app/poc2-md/open-yuma/netconf/src/ncx/
	```

        c. Create the default XML file with the attributes value.
	```
        cp /home/compila/app/$DVM_HOME/Default_Values_Mediator/config/dvm-data.xml /home/compila
	```

4. Recompile OpenYuma project:
	```
	cd /home/compila/app/poc2-md/open-yuma
	make clean && make && sudo make install
	```

5. Compile the code associated with the YANG models and install in OpenYuma
	```
	cd /home/compila/app/$DVM_HOME/Default_Values_Mediator
	make && sudo make install
	```

### How to run the DVM for Telefonica SDN Trial:

This will start the NETCONF server as a process, in the foreground, and print the debug logs on that specific terminal.
```
sudo netconfd --log-level=debug --access-control=off --target=running --no-startup \
	  --module=core-model \
	  --module=microwave-model
```
By default the XML file is:
/home/compila/dvm-data.xml

In order to use this file, you have to copy the file /home/compila/app/$DVM_HOME/Default_Values_Mediator/config/dvm-data.xml in /home/compila.

The environment variable DVM_CONFIG_FILE is provided in order to overwrite the default. 
This variable can be used in the following way (assuming the file to be used is /opt/mediator/my-dvm-data.xml):

sudo DVM_CONFIG_FILE=opt/mediator/my-dvm-data.xml \
     netconfd --log-level=debug --access-control=off --target=running --no-startup \
	  --module=core-model \
	  --module=microwave-model

The NETCONF server can be also started running the script files located in the directory /home/compila/app/$DVM_HOME/Default_Values_Mediator/script:

  - md-install.sh

    This script is used to set the default configuration used by the following two scripts.
    The configuration is stored in the file /home/compila/.mdevconf.
    The command line option -h shows the usage of the script:

      usage: md-install.sh [option] | [-h|--help]
      where option is:
        -e|--md-eth-interfac
e <name>             # Mediation device eth interface name. Default: [eth0]
        -n|--name <name>                         # Network element name. Default: [NE-NAME]
        -a|--controller-ipaddress <ip-adddress>  # SDH controller ip address. Default: [10.10.1.1]
        -p|--controller-port <port>              # SDH controller RESTconf port. Default: [8181]
        -s|--show                                # show configured parameters (defaults)
        -u|--controller-user <user>              # SDH controller user name. Default: [admin]
        -w|--controller-password <pwd>           # SDH controller password. Default: [admin]

    The command line option -s shows the current configured parameters:

      md-install.sh configured parameters:
        Mediation device eth interface name ................ [eth0]
        Network element name ............................... [NE-NAME]
        SDH controller ip address .......................... [10.10.1.1]
        SDH controller RESTconf port ....................... [8181]
        SDH controller user name ........................... [admin]
        SDH controller password ............................ [admin]

    The ethernet interface name is used to obtain the IP address of the mediation device.

  - md-startup.sh

    This script is used to start the mediation device and register (log in) it to the SDH controller.
    The command line option -h and -s are provided also for this script.
    The arguments passed to this script are stored in the file .mdevconfig by updating the contentis set by md-install.sh.
    The script must be run with superuser privileges.
    In order to use the environment variable DVM_CONFIG_FILE the following syntax is suggested:

      sudo DVM_CONFIG_FILE=/opt/mediator/my-dvm-data.xml md-startup.sh


  - md-shutdown.sh

    This script is used to stop the mediation device and deregister (log out) it from the SDH controller.
    The command line option -h and -s are provided also for this script.
    The script must be run with superuser privileges.
    The arguments passed to this script are NOT stored in the file .mdevconfig.

  Since RESTconf call invoked in order to log in (log out) the mediation device to (from) the SDH controller are embedded in a PHP script, could be necessary install the package php5-cli:

    sudo apt-get install php5-cli

### How to configure the DVM:

The values of the YANG attributes are set in the following XML file:

- /home/compila/dvm-data.xml

After the above file is modified, the NETCONF server must be restarted.

The DVM is configured to send a NETCONF notification periodically. 

  <mw-notifications>
    <notification-timeout>60</notification-timeout>
  </mw-notifications>

The timeout, in seconds, between notifications is represented by the XML node notification-timeout.

If a problem-notification needs to be sent, then one element of the following type needs to be added under the mw-notifications XML node:

   <problem-notification>
      <problem-name>signalIsLost</problem-name>
      <obj-id-ref>LP-MWPS-RADIO</obj-id-ref>
      <severity>critical</severity>
      <cleared>critical</cleared>
   </problem-notification>

 If an attribute-value-changed-notification notificaion needs to be send, then one element of the following type needs to be added under the mw-notifications XML node:

   <attribute-value-changed-notification>
     <attribute-name>airInterfaceStatus/modulationCur</attribute-name>
     <obj-id-ref>LP-MWPS-ifIndex1</obj-id-ref>
     <new-value>128</new-value>
   </attribute-value-changed-notification>

 The reading of the values from the XML file is done dynamically, so if a value of an XML node is changed it will be reflected in the mediator without restarting. This is available for the dynamic YANG values, such as the Status, Current Problems, Current Performance or Historical Performance values, or Notifications.

Contact
-------

danilo.pala@siaemic.com


