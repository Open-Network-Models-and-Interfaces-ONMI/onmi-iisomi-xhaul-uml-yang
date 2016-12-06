## Default Values Mediator (DVM v03)

### Overview:
This is a NETCONF Server, based on OpenYuma, that implements the **_MicrowaveModel-ObjectClasses-AirInterface_**, **_MicrowaveModel-ObjectClasses-PureEthernetStructure_**, **_MicrowaveModel-ObjectClasses-EthernetContainer_**, **_CoreModel-CoreNetworkModule-ObjectClasses_**, **_MicrowaveModel-Notifications_** YANG model, offering a default values Mediator that takes as an input an XML file containing values for the majority of the YANG attributes. This provides a simple way of configuring the attributes, by simply modifying the desired value in the XML file and then just restarting the mediator.

### How to install:
#### For a mediator VM that was previously downloaded from the FTP server:

1. Make sure you copy the files from *YANG_files/CENTENNIAL* into */usr/share/yuma/modules/CENTENNIAL*

	```
	sudo rm /usr/share/yuma/modules/CENTENNIAL/*.yang
	sudo cp /home/compila/app/CENTENNIAL/code/Default_Values_Mediator/YANG_files/CENTENNIAL/*.yang /usr/share/yuma/modules/CENTENNIAL
	```

2. 

	a. Overwrite */home/compila/app/poc2-md/open-yuma/netconf/src/agt/agt_val.c* with the **agt_val.c** file that is available here.
	```
	cp /home/compila/app/CENTENNIAL/code/Default_Values_Mediator/agt_val.c /home/compila/app/poc2-md/open-yuma/netconf/src/agt/
	```

	b. Overwrite */home/compila/app/poc2-md/open-yuma/netconf/src/ncx/ncxconst.h* with the **ncxconst.h** file that is available here.
	```
	cp /home/compila/app/CENTENNIAL/code/Default_Values_Mediator/ncxconst.h /home/compila/app/poc2-md/open-yuma/netconf/src/ncx/
	```

3. Recompile OpenYuma project:
	```
	cd /home/compila/app/poc2-md/open-yuma
	make clean && make && sudo make install
	```

4. Compile the code associated with the YANG models and install in OpenYuma
	```
	cd /home/compila/app/CENTENNIAL/code/Default_Values_Mediator
	make && sudo make install
	```

### How to run the DVM v03:

This will start the NETCONF server as a process, in the foreground, and print the debug logs on that specific terminal.
```
sudo netconfd  --log-level=debug --access-control=off --target=running --no-startup \
	  --module=CoreModel-CoreNetworkModule-ObjectClasses \
	  --module=MicrowaveModel-ObjectClasses-AirInterface \
	  --module=MicrowaveModel-ObjectClasses-PureEthernetStructure \
	  --module=MicrowaveModel-ObjectClasses-EthernetContainer \
	  --module=MicrowaveModel-Notifications
```


### How to configure the DVM:

The values of the YANG attributes are set in the following XML file:

- Default_Values_Mediator\YUMA_modules\Base_mediator_utils\src\DVM_MicrowaveModel-ObjectClasses-AirInterface.xml

After the above file is modified, the NETCONF server must be restarted.

The DVM is configured to send a NETCONF notification periodically. 

<MW_Notifications>
  <notificationTimeout>60</notificationTimeout>
</MW_Notifications>

The timeout, in seconds, between notifications is represented by the XML node notificationTimeout.

If a problemNotification needs to be sent, then one element of the following type needs to be added under the MW_Notifications XML node:

<problemNotification>
    <problemName>signalIsLost</problemName>
    <objIdRef>MW_AirInterface_Pac[layerProtocol=LP-MWPS-ifIndex1]</objIdRef>
    <severity>non-alarmed</severity>
  </problemNotification>

 If an attributeValueChanged notificaion needs to be send, then one element of the following type needs to be added under the MW_Notifications XML node:

 <attributeValueChangedNotification>
   <attributeName>modulationCur</attributeName>
   <objIdRef>MW_AirInterface_Pac[layerProtocol=LP-MWPS-ifIndex1]/airInterfaceStatus</objIdRef>
   <newValue>128</newValue>
 </attributeValueChangedNotification>

 The reading of the values from the XML file is done dynamically, so if a value of an XML node is changed it will be reflected in the mediator without restarting. This is available for the dynamic YANG values, such as the Status, Current Problems, Current Performance or Historical Performance values, or Notifications.

Contact
-------

alexandrus@ceragon.com


