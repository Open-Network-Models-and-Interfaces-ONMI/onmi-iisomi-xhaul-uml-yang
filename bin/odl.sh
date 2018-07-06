#!/bin/bash
# (c) 2016 highstreet technologies
# History
#   2.1 Modify to use config/active directory
#   2.2 Correct problems
#   2.3 Shift config/active to code/apps/persistentDatabase/activConfig
#   2.4 Update to Boron
#   2.5 One feature to start apps
#   2.6 New variant of install.sh
#   2.12 CMDBIN, switch of DLUX for prepare
#   2.13 Adapt ODLBIN to odl.sh and buildv2.sh,
#        Fix "yes" answer for cluster distremove
#        introduce cluster push
#        kill command
#   2.14 add compile command
#   2.15 move im install script to odl.cmd
#   2.16 Add $ODL_KARAF_STARTUP_SCRIPT_CLUSTER for cluster command
#        cp for filecopy
#   2.17 odl.cmd moved back into bin/odl.sh
#        Added prepare with copy of etc/preload.cache.schema to cache/schema into startup
#        status command delivers version information
#   2.18 Add loop for cluster commands
#   2.19 Change startup feature
#        Add parent version variable ODLPARENT
#   2.20 Added parameter KARAFSLEEPFORSTART
#   2.21 Typos fixed
Version=2.21

# ----- Constants not depending on variables specified by $CONFIG
ODLPARENT="0.5.1-SNAPSHOT"
STARTFEATURE="odl-dev-all"
KARAFSLEEPFORSTART=30
ODLBIN=../bin

CONFIG=dist.conf

# ----- Functions to startup Vanilla ODL

