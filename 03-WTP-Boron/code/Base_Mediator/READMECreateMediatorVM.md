#### Create a virtual OpenYuma mediator server (VM)

Install a new mediator server from scratch. This first part describes the install of OS and OpenYuma to get a virtual OpenYuma mediator.
The ONF PoC "Base_Mediator" (mediator VM) requires further installations that are described in the next section.

VM Server definition for 'compila-virtual-machine' that was used for testing in host environment with ESXi V6 (Sep/Oct 16):
* 2 vCPUs, 2 Gig memory, 20 GB Hard Disk
* Ubuntu Linux (64 Bit, x86) 16.04 LTS, Image for install: 16.04.01 LTS
* Additional packages are from standard Ubuntu repo
* Admin user and username for basemediator installation *compila*
* Networking preconditions:
    * DHCP is available
    * Direct Internet connection for this server is available

The mediator created by this installation is similar to the structure of the poc2 mediator server. 

##### Installation steps:
1. Create server  
	Do a normal Ubuntu Server installation.   
	The user "*compila*" is used as with "compila+" as admin account and later on to install OpenYuma.  
	To create this user use the following commands and use the defaults and password: 
	```
	  sudo adduser compila  
	  sudo adduser compila sudo 
	```

2. Install additional packages needed for downloading software from git and as prerequisite for OpenYuma  
	```
	sudo apt-get install openssh-server 
	```
    Now you could use a putty session to do the next steps via terminal.
	```   
    sudo apt-get install git
    sudo apt-get install libz-dev
    sudo apt-get install libxml2-dev libssh2-1-dev libncurses5-dev libgcrypt-dev
    sudo apt-get install build-essential devscripts debhelper
	```
    After the next installation step detailed information is available in documentation *openyuma-installation-guide.odt*.  

3. Install OpenYuma  
	cd into user home directory and create app/poc2-md/open-yuma
	```
	cd ~
	mkdir app
	cd app
	mkdir poc2-md
	cd poc2-md 
    git clone https://github.com/OpenClovis/OpenYuma open-yuma
	```   
    HINT: OpenYuma manuals are located in ~/app/poc2-md/open-yuma/netconf/doc/yuma_docs/*

4. Compile OpenYuma
    Version of GCC: gcc (Ubuntu 5.4.0-6ubuntu1~16.04.1) 5.4.0 20160609
    Cd into OpenYuma directory and compile
	```  
    cd ~/app/poc2-md/open-yuma
    make
	```  
    The make command runs for about 1 Minute. Some warnings are generated during compilation.  
    The last lines should look like this:
	```
    gcc -O2 -DDEBUG=1 -DLINUX=1 -DGCC=1 -DHAS_FLOAT=1 -Wall -Wno-long-long -Wformat-y2k -Winit-self -Wswitch-default -Wunused-parameter -Wextra -Wundef -Wshadow -Wpointer-arith -Wwrite-strings -Wbad-function-cast -Wcast-qual -Wcast-align -Waggregate-return -Wstrict-prototypes -Wold-style-definition -Wmissing-prototypes -Wmissing-declarations -Wpacked -Winvalid-pch -Wredundant-decls -Wnested-externs -Winline -std=gnu99  -fPIC   \
        -I. -I../../netconf/src/platform -I../../netconf/src/ncx -I../../netconf/src/agt -I/usr/include/yuma/platform -I/usr/include/yuma/ncx -I/usr/include/yuma/agt  -I/usr/include -I/usr/include/libxml2 -I/usr/include/libxml2/libxml   -c -o ../bin/toaster.o toaster.c
    gcc -O2 -DDEBUG=1 -DLINUX=1 -DGCC=1 -DHAS_FLOAT=1 -Wall -Wno-long-long -Wformat-y2k -Winit-self -Wswitch-default -Wunused-parameter -Wextra -Wundef -Wshadow -Wpointer-arith -Wwrite-strings -Wbad-function-cast -Wcast-qual -Wcast-align -Waggregate-return -Wstrict-prototypes -Wold-style-definition -Wmissing-prototypes -Wmissing-declarations -Wpacked -Winvalid-pch -Wredundant-decls -Wnested-externs -Winline -std=gnu99  -fPIC -shared -rdynamic -Wl,-soname,libtoaster.so -o ../lib/libtoaster.so ../bin/toaster.o -ldl -lxml2 -L../../netconf/target/lib #  -lagt -lncx
    make[2]: Leaving directory '/home/compila/app/poc2-md/open-yuma/libtoaster/src'
    make[1]: Leaving directory '/home/compila/app/poc2-md/open-yuma/libtoaster'
	```  
    If the output is like the text above you can do the next step. If not you should check if there is a problem.
      
5. Install OpenYuma
    The next step is the installation of the compiled result.
	```  
    sudo make install
	```  
    The install performs some copies to different locations.   
    This is important to know for the next configuration steps.  
    You can verify if all files are at the right places:  
    a. In /usr/bin:
	```  
    rwxr-xr-x  1 root   root         1781 Sep 20 13:21 make_sil_dir*
    rwxr-xr-x  1 root   root       346184 Sep 20 13:21 yangcli*
    rwxr-xr-x  1 root   root        60136 Sep 20 13:21 yangdiff*
    rwxr-xr-x  1 root   root       232560 Sep 20 13:21 yangdump*
	```  
	b. In /usr/sbin:
	```  
    rwxr-xr-x  1 root root   18848 Sep 20 13:21 netconf-subsystem*
    rwxr-xr-x  1 root root   13864 Sep 20 13:21 netconfd*
	```  
    c. In /usr/share/Yuma:
	```  
    drwxr-xr-x   7 root root  4096 Sep 20 13:18 modules/
    drwxr-xr-x   3 root root  4096 Sep 20 11:25 src/
    drwxr-xr-x   2 root root  4096 Sep 20 11:25 util/
	```  

6.	Next step is the SSH configuration for OpenYuma and NETCONF.  
    Add the lines below into **/etc/ssh/sshd_config**.  
    Command with VI:
	```  
    sudo vi /etc/ssh/sshd_config
	```  

    Search line with Port 22 and add Port 830 and Subsystem line.
	```  
    Port 22
    Port 830
    Subsystem netconf /usr/sbin/netconf-subsystem
	```  
    Modify PermitRootLogin to yes and comment # Strictmode and at the very end UsePAM:
	```  
    #PermitRootLogin prohibit-password
    PermitRootLogin yes
    #StrictModes yes
    :
    #UsePAM yes
	```  
    After file modification restart ssh service with.
	```  
    sudo service ssh restart
	```  
    Verify with status command and the subsequent output.
	```  
    sudo service ssh status
    * ssh.service - OpenBSD Secure Shell server
    Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: enabled)
    Active: active (running) since Mi 2016-10-05 13:13:26 CEST; 11s ago
    Main PID: 22028 (sshd)
    CGroup: /system.slice/ssh.service
                +-22028 /usr/sbin/sshd -D

    Okt 05 13:13:26 compila-virtual-machine systemd[1]: Starting OpenBSD Secure Shell server...
    Okt 05 13:13:26 compila-virtual-machine sshd[22028]: Server listening on 0.0.0.0 port 830.
    Okt 05 13:13:26 compila-virtual-machine sshd[22028]: Server listening on :: port 830.
    Okt 05 13:13:26 compila-virtual-machine sshd[22028]: Server listening on 0.0.0.0 port 22.
    Okt 05 13:13:26 compila-virtual-machine sshd[22028]: Server listening on :: port 22.
    Okt 05 13:13:26 compila-virtual-machine systemd[1]: Started OpenBSD Secure Shell server.
	```  

	HINT: Now the OpenYuma Mediator server is finished. For getting a ONF CENTENNIAL PoC 3 Base Mediator proceed with the next section
	
