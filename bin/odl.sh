#!/bin/bash
# (c) 2016 highstreet technologies
# History
#   2.1 Modify to use config/active directory
#   2.2 Correct problems
#   2.3 Shift config/active to code/apps/persistentDatabase/activConfig
#   2.4 Update to Boron
#   2.5 One feature to start apps
#   2.6 New variant of install.sh
Version=2.11

# ----- Constants not depending on variables specified by $CONFIG

CONFIG=dist.conf
ODLCMD=odl.cmd

# ----- Functions

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
# see $ODLCMD

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

    echo "Wait 15s till karaf and ssh is in a working level"
    sleep 15 
    netstat -ant | grep 8101
    echo "Provisioning $1" 
    if [ -z "$ODL_KARAF_STARTUP_SCRIPT" ] ; then  #Old scripting names
      if [ "$1" = "1b" ] ; then
        karaf_startup_1b
      else
        karaf_startup_all
      fi
    else #Use startup script according to configuration
      $ODL_KARAF_STARTUP_SCRIPT
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

install_originM2() {
    install_originM2Range "org/opendaylight" "mwtn"
    install_originM2Range "org/opendaylight" "apigateway"
    install_originM2Range "com" "highstreet"

    #Old implementation
    #cp -R ~/.m2/repository/org/opendaylight/mwtn $ODL_KARAF_HOME/system/org/opendaylight
    #mkdir -p $ODL_KARAF_HOME/system/cn/com
    #cp -R ~/.m2/repository/cn/com/zte $ODL_KARAF_HOME/system/cn/com
    #cp -R ~/.m2/repository/com/hcl $ODL_KARAF_HOME/system/com
    #cp -R ~/.m2/repository/com/highstreet $ODL_KARAF_HOME/system/com
}

install_tarFile() {
   if [ ! -e "$1" ] ; then
     echo "No tar file $1"
     exit 4
   else
     echo "Do install file $1 to karaf container"
     tar -xf "$1" -C "$ODL_KARAF_HOME/system"
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
   tar -xf "$ODL_BUILD_HOME/builds/$LASTBUILDTAR" -C "$ODL_KARAF_HOME/system"
   mv "$ODL_KARAF_HOME/system/version.txt" "$ODL_KARAF_HOME/networkAppVersion.txt"
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

prepare() {
    #tool_check_installed unzip
    #tool_check_installed sshpass
    KARAFDISTBASENAME=$ODL_KARAF_DIST
    KARAFGZ=$ODL_KARAF_DISTGZ

    if [ ! -f "$KARAFGZ" ] ; then
      echo "Could not find tar file with karaf distribution: $KARAFGZ"
    else 
      if [ ! -f "$TARFILE_DLUXLOADER" ] ; then
         echo "Could not find tar with DLUX patch $TARFILE_DLUXLOADER"
      else
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
              echo "Could not find ODL_KARAF_HOME. Can not proceed if not existing."
           else
              echo "READY, create link dist"
              ln -s "$ODL_KARAF_HOME" dist
              echo "Patch DLUX"
	      installDluxPatch
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
             install_originM2
             karaf_cleanstart $2 $3
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

karaf_remove() {
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

installDluxPatch() {
   if [ -f "$TARFILE_DLUXLOADER" ] ; then
     echo "Install DLUX Patch from existing tar"
     tar -xzf "$TARFILE_DLUXLOADER" -C "$ODL_KARAF_HOME/system"
   else 
     TARGETDIR="apps/dlux/loader/impl/target"
     LOADERREPO="org/opendaylight/dlux"
     if [ -d $TARGETDIR ] ; then
       echo "Copy DLUX Patch from repository"
       cp -r "$HOME/.m2/repository/$LOADERREPO/loader.implementation" "$ODL_KARAF_HOME/system/$LOADERREPO"
     else
       echo "ERROR No compiled DLUX Version or tarfile for repositiory found. "
       echo " - Please compile dlux."
       echo " - Install DLUX Patch with ./odl.sh dlux"
       exit 1
     fi
  fi
}
# -----------------------------------------------------
# -----  Cluster commands

# P1: Passwd P2: Username P3:ServerIP P4, P5: Remote commands
karafclustercmd() {
  rcmd="cd $here ; ./odl.sh $4 $5"
  cmd="sshpass -p$1 ssh -o StrictHostKeyChecking=no $2@$3 $rcmd"
  echo "--------- Start Node: $3 -----------"
  $cmd
  echo "--------- Ende Node: $3 ------------"
}

# P1: Passwd P2: Username P3:ServerIP P4, P5: Remote commands
karafclustercmdnohup() {
  #Template: nohup myprogram > foo.out 2> foo.err < /dev/null &
  echo " Start install for node $3"
  rcmd="cd $here ; nohup ./odl.sh $4 $5 &> odl.log < /dev/null &"
  cmd="sshpass -p$1 ssh -o StrictHostKeyChecking=no $2@$3 $rcmd"
  $cmd
  echo "Command executed in background. Result see odl.log."
}

karafclustercreate() {

  read -p "Please enter password for user $USER: " -r -s USERPWD
  echo 

  for i in ${!ODL_CLUSTER_ARRAY[@]} ; do
     rcmd="cd $here ; ./dist/bin/configure_cluster.sh $((i+1)) ${ODL_CLUSTER_ARRAY[@]}"
     cmd="sshpass -p$USERPWD ssh -o StrictHostKeyChecking=no $USER@${ODL_CLUSTER_ARRAY[$i]} $rcmd"
     echo "--------- Start Node: ${ODL_CLUSTER_ARRAY[$i]} ----------- CMD: $rcmd"
     $cmd
     echo "--------- Ende Node: ${ODL_CLUSTER_ARRAY[$i]}------------"
  done

}

karafclusterinfo() {
  echo "Using user $USER"
  echo "Cluster: ${ODL_CLUSTER_ARRAY[@]}"
}

karafcluster() {
   if [ -z "$ODL_CLUSTER_ARRAY" ] ; then
      echo "No cluster in '$ODL_CLUSTER_ARRAY' specified"
   else
      tool_check_installed sshpass
      echo "Cluster: ${ODL_CLUSTER_ARRAY[@]}"
      case "$1" in
        create)
           karafclustercreate 
           ;;
        distremove)
           echo "Change to forced mode."
           set -- distremove force
           function="karafclustercmd"
           ;;
        info)
           karafclusterinfo
           ;;
        im* | ib*)
           echo "Started on each node in background. See odl.log"
           function="karafclustercmdnohup"
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
      fi
   fi
}

