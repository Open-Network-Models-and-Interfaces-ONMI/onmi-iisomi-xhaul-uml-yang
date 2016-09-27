## Default Values Mediator (DVM v03)

### Overview:
This is a NETCONF Server, based on OpenYuma, that implements the **_MicrowaveModel-ObjectClasses-AirInterface_**, **_MicrowaveModel-ObjectClasses-PureEthernetStructure_**, **_MicrowaveModel-ObjectClasses-EthernetContainer_**, **_CoreModel-CoreNetworkModule-ObjectClasses_**, **_MicrowaveModel-Notifications_** YANG model, offering a default values Mediator that takes as an input an XML file containing values for the majority of the YANG attributes. This provides a simple way of configuring the attributes, by simply modifying the desired value in the XML file and then just restarting the mediator.

### How to install:
#### For a mediator VM that was previously downloaded from the FTP server:

1. Make sure you copy the files from *YANG_files/CENTENNIAL* into */usr/share/yuma/modules/CENTENNIAL*

	```
	sudo rm /usr/share/yuma/modules/CENTENNIAL/*.yang
	sudo cp /home/compila/app/CENTENNIAL/03-WTP-PoC/code/Default_Values_Mediator/YANG_files/CENTENNIAL/*.yang /usr/share/yuma/modules/CENTENNIAL
	```

2. Overwrite */home/compila/app/poc2-md/open-yuma/netconf/src/agt/agt_val.c* with the **agt_val.c** file that is available here.
	```
	cp /home/compila/app/CENTENNIAL/03-WTP-PoC/code/Default_Values_Mediator/agt_val.c /home/compila/app/poc2-md/open-yuma/netconf/src/agt/
	```

3. Recompile OpenYuma project:
	```
	cd /home/compila/app/poc2-md/open-yuma
	make clean && make && sudo make install
	```

4. Compile the code associated with the YANG models and install in OpenYuma
	```
	cd /home/compila/app/CENTENNIAL/03-WTP-PoC/code/Default_Values_Mediator
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

After the above file is modified, the NETCONF server must be restarted restarted.

Contact
-------

alexandrus@ceragon.com


