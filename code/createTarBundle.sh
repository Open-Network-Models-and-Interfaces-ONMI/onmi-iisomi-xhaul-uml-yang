#!/bin/bash


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
     if [ "$running1" = "2" -a "$running2" = "2" ] ; then
        running="true"
     else
        running="false"
   fi
  fi
  #echo "Test running: $running indication:$reason"
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


# Main part of the script

  HERE=$(pwd)
  echo "Creating a TAR Bundle with PoC Files"
  echo "Environment JAVA_HOME: $JAVA_HOME  JAVA_MAX_MEM: $JAVA_MAX_MEM   ODL_KARAF_HOME: $ODL_KARAF_HOME"
  if [ -z $ODL_KARAF_HOME ] ; then
     echo "ODL_KARAF_HOME must be set. Terminate."
  else
     echo "Compile all"
     mvn clean install -DskipTests
     if [[ $? -ne 0 ]] ; then
        echo "Could not complete. Terminate."
     else
        echo "Clean repository"
        rm -rf ~/.m2/repository/com/highstreet/technologies/odl/app/closedLoopAutomation-karaf/
        rm -rf ~/.m2/repository/com/highstreet/technologies/odl/app/spectrum/scheduler-karaf/
        find ~/.m2/repository/org/opendaylight/mwtn/* -type d -name "*-module" -exec rm -rf {} \;
        find ~/.m2/repository/com/hcl/* -type d -name "*-module" -exec rm -rf {} \;
        find ~/.m2/repository/com/highstreet/* -type d -name "*-module" -exec rm -rf {} \;

        echo "Clean karaf distribution"
        rm -rf $ODL_KARAF_HOME/cache/schema/tailf*.yang
        rm -rf $ODL_KARAF_HOME/cache/schema/yuma*.yang

        rm -rf $ODL_KARAF_HOME/data/*

        rm -rf $ODL_KARAF_HOME/system/org/opendaylight/mwtn
        rm -rf $ODL_KARAF_HOME/system/com/hcl
        rm -rf $ODL_KARAF_HOME/system/com/highstreet

        rm $ODL_KARAF_HOME/etc/org.ops4j.pax.web.cfg

        echo "Deploy from .m2 into karaf distribution"
        mkdir -p $ODL_KARAF_HOME/system/cn
        mkdir -p $ODL_KARAF_HOME/system/cn/com
        cp -R ~/.m2/repository/org/opendaylight/mwtn $ODL_KARAF_HOME/system/org/opendaylight
        cp -R ~/.m2/repository/cn/com/zte $ODL_KARAF_HOME/system/cn/com
        cp -R ~/.m2/repository/com/hcl $ODL_KARAF_HOME/system/com
        cp -R ~/.m2/repository/com/highstreet $ODL_KARAF_HOME/system/com

        STEP="Create distribution"
        read -p "Press <Enter> to proceed with ... $STEP"
        echo "$STEP"
        TARDIR="onf-wireless-4th-poc-karaf-0.5.1-Boron-SR1-$(date +'%Y-%m-%d')"
        echo "  Using directory: $HOME/$TARDIR"
        if [ -d $HOME/$TARDIR ] ; then
          echo "Directory exists. Do remove. Terminate"
        else
          cd ~
          mkdir $TARDIR
          cp -r distribution-karaf-0.5.1-Boron-SR1/* $TARDIR
          
          echo "Creating tar file"
          tar -czvf "$TARDIR.tar.gz" $TARDIR

          karaf_checkrunning          
          if [ running = "true" ] ; then
            echo "Karaf instance already running. Stop first. Terminate"
          else
            STEP="Run distribution"
            read -p "Press <Enter> to proceed with ... $STEP"
            echo "$STEP"

            cd $TARDIR
            ./bin/start
            SLEEP1=30
            echo "Wait $SLEEP1 Seconds till karaf is started"
            sleep $SLEEP1 
            ./bin/client "feature:install odl-netconf-topology"
            ./bin/client "feature:install odl-restconf-all"
            ./bin/client "feature:install odl-mdsal-apidocs"
            ./bin/client "feature:install odl-dlux-all"
            ./bin/client "feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/0.4.0-SNAPSHOT/xml/features"
            ./bin/client "feature:install elasticsearch"
            ./bin/client "feature:install odl-mwtn-all"
            ./bin/client "feature:repo-add mvn:com.highstreet.technologies.odl.app/route-features/0.4.0-SNAPSHOT/xml/features"
            ./bin/client "feature:install odl-route"

            echo "Stop and restart"
            ./bin/stop
            echo "Wait till karaf is stopped"
            karaf_waittillstopped
            echo "Start again"
            ./bin/start
            STEP="Test of distribution"
            read -p "Press <Enter> if ready with ... $STEP"
            echo "$STEP"
            echo "Plaese do the tests now"

          fi
       fi 
     fi
  fi


