#!/bin/bash
# (c) 2016 highstreet technologies
# History
#   2.1 Modify to use config/active directory
#   2.2 Correct problems
#   2.3 Shift config/active to code/apps/persistentDatabase/activConfig
#   2.4 Update to Boron
Version=2.4

# ----- Constants

ACTIVECONFIG=apps/persistentDatabase/activeConfig
ELASTICSEARCHCONFIG=$ACTIVECONFIG/config/elasticsearch.json
ELASTICSEARCHCONFIGYML=$ACTIVECONFIG/elasticsearch.yml


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
       $ODL_KARAF_HOME/bin/start
       echo "Started"
    fi
}

database_cleansetup() {

  echo "New and clean setup of database"

  cd $here
  if [ ! -e $ELASTICSEARCHCONFIG ] ; then
     echo "Configuration file $ELASTICSEARCHCONFIG missing. Can not proceed."
  else

     if [ -d $ODL_KARAF_HOME/etc/elasticsearch ] ; then
        echo "Found and delete existing database content"
        rm -r $ODL_KARAF_HOME/etc/elasticsearch
     fi

     echo "start karaf"
     $ODL_KARAF_HOME/bin/start clean

     echo "Wait 30s till karaf and ssh is in a working level"
     sleep 30

     NETSTATRESULT=$(netstat -ant | grep 8101)
     if [ -z "$NETSTATRESULT" ] ; then
        echo "Karaf not running after 30 seconds. Can not proceed with setup."
     else
        echo "Provisioning of elasticsearch"
        ./karafcmd.sh "feature:repo-add mvn:org.apache.karaf.decanter/apache-karaf-decanter/1.1.0/xml/features"
        ./karafcmd.sh "feature:install elasticsearch"
        echo "Wait 20s till ES is running"
        sleep 20
        #Script 1 Begin
        cd apps/persistentDatabase
        ./installAll.sh
        cd $here

        echo "Wait 10 seconds till db wrote"
        sleep 10
    read -p "Press <Enter> to shutdown..."

        echo "stop karaf command"
        $ODL_KARAF_HOME/bin/stop
        karaf_waittillstopped
     fi
   fi
}

# Start only customer specific Services
karaf_startup_1b() {
    HERE=$(pwd)
    cd $ODL_KARAF_HOME

    source $ODL_FACTORY_HOME/buildconfig.txt
    odl_feature_install

    cd $HERE
}

