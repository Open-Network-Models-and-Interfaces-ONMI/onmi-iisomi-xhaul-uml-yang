## DVM (Default Values Mediator)

### Overview:
This is a NETCONF Server, based on OpenYuma, that implements the **_CoreModel-CoreNetworkModule-ObjectClasses_**, **_MicrowaveModel-Notifications_** and **_MicrowaveModel-ObjectClasses-MwConnection_** YANG models, offering default values for all their attributes, and an easy approach in order to modify them. 

### How to install:
#### For a mediator VM that was previously downloaded from the FTP server:

1. Make sure you have the latest YANG module files from git and copy them into */usr/share/yuma/modules/CENTENNIAL*
2. Overwrite */home/compila/app/poc2-md/open-yuma/netconf/src/agt/agt_val.c* with the **agt_val.c** file that is available here.
3. Recompile OpenYuma project:

        cd /home/compila/app/poc2-md/open-yuma
        make clean && make && sudo make install
4. Compile the code associated with the YANG models and install in OpenYuma

        cd /home/compila/app/poc2-md/yang-modules/
        make clean && make && sudo make install

#### For a fresh Ubuntu VM:

1. Download and install [OpenYuma](https://github.com/OpenClovis/OpenYuma)
2. Overwrite */home/compila/app/poc2-md/open-yuma/netconf/src/agt/agt_val.c* with the **agt_val.c** file that is available here.
3. Recompile OpenYuma project:

        cd /home/compila/app/poc2-md/open-yuma
        make clean && make && sudo make install

4. Modify the following files (replace the text **_“/home/compila/app/poc2-md/yang-modules/mediatorConfig.txt”_** with the actual path of the file with the same name located in **_yang-modules/mediatorConfig.txt_**):
 * /yang-modules/CoreModel-CoreNetworkModule-ObjectClasses/src/callbacks_CoreModel-CoreNetworkModule-ObjectClasses.c
 * /yang-modules/MicrowaveModel-Notifications/src/u_MicrowaveModel-Notifications.c
 * /yang-modules/MicrowaveModel-ObjectClasses-MwConnection/src/callbacks_MicrowaveModel-ObjectClasses-MwConnection.c
5. Compile the code associated with the YANG models and install in OpenYuma

        cd /home/compila/app/poc2-md/yang-modules/
        make clean && make && sudo make install

### How to run the DVM:

This will start the NETCONF server as a process, in the foreground, and print the debug logs on that specific terminal.

`netconfd  --log-level=debug --access-control=off --no-startup --module=CoreModel-CoreNetworkModule-ObjectClasses --module=MicrowaveModel-ObjectClasses-MwConnection --module=MicrowaveModel-Notifications`


### How to configure the DVM:
#### Light configuration (that do not imply recompiling the modules):

The **mediatorConfig.txt** file contains the values that are customizable without having to recompile the code: _NeName_, _radioSignalId_ and _eventFrequency_.

Its format is simple, and something like:

        radioSignalId: <layer-protocol-value-1-here> <radio-signal-id-integer-here>
        radioSignalId: <layer-protocol-value-2-here> <radio-signal-id-integer-here>
        NeName: <whatever-ne-name-you-would-like-here>
        eventFrequency: <amount-in-seconds-between-dummy-notifications>

If the _eventFrequency_ value is set to 0, the DVM will not send any notifications. Else, it will send a dummy notification, with a interval in time between them specified by that value.

Keep in mind that if you modify this file containing the configurable parameters, you would still need to restart the NETCONF server, if it was already running, in order to see the new values.

#### Extensive customization (that implies recompiling the module)

The values of the YANG attributes are set in the following files:

- /yang-modules/CoreModel-CoreNetworkModule-ObjectClasses/src/callbacks\_CoreModel-CoreNetworkModule-ObjectClasses.c
- /yang-modules/MicrowaveModel-ObjectClasses-MwConnection/src/callbacks\_MicrowaveModel-ObjectClasses-MwConnection.c
- /yang-modules/MicrowaveModel-Notifications/src/u_MicrowaveModel-Notifications.c

For example, this block of code sets the value of the **airInferfaceName** attribute from the **MicrowaveModel-ObjectClasses-MwConnection** YANG model with the dummy value **_AirIntfName_**:

    status_t cb_get_air_interface_configuration_air_interface_name(xmlChar* air_interface_pac_key, xmlChar** air_interface_name)
    {
	xmlChar* airIntName = "AirIntfName";

	*air_interface_name = (xmlChar*) malloc(strlen(airIntName) + 1);
	YUMA_ASSERT(*air_interface_name == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*air_interface_name, airIntName);

	return NO_ERR;
    }

After one of the above files is modified, the code must be recompiled and the NETCONF server restarted:

        cd /home/compila/app/poc2-md/yang-modules/
        make clean && make && sudo make install

Contact
-------

alexandrus@ceragon.com
