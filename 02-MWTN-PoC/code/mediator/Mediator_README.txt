Steps to compile the default values mediator:

	0.1. Make sure you have the latest git YANG module files from git(you can do a "git pull" command in /home/compila/app/CENTENNIAL and then copy the files from /home/compila/app/CENTENNIAL/02-MWTN-PoC/models/24-reducedCoreModel-MWTN-Prio1/yang into /usr/share/yuma/modules/CENTENNIAL
	0.2. Delete existing folder  /home/compila/app/poc2-md/yang-modules and copy yang-modules folder from this repository to: /home/compila/app/poc2-md/ (replace the previous yang-modules folder).
	0.3. Overwrite /home/compila/app/poc2-md/open-yuma/netconf/src/agt/agt_val.c with the agt_val.c file that is enclosed in the archive.
	0.4. Recompile OpenYuma project: 
		0.4.1. cd /home/compila/app/poc2-md/open-yuma
		0.4.2. make clean && make && sudo make install (when prompted for the password type: compila+ )

Step 0 needs to be done only once. 

The following steps need to be done every time one of the files from /home/compila/app/poc2-md/yang-modules/MicrowaveModel-ObjectClasses-MwConnection, /home/compila/app/poc2-md/yang-modules/MicrowaveModel-Notifications or /home/compila/app/poc2-md/yang-modules/CoreModel-CoreNetworkModule-ObjectClasses folders is modified. 

###You need to compile all 3 YANG modules if it is the first time you run the server!###

	1. Compile the folder that was modified (either CoreModel-CoreNetworkModule-ObjectClasses, MicrowaveModel-ObjectClasses-MwConnection or MicrowaveModel-Notifications):
		1.1. cd /home/compila/app/poc2-md/yang-modules/CoreModel-CoreNetworkModule-ObjectClasses
		1.2. make clean && make && sudo make install
		
		OR
		
		1.1. cd /home/compila/app/poc2-md/yang-modules/MicrowaveModel-ObjectClasses-MwConnection
		1.2. make clean && make && sudo make install
		
		OR
		1.1. cd /home/compila/app/poc2-md/yang-modules/MicrowaveModel-Notifications
		1.2. make clean && make && sudo make install
		
	2. Start the NETCONF server and load the above modules:
		2.1. netconfd  --log-level=debug --access-control=off --no-startup --module=CoreModel-CoreNetworkModule-ObjectClasses --module=MicrowaveModel-ObjectClasses-MwConnection --module=MicrowaveModel-Notifications
	This will start the NETCONF server as a process, in the foreground, and print the debug logs on that specific terminal.
	
The mediatorConfig.txt file contains the values that are customizable without having to recompile the code: NeName, radioSignalId and eventFrequency. Such an example file is located in: /home/compila/app/poc2-md/yang-modules/mediatorConfig.txt

Its format is simple, and something like:
	radioSignalId: <layer-protocol-value-1-here> <radio-signal-id-integer-here>
	radioSignalId: <layer-protocol-value-2-here> <radio-signal-id-integer-here>
	NeName: <whatever-ne-name-you-would-like-here>
	eventFrequency: <amount-in-seconds-between-dummy-notifications>
	
### Keep in mind that if you modify this file containing the configurable parameters, you would still need to restart the NETCONF server, if it was already running, in order to see the new values. You will just not need to rebuild it ###l
