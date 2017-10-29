#!/bin/bash
# Setup tool
# (c)2017 highstreet technologies GmbH
Version=1.0

#--------------------------------------------------
# Definitions

BUILDCONFIGFILE="./buildconfig.txt"
VERSIONFILE="./networkAppVersion.txt"

#--------------------------------------------------
# Functions

# call with name and parameter that completes normally if tool is installed e.g. java -version
check4Tool() {
    $2 >/dev/null 2>&1 || { echo "Error: I require '$1' but it's not installed. Aborting."; echo; exit 1; }
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

#wait till karaf is stopped
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

# Install from tar file to repository
install() {
   echo "Install $1"
   tar -xf "$1" -C "system"
   echo "Version info"
   mv system/version.txt networkAppVersion.txt
   cat networkAppVersion.txt
}

# start new TAR package
doStartProcedure() {

   karaf_checkrunning
   if [ running = "true" ] ; then
     echo "ERROR: Karaf instance already running. Stop first. Terminate"
     exit 1
   else

     ./bin/start clean
     SLEEP1=30
     echo "Wait $SLEEP1 Seconds till karaf is started"
     sleep $SLEEP1

     odl_feature_install

     echo "Stop and restart"
     ./bin/stop
     echo "Wait till karaf is stopped"
     karaf_waittillstopped
     echo "Start again and wait"
     ./bin/start
     sleep 15
     karaf_checkrunning
     echo "Status running: $running"

  fi
}


#--------------------------------------------------
# Body

echo
echo "-----------------------------------------------"
echo "highstreet technologies GmbH (c)2017"
echo "Setup tool networkApplications for OpenDaylight"
echo "Version: $Version"
echo "-----------------------------------------------"
echo

#Do some checks
echo "Info and checks:"
if [ ! -d "$JAVA_HOME" ] ; then
  echo; echo "JAVA_HOME not spezified. Aborting."; exit 1
fi
echo "  Java home: $JAVA_HOME"

if [ ! -e "./bin/karaf" ] ; then
  echo ; echo "ERROR: Not a karaf home. Terminate" ; exit 1
fi
if [ -n "$1" -a ! -e "$1" ] ; then
  echo ; echo "ERROR: Can not find install file $1 Terminate" ; exit 1
fi
if [ -z "$ODL_KARAF_HOME" ] ; then
  read -p "WARNING: ODL_KARAF_HOME not spezified. Press enter to continue" ANSWER
else
  echo "  ODL_KARAF_HOME=$ODL_KARAF_HOME"
fi  
if [ -n "$ODL_KARAF_HOME" -a ! "$ODL_KARAF_HOME" = "$(pwd)" ] ; then
  read -p "WARNING: Not in ODL_KARAF_HOME. Press enter to continue" ANSWER
fi
if [ -f "$BUILDCONFIGFILE" ] ; then
  echo "  Use config file: $BUILDCONFIGFILE"
  source "$BUILDCONFIGFILE"
else
  echo ; echo "Error: Buildconfigfile $BUILDCONFIGFILE does exist. Terminate." ; exit 1
fi
if [ -f "$VERSIONFILE" ] ; then
  source "$VERSIONFILE"
else
  echo "Versionfile $VERSIONFILE missing" 
fi

if [ -z $(type -t odl_feature_install) ] ; then
  echo ; echo "  Copy function odl_feature_install is not specified. Terminate" ; echo ; exit 1 
fi

# ----------

echo "  Build description: $DESCRIPTION"
echo "  Version: $BUILDTAG"
echo

read -p "Confirm to stop, install and start clean karaf container. Press enter to continue or Ctrl-C to abort." ANSWER
echo "Initiate shutdown"
./bin/stop

karaf_waittillstopped

if [ -n "$1" ] ; then
  echo "Do installation of $1"
  tar -xf "$1" -C "$ODL_KARAF_HOME/system"
fi

doStartProcedure