karaf_prepare() {
    echo "Prepare"
    echo $ODL_KARAF_HOME
    ODLCACHESCHEMADIR="$ODL_KARAF_HOME/cache/schema"
    ETCCACHESCHEMADIR="$ODL_KARAF_HOME/etc/preload.cache.schema"

    if [ -d "$ETCCACHESCHEMADIR" ] ; then
       echo "Handle YANG preload"
       if [ -d "$ODLCACHESCHEMADIR" ] ; then
       	 echo "Remove all files in YANG cache/schema directory"
       	 rm $ODLCACHESCHEMADIR/*
       else
       	 echo "YANG cache/schema directory created"
       	 mkdir -p $ODLCACHESCHEMADIR
       fi
       cp $ETCCACHESCHEMADIR/* $ODLCACHESCHEMADIR
    fi
}

# Startup of single node (no clustering)
karaf_startup_all() {
    # Prepare
    karaf_prepare
    # Base
    karafcmd  "feature:install odl-netconf-topology"
    karafcmd  "feature:install odl-netconf-connector"
    karafcmd  "feature:install odl-restconf-all"
    karafcmd  "feature:install odl-mdsal-apidocs"

    # Logs and apps
    karaf_enable_logs
    karaf_startup_apps
}

# Startup of clustered nodes (no clustering)
karaf_startup_cluster_all() {
    # Prepare
    karaf_prepare
    # Base
    karafcmd "feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/$ODLPARENT/xml/features"
    karafcmd  "feature:install odl-mwtn-cluster-preparation"

    # Logs and apps
    karaf_enable_logs DEBUG
    karaf_startup_apps
}

# Sub functions

karaf_startup_apps() {
    # Wireless (mwtn: microwave transport network)
    karafcmd "feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/$ODLPARENT/xml/features"
    karafcmd "feature:install $STARTFEATURE"

    #If restart is required set RESTART to true
    # RESTART="true"
}

karaf_enable_logs() {
    if [ -z "$1" ] ; then
      LOGLEVEL="INFO"
    else
      LOGLEVEL="$1"
    fi
    karafcmd "log:set $LOGLEVEL com.highstreet.technologies"
    karafcmd "log:set $LOGLEVEL org.opendaylight.mwtn"
    karafcmd "log:set $LOGLEVEL org.opendaylight.netconf"
}

karafcmd() {
   echo "$@"
   $ODL_KARAF_HOME/bin/client -u karaf "$@" 2> /dev/null
   if [ ! -z "$ODL_KARAF_AFTERCMD_DELAY_SECONDS" ] ; then
     echo "Pause $ODL_KARAF_AFTERCMD_DELAY_SECONDS seconds"
     sleep "$ODL_KARAF_AFTERCMD_DELAY_SECONDS"
   fi
}

install_originM2() {
    #Network apps
    cp -r ~/.m2/repository/org/opendaylight/mwtn $ODL_KARAF_HOME/system/org/opendaylight
    cp -r ~/.m2/repository/com/highstreet $ODL_KARAF_HOME/system/com
    #Additional package for feature odl-ht-info
    mkdir -p $ODL_KARAF_HOME/system/org/apache/commons/commons-compress
    cp -r ~/.m2/repository/org/apache/commons/commons-compress/1.14 $ODL_KARAF_HOME/system/org/apache/commons/commons-compress
}

# ----- Functions of script to implement commands

#check if tool is installed as prereq

tool_check_installed() {
   hash $1 2>/dev/null || { echo >&2 "I require $1 but it's not installed.  Please install. Aborting."; exit 1; }
}

#check if karaf instance is running
karaf_checkrunning() {
   NETSTATRESULT=$(netstat -ant | grep 8101)
   if [ -n "$NETSTATRESULT" ] ; then
      reason="$NETSTATRESULT"
      running="true"
   else
     running1=$(ps -ef | grep -c karaf.jar)
     sleep 1
     running2=$(ps -ef | grep -c karaf.jar)

     reason="psResults: $running1 $running2"
     if [ "$running1" = "2" -o "$running2" = "2" ] ; then
        running="true"
     else
        running="false"
   fi
  fi
  #echo "Test running: $running indication:$reason"
}

karaf_status() {
   echo "Version information"
   cat $ODL_KARAF_HOME/networkAppVersion.txt
   karaf_checkrunning
   echo "Karaf is running: $running"
}

karaf_waittillstopped() {
    KARAF_WAITFORSTOP="5"
    anzahl=0

    echo -n "Wait for stop "

    karaf_checkrunning
    while [ "$running" = "true" -a "$anzahl" -lt 30 ]
    do
       (( anzahl++ ))
       # echo "Wait ($anzahl) for karaf stop. Wait $KARAF_WAITFORSTOP seconds"
       echo -n "."
       sleep $KARAF_WAITFORSTOP
       karaf_checkrunning
    done
    echo

    if [ "$running" = "true" ]
    then
       echo "Exceeded wait counter. Waited $anzahl * $KARAF_WITFORSTOP seconds. Karaf still running. Reason is $reason"
    else
       echo "Karaf reached stop status with $reason"
    fi
}

karaf_startifnotrunning() {

    karaf_checkrunning
    if [ "$running" = "true" ]
    then
       echo "Can not start, karaf is already running. Reason: $reason"
    else
       if [ "$1" = "clean" ] ; then
          $ODL_KARAF_HOME/bin/start clean
          echo "Started with clean"
       else
          $ODL_KARAF_HOME/bin/start
          echo "Started"
       fi
    fi
}


# Start all servies
# see beginning of this script

#Param1 Optional Param2 Optional
karaf_cleanstart() {
    echo "start karaf clean with parameters $1 $2"
    if [ -f "$ODL_KARAF_HOME/etc/opendaylight" ]
    then
       echo "Remove old ODL configuration"
       rm -r $ODL_KARAF_HOME/etc/opendaylight
    fi
    echo "Start karaf"
    $ODL_KARAF_HOME/bin/start clean
    echo "Wait $KARAFSLEEPFORSTART s till karaf and ssh is in a working level"
    sleep $KARAFSLEEPFORSTART
    netstat -ant | grep 8101
    echo "Provisioning $1"
    if [ -z "$ODL_KARAF_STARTUP_SCRIPT" ] ; then  #Old scripting names
      if [ "$1" = "1b" ] ; then
        karaf_startup_1b
      else
        karaf_startup_all
      fi
    else #Use startup script according to configuration
      if [ "$1"="cluster" ] ; then
      	 echo "Cluster start command"
      	 if [ -z "$ODL_KARAF_STARTUP_SCRIPT_CLUSTER" ] ; then
      	    echo "Using normal startup script"
      	 	$ODL_KARAF_STARTUP_SCRIPT
      	 else
      	    echo "Using cluster startup script"
      	 	$ODL_KARAF_STARTUP_SCRIPT_CLUSTER
         fi
      else
         $ODL_KARAF_STARTUP_SCRIPT
      fi
    fi
    if [ "$1" = "x" -o "$2" = "x" -o "$RESTART" = "true" ] ; then
      echo "Executed with restart option .."
      sleep 5
      $ODL_KARAF_HOME/bin/stop
      echo "Re-starting Karaf to finish setup"
      karaf_waittillstopped
      if [ "$1" = "d" -o "$2" = "d" ] ; then
        rp=$ODL_KARAF_HOME/data/log
        echo "Remove all logs from $rp"
        rm "$rp"/*
      fi
      karaf_startifnotrunning
    fi
    echo "Ready"
}

# Install from dir $1 all subs with mask $2.
# Example:   install_originM2Range "com/highstreet/technologies/solutions" "sdn4*"
install_originM2Range() {
    mkdir -p $ODL_KARAF_HOME/system/$1
    cp -R $HOME/.m2/repository/$1/$2 $ODL_KARAF_HOME/system/$1
}

install_tarFile() {
   if [ ! -e "$1" ] ; then
     echo "No tar file $1"
     exit 4
   else
     echo "Do install file $1 to karaf container"
     tar -xf "$1" -C "$ODL_KARAF_HOME"
     echo "Done"
   fi
}

install_originBuild() {

   if [ -z "$ODL_BUILD_HOME" ] ; then
     echo "No ODL_BUILD_HOME defined. Terminate" ; exit 2
   fi
   echo "Build home at $ODL_BUILD_HOME"
   if [ ! -e $ODL_BUILD_HOME/builds/version.txt ] ; then
     echo "No builds available Terminate." ; exit 2
   fi

   source $ODL_BUILD_HOME/builds/version.txt
   echo "Install Version $LASTBUILDTAR"
   tar -xf "$ODL_BUILD_HOME/builds/$LASTBUILDTAR" -C "$ODL_KARAF_HOME"
   echo "Version info"
   cat $ODL_KARAF_HOME/networkAppVersion.txt
}

clean_repository() {
   echo Clean repository .m2 and karaf/system
   rm -r ~/.m2/repository/org/opendaylight/mwtn
   rm -r ~/.m2/repository/org/opendaylight/apigateway
   rm -r ~/.m2/repository/cn/com/zte
   rm -r ~/.m2/repository/com/hcl
   rm -r ~/.m2/repository/com/highstreet
   rm -r $ODL_KARAF_HOME/system/com/highstreet
   rm -r $ODL_KARAF_HOME/system/com/hcl
   rm -r $ODL_KARAF_HOME/system/cn/com/zte
   rm -r $ODL_KARAF_HOME/system/org/opendaylight/mwtn
   rm -r $ODL_KARAF_HOME/system/org/opendaylight/apigateway
}

# Parameter1 nodlux
prepare() {
    #tool_check_installed unzip
    #tool_check_installed sshpass
    KARAFDISTBASENAME=$ODL_KARAF_DIST
    KARAFGZ=$ODL_KARAF_DISTGZ
    NODLUX="nodlux"

    if [ ! -f "$KARAFGZ" ] ; then
      echo "ERROR: Could not find tar file with karaf distribution: $KARAFGZ"
    else
      if [ "$1" != "$NODLUX" -a  ! -f "$TARFILE_DLUXLOADER" ] ; then
         echo "WARN: Could not find tar with DLUX patch $TARFILE_DLUXLOADER. .. proceeding without Patching"
      fi
      if [ -d "$ODL_KARAF_HOME" ] ; then
         echo "Found existing Karaf distribution at $ODL_KARAF_HOME. Can not proceed. Please remove or rename."
      else
         echo "Start installation $KARAFDISTBASENAME"
         echo "Unpack karaf distribution"
         cd $HOME
         cd Downloads
         tar -xzf $KARAFDISTBASENAME".tar.gz"
         mv "$KARAFDISTBASENAME" "$ODL_KARAF_HOME"
         cd "$here"

         if ! [ -d "$ODL_KARAF_HOME" ] ; then
            echo "ERROR: Could not find ODL_KARAF_HOME. Can not proceed if not existing."
         else
            echo "READY, create link dist"
            ln -s $ODL_KARAF_HOME dist
            if [ "$1" != "$NODLUX" ] ; then
               echo "Install DLUX patch"
               installDluxPatch tar
            fi
         fi
      fi
    fi
}

show_env() {
    echo "ENV settings:"
    echo "   ODL_KARAF_DIST: $ODL_KARAF_DIST"
    echo "   ODL_KARAF_HOME: $ODL_KARAF_HOME"
    echo "   JAVA_HOME: $JAVA_HOME"
}

#Param1: Mandatory Param2:optional Param3:optional
do_install() {

    echo "Install from $1 to Karaf"
	if [ ! -d "$ODL_KARAF_HOME" ] ; then
		echo "ERROR: Karaf not installed at $ODL_KARAF_HOME. Stop execution."
		exit 2
	fi
    sleep 2
    karaf_checkrunning
    if [ "$running" = "true" ]
    then
       echo "karaf instance is running. Stop first. Indication '$reason'"
    else
       echo "Start install to karaf"
       case "$1" in
          build)
             install_originBuild
             karaf_cleanstart $2 $3
             ;;
          m2)
             if [ "$(type -t install_originM2)" == "function" ] ; then
             	install_originM2
              	karaf_cleanstart $2 $3
             else
                echo "Error: Install function not defined. Exit."
         	 fi
             ;;
          tar)
             install_tarFile $2
             shift
             karaf_cleanstart $3 $4
             ;;
          *)
             echo "Script error: missing installation command"
             ;;
       esac
    fi
}

karaf_distremove() {
    echo "Remove karaf installation"
    karaf_checkrunning
    if [ "$running" = "true" ]
    then
       echo "karaf instance is running. Stop first"
    else
       if [ "$1" = "force" ] ; then
          answer=yes
       else
          read -p "Delete karaf installation. if you are sure type yes<enter> " answer
       fi
       if [ "$answer" == "yes" ] ; then
          echo "Remove ..."
          rm -r $ODL_KARAF_HOME
          echo "Remove link"
          rm dist
          echo "removed"
       else
          echo "Did nothing"
       fi
    fi
}

# Par1 Install command
installDluxPatch() {
   #Default is the tar file
   DLUXAPPHOME="apps/dlux"
   TARGETDIR="$DLUXAPPHOME/loader/impl/target"
   LOADERREPO="org/opendaylight/dlux"
   LOADERNAME="loader.implementation"

   case "$1" in
     m2)
       if [ -d $TARGETDIR ] ; then
         echo "Copy DLUX Patch from repository"
         cp -r "$HOME/.m2/repository/$LOADERREPO/loader.implementation" "$ODL_KARAF_HOME/system/$LOADERREPO"
       else
         echo "ERROR No compiled DLUX Version or tarfile for repositiory found. "
         echo " - Please compile dlux."
         echo " - Install DLUX Patch with $ODL/odl.sh dlux m2"
       fi
     ;;
     tar)
       if [ -f "$TARFILE_DLUXLOADER" ] ; then
         echo "Install DLUX Patch from existing tar"
         tar -xzf "$TARFILE_DLUXLOADER" -C "$ODL_KARAF_HOME/system"
         echo "Done"
       else
         echo "DLUX tar file not found: $TARFILE_DLUXLOADER"
       fi
     ;;
     create)
       echo "Create tar file"
       if [ -d $TARGETDIR ] ; then
         HERE=$(pwd)

         stringa=($(cd $TARGETDIR ; ls $LOADERNAME*jar))
         if [[ ${stringa[0]} =~ $LOADERNAME-(.*).jar ]] ; then
         	version="${BASH_REMATCH[1]}"
            echo $version
            M2INPUTNAME="$LOADERREPO/$LOADERNAME/$version"
            TAROUTPUTNAME="$HERE/$DLUXAPPHOME/$ODL_KARAF_DIST.dluxloader.tar.gz"
            echo "Creating file: $TAROUTPUTNAME"
            echo "Reading from: $M2INPUTNAME"
            cd "$HOME/.m2/repository"
            tar -czf "$TAROUTPUTNAME" "$M2INPUTNAME"
            echo Done
         fi
         cd $HERE
       else
         echo "ERROR No compiled DLUX Version for repositiory found. "
         echo " - Please compile dlux."
       fi
     ;;
     *)
      echo "use $ODLBIN/odl.sh dlux [m2|tar|create] to install from m2-repository or install tar file or create tar file"
     ;;
   esac
}

# -----------------------------------------------------
# -----  Cluster commands

# P1: Passwd P2: Username P3:ServerIP P4, P5: Remote commands
karafclustercmd() {
  rcmd="cd $here ; $ODLBIN/odl.sh $4 $5"
  cmd="sshpass -p$1 ssh -o StrictHostKeyChecking=no $2@$3 $rcmd"
  echo "--------- Begin at node: $3 -----------"
  $cmd
  echo "--------- Ende at node: $3 ------------"
}

# P1: Passwd P2: Username P3:ServerIP P4, P5: Remote commands
karafclustercmdnohup() {
  #Template: nohup myprogram > foo.out 2> foo.err < /dev/null &
  echo " Start install for node $3"
  rcmd="cd $here ; nohup $ODLBIN/odl.sh $4 $5 &> odl.log < /dev/null &"
  cmd="sshpass -p$1 ssh -o StrictHostKeyChecking=no $2@$3 $rcmd"
  $cmd
  echo "Command executed in background. Result see odl.log."
}

karafclustercreate() {

  if [ -z "$1" ] ; then
    read -p "Please enter password for user $USER: " -r -s USERPWD
    echo
  fi

  for i in ${!ODL_CLUSTER_ARRAY[@]} ; do
     rcmd="cd $here ; $ODL_KARAF_HOME/bin/configure_cluster.sh $((i+1)) ${ODL_CLUSTER_ARRAY[@]}"
     cmd="sshpass -p$USERPWD ssh -o StrictHostKeyChecking=no $USER@${ODL_CLUSTER_ARRAY[$i]} $rcmd"
     echo "--------- Start Node: ${ODL_CLUSTER_ARRAY[$i]} ----------- CMD: $rcmd"
     $cmd
     echo "--------- Ende Node: ${ODL_CLUSTER_ARRAY[$i]}------------"
  done

}

pause() {
      read -p "($1) Hit enter ..." -r -s TMP
      echo
}

#Destination is $ODL_BUILD_HOME
#Source is $ODL_CLUSTER_REPO
pushbuildinfo() {
  if [ -z $ODL_CLUSTER_REPO ] ; then
    echo "No cluster repository specified by ODL_CLUSTER_REPO. Can not proceed."
  else
    if [ -z "$ODL_BUILD_HOME" ] ; then
      echo "No ODL_BUILD_HOME defined. Terminate" ; exit 2
    fi
    echo "Build home at $ODL_CLUSTER_REPO"
    ODL_VERSION_FILE="$ODL_CLUSTER_REPO/builds/version.txt"
    if [ ! -e $ODL_VERSION_FILE ] ; then
      echo "No builds available Terminate." ; exit 2
    fi

    #Read version information
    source $ODL_VERSION_FILE
    echo "Prepare cluster with $BUILDTAG and prepare configuration files."
    echo "Destination repository: $ODL_BUILD_HOME Source repository: $ODL_CLUSTER_REPO"
    if [ -z "$1" ] ; then
      read -p "Please enter password for user $USER: " -r -s USERPWD
      echo
    fi
    for i in ${ODL_CLUSTER_ARRAY[@]} ; do
    	echo "Copy to $i:$ODL_BUILD_HOME"
   	  	sshpass -p$USERPWD ssh -o StrictHostKeyChecking=no $USER@$i "mkdir -p $ODL_BUILD_HOME/builds"
      	sshpass -p$USERPWD scp "$ODL_CLUSTER_REPO/builds/$LASTBUILDTAR" "$i:$ODL_BUILD_HOME/builds"
      	sshpass -p$USERPWD scp "$ODL_VERSION_FILE" "$i:$ODL_BUILD_HOME/builds"
      	sshpass -p$USERPWD scp -r "$ODL_CLUSTER_REPO/bin" "$i:$ODL_BUILD_HOME"
   	  	sshpass -p$USERPWD ssh -o StrictHostKeyChecking=no $USER@$i "mkdir -p $here"
   	  	sshpass -p$USERPWD scp "$here/$CONFIG" "$i:$here"
   	  	# sshpass -p$USERPWD scp "$here/$ODLCMD" "$i:$here"
   	  	sshpass -p$USERPWD ssh -o StrictHostKeyChecking=no $USER@$i "cd $here ; chmod 755 $ODL_BUILD_HOME/bin/odl.sh ; if [ ! -e odl ] ; then ln -s $ODL_BUILD_HOME/bin/odl.sh odl ; fi"
    done
  fi
}

#Destination is $here/dist
#Parameter $1 is sourcedirectory
clusterfilecopy() {
    if [ -z "$1" ] ; then
      echo "ERROR: Need a path as parameter"
    else
      echo "Copy all files from directory $1/* to $here/dist/$1 on each node."
      read -p "Please enter password for user $USER: " -r -s USERPWD
      echo
      for i in ${ODL_CLUSTER_ARRAY[@]} ; do
      	  destpath="$i:$here/dist"
    	  echo "Copy $here/$1 to $destpath"
      	  sshpass -p$USERPWD scp -r "$1" "$destpath"
      done
	fi
}

karafclusterinfo() {
  echo "Using user $USER"
  echo "Cluster: ${ODL_CLUSTER_ARRAY[@]}"
}

karafcluster() {

 CLUSTERCLI="TRUE"

 while [ $CLUSTERCLI = "TRUE" ] ; do

   if [ -z "$ODL_CLUSTER_ARRAY" ] ; then
      echo "No cluster in '$ODL_CLUSTER_ARRAY' specified"
   else
      tool_check_installed sshpass
      echo "Cluster: ${ODL_CLUSTER_ARRAY[@]}"

      if [ -z "$1" ] ; then
       	 read -p "cluster cmd> " answer
         set -- $answer
      else
         CLUSTERCLI="FALSE"
      fi

      case "$1" in
      	cp)
      	   clusterfilecopy $2
      	   ;;
        create)
           karafclustercreate
           ;;
        distremove)
       	   read -p "Confirm karaf cluster installation deletion. If you are sure type yes<enter> " answer
           if [ "$answer" = "yes" ] ; then
              echo "Change to forced mode."
              set -- distremove force
              function="karafclustercmd"
           else
           	  echo "Terminated by user"
           fi
           ;;
        "" | exit)
           CLUSTERCLI="FALSE"
           function=""
           ;;
        info)
           karafclusterinfo
           ;;
        im* | ib*)
           echo "Started on each node in background. See odl.log"
           function="karafclustercmdnohup"
           set -- $1 cluster
           ;;
        push)
           pushbuildinfo
           ;;
        *)
           function="karafclustercmd"
           ;;
      esac

      if [ ! -z "$function" ] ; then
        read -p "Please enter password for user $USER: " -r -s USERPWD
        echo
        for i in "${ODL_CLUSTER_ARRAY[@]}" ; do
          $function $USERPWD $USER $i $1 $2
        done
        if [ "$1" = "prepare" ] ; then
           read -p "Proceed with create (y/n): " answer
           case "$answer" in
           	  y*) karafclustercreate $USERPWD
           	  ;;
           esac
        fi
      fi
   fi
   if [ $CLUSTERCLI = "TRUE" ] ; then
         set -- ""
   fi

done
}

# -----------------------------------------------------
# ----- Script body

echo "AppToODL installer $Version"

if [ -f $CONFIG ] ; then
   echo "Load configuration"
   source "$CONFIG"
else
   script_command="Error: No $CONFIG file .. can not proceed. Create this file and specify the right versions:"
   echo $script_command
   echo 'ODL_KARAF_DIST="distribution-karaf-0.6.1-Carbon"'
   echo 'ODL_KARAF_HOME=$HOME/odl/$ODL_KARAF_DIST'
   echo 'ODL_KARAF_DISTGZ="$HOME/Downloads/"$ODL_KARAF_DIST".tar.gz"'
   echo 'ODL_BUILD_HOME="$HOME/build/acme"'
   echo 'ODL_KARAF_STARTUP_SCRIPT="karaf_startup_all"'
   echo 'export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"'
   echo
   echo "Example for downloading the distribution:"
   echo 'wget https://nexus.opendaylight.org/content/repositories/opendaylight.release/org/opendaylight/integration/distribution-karaf/0.6.1-Carbon/distribution-karaf-0.6.1-Carbon.tar.gz'

   exit 1
fi
#Since 2.17 moved back to script
#if [ -f $ODLCMD ] ; then
#   source $ODLCMD
#else
#   script_command="Error: No $ODLCMD file .. can not proceed"
#   echo $script_command
#   exit 1
#fi

TARFILE_DLUXLOADER="apps/dlux/$ODL_KARAF_DIST.dluxloader.tar.gz"
echo "Karaf home: $ODL_KARAF_HOME"

here=$(pwd)
echo "Executed here: $here"
echo ""

if [ -z "$ODL_KARAF_HOME" -o -z "$ODL_KARAF_DIST" ]
then
  echo "Missing ENV setting ODL_KARAF_HOME or ODL_KARAF_DIST. Can not execute."
  show_env
  script_command="Error Incomplete ENV"
else
  script_command="ok"
fi

#echo "Command: $script_command"

if [ "$script_command" = "ok" ] ; then

case "$1" in

  build)
    if [ -z "$ODL_BUILD_HOME" ] ; then
      echo "No build configuration found. Specify '$ODL_BUILD_HOME'."
    else
      echo "Enter build subsystem at location $ODL_BUILD_HOME"
      shift
      $ODLBIN/buildv2.sh $@
    fi
    ;;

  cli)
    shift
    karafcmd $@
    ;;

  clu*)
    shift
    karafcluster $@
    ;;

  dlux)
    echo "Install DLUX Patch"
    shift
    installDluxPatch $@
    ;;

  env)
    show_env
    ;;
  kill)
    echo "Kill ODL instance"
    pkill -e -f "Dkaraf.home=.home.herbert.odl.$ODL_KARAF_DIST"
    ;;
  test)
    echo "Test a little bit"
    here=$(pwd)
    echo "Path: $here"
    cd $HOME
    echo "List1"
    ls
    cd $here
    echo "List2"
    ls

    karaf_prepare
    ;;
  v)
    echo "List app versions"
    mvn --version
    git --version
    echo "node: " ; node --version
    echo "npm: " ; npm --version
    echo "jq: " ; jq --version
    echo "bower" ; bower --version
    ;;
  restart)
    echo "restart command"
    karaf_checkrunning
    if [ "$running" = "true" ] ; then
       $ODL_KARAF_HOME/bin/stop
       karaf_waittillstopped
       karaf_startifnotrunning $2
    else
       echo "Already stopped .. do start"
       karaf_startifnotrunning $2
    fi
    ;;

  stop)
    echo "stop command"
    karaf_checkrunning
    if [ "$running" = "true" ] ; then
       $ODL_KARAF_HOME/bin/stop
       karaf_waittillstopped
    else
       echo "Already stopped"
    fi
    ;;
  start)
    echo "start command"
    karaf_startifnotrunning $2
    ;;
  bower)
    echo "Install bower"
    cd ./ux/mwtnCommons/mwtnCommons-module/src/main/resources/mwtnCommons/
    ./bowerInstall.sh
    cd $here
    ;;

  dbclean)
    database_cleansetup
    ;;

  untar)
    echo "Extract karaf"
    prepare nodlux
    ;;

  prepare)
    echo "Prepare prepare"
    prepare $2
    ;;

  a)
    echo "Compile all"
    mvn clean install -DskipTests
    if [[ $? -ne 0 ]] ; then
       echo "could not complete"
    else
       do_install m2
    fi
    ;;

  d)
    app="devicemanager"
    echo "Compile $app"
    cd apps/$app
    mvn clean install -DskipTests
    rc=$?
    cd $here
    if [[ $rc -ne 0 ]] ; then
       echo "could not complete"
    else
       do_install m2 d
    fi
    ;;

  distremove)
    karaf_distremove $2
    ;;

  ib)
    do_install build $2
    ;;

  imd)
    do_install m2 d $2
    ;;

  im)
    do_install m2 $2
    ;;

  it)
    do_install tar $2
    ;;

  karafclean)
    karaf_cleanstart
    ;;

  log)
   vi dist/data/log/karaf.log
   ;;

  migrate)
    echo "Migrate index$2 to index$3"
    elasticdump --input=http://localhost:9200/sdnevents_$2 --output=http://localhost:9200/sdnevents_$3 --type=data --limit=100000
    ;;
  mvn)
    echo "try to compile $2"
    here=`pwd`
    cd "$2"
    mvn clean install -DskipTests
    cd "$here"
    ;;
  status)
    karaf_status
    ;;

  debug)
    karaf_enable_logs $2
    ;;

  *)
    if [ ! "$1" == "help" ] ; then
      echo "ERROR Unknown command $1"
    fi
    echo "Commands:"
    echo " a           for build all and install from M2"
    echo " build       enter build subsystem"
    echo "                build, deliver"
    echo " bower       for install bower"
    echo " cli         start karaf command line"
    echo " cluster xx  cluster commands and all other commands"
    echo "                status, ib, im, stop, push, distremove, cp"
    echo " env         List environment variables"
    echo " d           for devicemanager and install from M2"
    echo " dbclean     clean db and load with initial data"
    echo " debug       activate debug for netconf and mwtn"
    echo " distremove  remove existing karaf distribution"
    echo " dlux        install DLUX patch. Use dlux [m2|tar|create] to install from m2-repository or install tar file or create tar file"
    echo " help        List this help"
    echo " ib          for install from Build-directory"
    echo " im          for install from M2-directory"
    echo " imd         for install from M2-directory. Delete logs before start command"
    echo " it fn       install tar file to container"
    echo " karafclean  start clean and install apps on karaf"
    echo " kill        hard termination of ODL instance"
    echo " log         vi karaf.log"
    echo " migrate     migrate Param1 Param2 Migrate on localhost"
    echo " mvn [folder]  compile folder with maven with parameter -DskipTests"
    echo " prepare [nodlux]  to install and prepare a karaf. tar version expected in Downloads."
    echo " untar       to extract karaf."
    echo " test        do some testing"
    echo " start       start karaf"
    echo " status      display karaf status"
    echo " stop        stop and wait karaf"
    echo " restart     stop and start karaf"
    echo " repoclean   clean the repositories"
    echo " v           get Versions"
    ;;
esac
fi

unset install_err

