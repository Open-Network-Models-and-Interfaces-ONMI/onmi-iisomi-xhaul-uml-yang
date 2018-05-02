# To be included into odl.sh .. not a stand alone script

karafcmd() {
   echo "$@"
   $ODL_KARAF_HOME/bin/client -u karaf "$@" 2> /dev/null
}

karaf_startup_all() {
    # Please choose only one of the next two lines depending you the target system (clustered ODL vs. standalone ODL)
    # karafcmd "feature:install odl-netconf-clustered-topology"
    # karafcmd "feature:install odl-netconf-topology"

    karafcmd  "feature:install odl-netconf-topology"
    karafcmd  "feature:install odl-restconf-all"
    karafcmd  "feature:install odl-mdsal-apidocs"
    karafcmd  "feature:install odl-dlux-all"

    # Activate logs
    karaf_enable_logs DEBUG

    # Wireless apps (mwtn: microwave transport network)
    # Link to the repository with all DLUX and network applications
    karafcmd "feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/0.4.0-SNAPSHOT/xml/features"
    # Network applications applications and DLUX bundles
    karafcmd "feature:install odl-mwtn-all"

    #Give time to initialize database
    sleep 10

    #Add this applications only if in repository
    if [ -d $HOME/.m2/repository/org/opendaylightxi/mwtn/genericpathmanager-features ] ; then
       karafcmd "feature:repo-add mvn:org.opendaylight.mwtn/genericpathmanager-features/0.4.0-SNAPSHOT/xml/features"
       karafcmd "feature:install odl-mwt-genericpathmanager"
       sleep 20
    fi
    if [ -d $HOME/.m2/repository/org/opendaylightxi/mwtn/ethernetpathmanager-features ] ; then
       karafcmd "feature:repo-add mvn:org.opendaylight.mwtn/ethernetpathmanager-features/0.4.0-SNAPSHOT/xml/features"
       karafcmd "feature:install odl-mwt-ethernetpathmanager"
       sleep 20
    fi
    if [ -d $HOME/.m2/repository/org/opendaylightxi/mwtn/opticalpathmanager-features ] ; then
       karafcmd "feature:repo-add mvn:org.opendaylight.mwtn/opticalpathmanager-features/0.4.0-SNAPSHOT/xml/features"
       karafcmd "feature:install odl-mwt-opticalpathmanager"
       sleep 20
    fi

    #If restart is required set RESTART to true
    RESTART="true"
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