# -----------------------------------------------------
# ----- Script body

echo "AppToODL installer $Version"

if [ -f $CONFIG ] ; then
   echo "Load configuration"
   source "$CONFIG"
else
   script_command="Error: No $CONFIG file .. can not proceed. Create this file and specifiy the right versions:"
   echo $script_command 
   echo 'ODL_KARAF_DIST="distribution-karaf-0.6.1-Carbon"'
   echo 'ODL_KARAF_HOME=$HOME/odl/$ODL_KARAF_DIST'
   echo 'ODL_KARAF_DISTGZ="$HOME/Downloads/"$ODL_KARAF_DIST".tar.gz"'
   echo 'ODL_BUILD_HOME="$HOME/build/att"'
   echo 'ODL_KARAF_STARTUP_SCRIPT="karaf_startup_all"'
   echo 'export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"'
   echo
   echo "Example for downloading the distribution:"
   echo 'wget https://nexus.opendaylight.org/content/repositories/opendaylight.release/org/opendaylight/integration/distribution-karaf/0.6.1-Carbon/distribution-karaf-0.6.1-Carbon.tar.gz'

   exit 1
fi
if [ -f $ODLCMD ] ; then
   source $ODLCMD
else
   script_command="Error: No $ODLCMD file .. can not proceed"
   echo $script_command
   exit 1
fi

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
      ../bin/buildv2.sh $@
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
    installDluxPatch
    ;;

  env)
    show_env
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

  prepare)
    echo "Prepare"
    prepare
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
    karaf_remove
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

  migrate)
    echo "Migrate index$2 to index$3"
    elasticdump --input=http://localhost:9200/sdnevents_$2 --output=http://localhost:9200/sdnevents_$3 --type=data --limit=100000
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
    echo " build       build subsystem"
    echo " bower       for install bower"
    echo " cli         start karaf command line"
    echo " cluster xx  cluster commands"
    echo "                status, ib, stop"
    echo " env         List environment variables"
    echo " d           for devicemanager and install from M2"
    echo " dbclean     clean db and load with initial data"
    echo " debug       activate debug for netconf and mwtn"
    echo " distremove  remove existing karaf distribution"
    echo " dlux        install DLUX patch"
    echo " help        List this help"
    echo " ib          for install from Build-directory"
    echo " im          for install from M2-directory"
    echo " imd         for install from M2-directory. Delete logs before start command"
    echo " it fn       install tar file to container"
    echo " karafclean  start clean and install apps on karaf"
    echo " migrate     migrate Param1 Param2 Migrate on localhost"
    echo " prepare     to install and prepare a karaf. Packed Version expected in Downloads"
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