# Start all servies
karaf_startup_all() {
    # Please choose only one of the next two lines depending you the target system (clustered ODL vs. standalone ODL)
    # ./karafcmd.sh "feature:install odl-netconf-clustered-topology"
    # ./karafcmd.sh "feature:install odl-netconf-topology"

    ./karafcmd.sh  "feature:install odl-netconf-topology"
    ./karafcmd.sh  "feature:install odl-restconf-all"
    ./karafcmd.sh  "feature:install odl-mdsal-apidocs"
    ./karafcmd.sh  "feature:install odl-dlux-all"

  # persistent database (ElasticSearch)
    ./karafcmd.sh  "feature:repo-add mvn:org.apache.karaf.decanter/apache-karaf-decanter/1.1.0/xml/features"
    ./karafcmd.sh  "feature:install elasticsearch"

  # Wireless (mwtn: microwave transport network)
    ./karafcmd.sh "feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/0.4.0-SNAPSHOT/xml/features"
    ./karafcmd.sh "feature:install onap-sdnr-all"
#    ./karafcmd.sh "feature:install odl-mwt-template"

#    ./karafcmd.sh "feature:install odl-mwt-models"
#    ./karafcmd.sh "feature:install odl-mwt-devicemanager"
#    ./karafcmd.sh "feature:install odl-mwtn-all"
#    ./karafcmd.sh "bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnBrowser-bundle/0.4.0-SNAPSHOT"
#    ./karafcmd.sh "bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnFault-bundle/0.4.0-SNAPSHOT"
#    ./karafcmd.sh "bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnEvents-bundle/0.4.0-SNAPSHOT"
#    ./karafcmd.sh "bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnPerformanceCurrent-bundle/0.4.0-SNAPSHOT"
#    ./karafcmd.sh "bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnPerformanceHistory-bundle/0.4.0-SNAPSHOT"
#    ./karafcmd.sh "bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnPerformanceLink-bundle/0.4.0-SNAPSHOT"
#    ./karafcmd.sh "bundle:install –s mvn:com.highstreet.technologies.odl.dlux/onapAai-bundle/0.4.0-SNAPSHOT"
}

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

    echo "Wait 30s till karaf and ssh is in a working level"
    sleep 30
    netstat -ant | grep 8101
    echo "Provisioning $1"
    if [ "$1" = "1b" ] ; then
      karaf_startup_1b
    else
      karaf_startup_all
    fi
    $ODL_KARAF_HOME/bin/stop
    echo "Re-starting Karaf to finish setup"
    karaf_waittillstopped
    if [ "$1" = "d" -o "$2" = "d" ] ; then
      rp=$ODL_KARAF_HOME/data/log
      echo "Remove all logs from $rp"
      rm "$rp"/*
    fi
    karaf_startifnotrunning

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
    install_originM2Range "cn/com" "zte"
    install_originM2Range "com" "hcl"
    install_originM2Range "com" "highstreet"

    #Old implementation
    #cp -R ~/.m2/repository/org/opendaylight/mwtn $ODL_KARAF_HOME/system/org/opendaylight
    #mkdir -p $ODL_KARAF_HOME/system/cn/com
    #cp -R ~/.m2/repository/cn/com/zte $ODL_KARAF_HOME/system/cn/com
    #cp -R ~/.m2/repository/com/hcl $ODL_KARAF_HOME/system/com
    #cp -R ~/.m2/repository/com/highstreet $ODL_KARAF_HOME/system/com
}

install_originBuild() {

   if [ -z $ODL_FACTORY_HOME ] ; then
     echo "No ODL_FACTORY_HOME defined. Terminate" ; exit 2
   fi
   echo "Factory home at $ODL_FACTORY_HOME"
   if [ ! -e $ODL_FACTORY_HOME/builds/version.txt ] ; then
     echo "No builds available Terminate." ; exit 2
   fi

   source $ODL_FACTORY_HOME/builds/version.txt
   echo "Install Version $LASTBUILDTAR"
   tar -xf "$ODL_FACTORY_HOME/builds/$LASTBUILDTAR" -C "$ODL_KARAF_HOME/system"
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
    tool_check_installed unzip
    #tool_check_installed sshpass
    KARAFDISTBASENAME=$ODL_KARAF_DIST
    KARAFGZ="$HOME/Downloads/"$KARAFDISTBASENAME".tar.gz"
    echo "Using config from $ACTIVECONFIG"
    if [ ! -d "$ACTIVECONFIG" ] ; then
       echo ; echo "ERROR: Could not find $ACTIVECONFIG -> Terminate. Please prepare this configuration." ; echo ; exit 1
    fi
    if [ ! -f "$KARAFGZ" ]
    then
      echo "Could not find tar file with karaf distribution: $KARAFGZ"
    else
      if [ -d "$ODL_KARAF_HOME" ] ; then
         echo "Found existing Karaf distribution at $ODL_KARAF_HOME. Can not proceed. Please remove or rename."
      else
         if [ ! -e "$ELASTICSEARCHCONFIGYML" ] ; then
            echo "Configuration file $ELASTICSEARCHCONFIGYML missing. Can not proceed. Please provide."
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

               echo "Patch DLUX"
           cd ./apps/dlux
           ./installDlux.sh
               cd "$here"

               echo "Konfiguration file for elastic search"
               cp $ELASTICSEARCHCONFIGYML $ODL_KARAF_HOME/etc

               mkdir "$ODL_KARAF_HOME/etc/elasticsearch-plugins/"
               echo "Install head plugin"
               unzip -q apps/persistentDatabase/plugins/head.zip -d $ODL_KARAF_HOME/etc/elasticsearch-plugins/
               echo "Install delete-by-query plugin"
               unzip -q apps/persistentDatabase/plugins/delete-by-query.zip -d $ODL_KARAF_HOME/etc/elasticsearch-plugins

               cd "$here"
               database_cleansetup
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
       read -p "Delete karaf installation. if you are sure type yes<enter> " answer
       if [ "$answer" == "yes" ] ; then
          echo "Remove"
          sudo rm -r $ODL_KARAF_HOME
          echo "removed"
       else
          echo "Do nothing"
       fi
    fi
}

# -----------------------------------------------------
# ----- Script body

echo "AppToODL installer $Version"
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
  if [ ! -d "../code" ] ; then
    echo "Script execution problem with this potential cause:"
    echo "   Execution only within SDN-Project/code directory"
    echo "Can not execute"
    script_command="Error wrong directory or missing setup files"
  else
    script_command="ok"
  fi
fi

#echo "Command: $script_command"

if [ "$script_command" = "ok" ] ; then

case "$1" in
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
    karaf_startifnotrunning
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

  ib)
    do_install build
    ;;

  ibb)
    do_install build 1b
    ;;

  imd)
    do_install m2 d
    ;;

  im)
    do_install m2
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

  dbremove)
    karaf_remove
    ;;

  debug)
    ./karafcmd.sh "log:set DEBUG com.highstreet.technologies"
    ./karafcmd.sh "log:set TRACE org.opendaylight.netconf"
    ;;

  *)
    echo "Commands:"
    echo " a           for build all and install from M2"
    echo " d           for devicemanager and install from M2"
    echo " debug       activate debug for netconf and mwtn"
    echo " ib          for install from Build-directory"
    echo " ibb         for install from Build-directory and start with 1b featureet"
    echo " im          for install from M2-directory"
    echo " imd         for install from M2-directory. Delete logs bevore start command"
    echo " v           for get Versions"
    echo " env         List environment variables"
    echo " bower       for install bower"
    echo " prepare     to install and prepare a karaf. Packed Version expected in Downloads"
    echo " test        do some testing"
    echo " dbclean     clean db and load with initial data"
    echo " karafclean  start clean and install apps on karaf"
    echo " start       start karaf"
    echo " stop        stop and wait karaf"
    echo " repoclean   clean the repositories"
    echo " migrate     migrate Param1 Param2 Migrate on localhost"
    echo " status      display karaf status"
    echo " dbremove    remove existing karaf distribution"
    ;;
esac
fi

unset install_err