#### Install ONF CENTENNIAL PoC 3 Base Mediator extensions to OpenYuma Mediator server 

Prerequisite for this section is to have the OpenYuma mediator server ready installed. 
This section describes the install of additional packages to get a Base_Mediator (mediator VM). 
They Base_Mediator source are located in *03-WTP_PoC/code/Base_Mediator*.  

1. Preparation
    Login as user "compila".
    Add to user compila's ".profile" and ".bashrc" two additional variables at the end of the file which are pointing to the YUMA location and to the ONF PoC location.
    ```  
    export YUMA="$HOME/app/poc2-md/open-yuma"
    export ONFPOC="$HOME/app/CENTENNIAL/03-WTP-PoC"
	```
	  
    Example to edit and execute
	```
	cd
	vi .profile
	. .profile
	```  
    
1. Installation of net-snmp
    The steps are:
    * Download the net-snmp source package version 5.7.3 or newer into users Download folder. From here: http://net-snmp.sourceforge.net/download.html
    * unzip into "app" and follow QUICK INSTRUCTIONS http://net-snmp.sourceforge.net/docs/INSTALL.html
    * during execution of configure-script use always the default settings.
    * add a symbolic link to perl lib.
    * compile, test and install.

    Here are the single steps as command line:    
	```  
    cd
    cd Downloads
    wget https://sourceforge.net/projects/net-snmp/files/net-snmp/5.7.3/net-snmp-5.7.3.zip/download
    cd ../app
    unzip ~/Downloads/download
    cd net-snmp-5.7.3
    ./configure
    sudo ln -s  /usr/lib/x86_64-linux-gnu/libperl.so.5.22.1 /usr/lib/x86_64-linux-gnu/libperl.so
    make
    make test
    sudo make install
	```  
    
2. Add the PoC 3 specific OpenYuma extension by cloning the complete CENTENNIAL repository into the app folder:

	```  
    cd ~/app
    git clone https://github.com/OpenNetworkingFoundation/CENTENNIAL
	```  
    
3. Adapt to individual directory configuration if necessary:

    The variable YUMA_HOME in the makefile below which is used during make of CENTENNIAL extension has to point to the OpenYuma installations *netconf* directory.
	```  
    grep YUMA_HOME $ONFPOC/code/Base_Mediator/YUMA_modules/Base_mediator_utils/src/Makefile
    YUMA_HOME = /home/compila/app/poc2-md/open-yuma/netconf
                -I$(YUMA_HOME)/src/agt -I$(YUMA_HOME)/src/ncx \
	```  
    Verify if the configuration is correct for the actually used *directory structure* and *user name*.  
    If not matching the individual configurations have to be adapted accordingly.

4. Further preparation  

    Create the directory for the new yang description:
	```  
    sudo mkdir /usr/share/yuma/modules/CENTENNIAL
	```  
    
    Go back and follow the steps in the Base_Mediator README [How to install:For a mediator VM that was previously downloaded from the FTP server:](README.md) to finish and run the Base mediator

