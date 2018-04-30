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

    # persistent database (ElasticSearch)
    #  karafcmd  "feature:repo-add mvn:org.apache.karaf.decanter/apache-karaf-decanter/1.1.0/xml/features"
    #  karafcmd  "feature:install elasticsearch"

    # Logs and apps
    karaf_enable_logs DEBUG

    # Wireless (mwtn: microwave transport network)
    # Link to the repository with all DLUX and network applications
     karafcmd "feature:repo-add mvn:org.opendaylight.mwtn/mwtn-parent/0.4.0-SNAPSHOT/xml/features"

    # Network applications
     karafcmd "feature:install odl-mwtn-all"
     #Give time to initialize database

     karafcmd "feature:repo-add mvn:org.opendaylight.mwtn/genericpathmanager-features/0.4.0-SNAPSHOT/xml/features"
     karafcmd "feature:install odl-mwt-genericpathmanager"

     sleep 20

     karafcmd "feature:repo-add mvn:org.opendaylight.mwtn/ethernetpathmanager-features/0.4.0-SNAPSHOT/xml/features"
     karafcmd "feature:install odl-mwt-ethernetpathmanager"

     sleep 20

     karafcmd "feature:repo-add mvn:org.opendaylight.mwtn/opticalpathmanager-features/0.4.0-SNAPSHOT/xml/features"
     karafcmd "feature:install odl-mwt-opticalpathmanager"

     sleep 20

     #karafcmd "feature:install odl-mwt-models"
     #karafcmd "feature:install odl-mwt-websocketmanager"
     #karafcmd "feature:install odl-mwt-devicemanager"
     #karafcmd "feature:install odl-mwt-template"

    # Manadatory DLUX bundles
     #karafcmd "bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnCommons-bundle/0.4.0-SNAPSHOT"
     #karafcmd "bundle:install -s mvn:com.highstreet.technologies.odl.dlux/onapAai-bundle/0.4.0-SNAPSHOT"
    # Basic DLUX Bundles to connect and view model
     #karafcmd "bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnConnect-bundle/0.4.0-SNAPSHOT"
     #karafcmd "bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnBrowser-bundle/0.4.0-SNAPSHOT"
    # Applicatoin specific DLUX Bundles
     #    karafcmd "bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnFault-bundle/0.4.0-SNAPSHOT"
     #    karafcmd "bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnEvents-bundle/0.4.0-SNAPSHOT"
     #    karafcmd "bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnPerformanceCurrent-bundle/0.4.0-SNAPSHOT"
     #    karafcmd "bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnPerformanceHistory-bundle/0.4.0-SNAPSHOT"
     #    karafcmd "bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnPerformanceLink-bundle/0.4.0-SNAPSHOT"

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

