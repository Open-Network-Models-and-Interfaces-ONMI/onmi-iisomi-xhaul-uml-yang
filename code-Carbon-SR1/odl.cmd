# To be included into odl.sh .. not a stand alone script

# Startup of single node (no clustering)
karaf_startup_all() {
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
    # Base
    karafcmd  "feature:install odl-mdsal-clustering"
    sleep 30
    karafcmd  "feature:install odl-netconf-clustered-topology"
    sleep 30
    karafcmd  "feature:install odl-restconf-all"
    karafcmd  "feature:install odl-mdsal-apidocs"

    # Logs and apps
    karaf_enable_logs
    karaf_startup_apps 
}

# Sub functions

karaf_startup_apps() {
    # karafcmd  "feature:install odl-dluxapps-applications"
    karafcmd  "feature:install odl-dlux-core"
    karafcmd  "feature:install odl-dluxapps-nodes"
    karafcmd  "feature:install odl-dluxapps-yangui"
    karafcmd  "feature:install odl-dluxapps-yangvisualizer"

    # Wireless (mwtn: microwave transport network)
    karafcmd "feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/0.5.1-SNAPSHOT/xml/features"
    karafcmd "feature:install odl-mwtn-all"

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
