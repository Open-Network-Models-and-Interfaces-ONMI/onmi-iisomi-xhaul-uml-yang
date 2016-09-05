## Base Mediator

### Overview:
This is a NETCONF Server, based on OpenYuma, that implements the **_MicrowaveModel-ObjectClasses-AirInterface_** YANG model, offering a base Mediator providing callback functions for each YANG attribute, and an easy approach in order to modify them for getting the actual values from the Network Element (NE).

### How to install:
#### For a mediator VM that was previously downloaded from the FTP server:

1. Make sure you copy the files from *YANG_files/CENTENNIAL* into */usr/share/yuma/modules/CENTENNIAL*

	```
		sudo rm /usr/share/yuma/modules/CENTENNIAL/*.yang
		sudo cp /home/compila/app/CENTENNIAL/03-WTP-PoC/code/Base_Mediator/YANG_files/CENTENNIAL/*.yang /usr/share/yuma/modules/CENTENNIAL
	```

2. Overwrite */home/compila/app/poc2-md/open-yuma/netconf/src/agt/agt_val.c* with the **agt_val.c** file that is available here.
	```
		cp /home/compila/app/CENTENNIAL/03-WTP-PoC/code/Base_Mediator/agt_val.c /home/compila/app/poc2-md/open-yuma/netconf/src/agt/
	```

3. Recompile OpenYuma project:
	```
		cd /home/compila/app/poc2-md/open-yuma
		make clean && make && sudo make install
	```

4. Compile the code associated with the YANG models and install in OpenYuma
	```
		cd /home/compila/app/CENTENNIAL/03-WTP-PoC/code/Base_Mediator
		make && sudo make install
	```

### How to run the Base Mediator:

This will start the NETCONF server as a process, in the foreground, and print the debug logs on that specific terminal.
```
	netconfd  --log-level=debug --access-control=off --target=running --no-startup \
	--module=CoreModel-CoreNetworkModule-ObjectClasses \
	--module=MicrowaveModel-ObjectClasses-AirInterface
```


### How to configure the Base Mediator:

The values of the YANG attributes are set in the following files:

- Base_Mediator\YUMA_modules\Base_mediator_utils\src\*_callbacks.c

- boot_time_callbacks.c: here are the callbacks that are used when the mediator boots up (getting the list of layerProtocol keys, capabilities, etc.);
- runtime_callbacks.c: here are the callbacks that are used to get dynamic information from the device (currentProblems, historicalPerformanceData, etc.).

After one of the above files is modified, the code must be recompiled and the NETCONF server restarted:

```
	cd /home/compila/app/CENTENNIAL/03-WTP-PoC/code/Base_Mediator
	make && sudo make install
```

Contact
-------

alexandrus@ceragon.com
