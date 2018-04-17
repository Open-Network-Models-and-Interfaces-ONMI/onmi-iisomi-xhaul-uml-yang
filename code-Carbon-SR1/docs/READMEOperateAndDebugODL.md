## Operate and debug ODL for testing

### Debug ODL

#### Activate or deactivate log point

Getting Log info about a specific service:

    log:set DEBUG com.highstreet.technologies

Getting all NETCONF/YANG traffic (Hint: huge amount of data, only for test purpose):

    log:set TRACE org.opendaylight.netconf

For switching off logging set level to INFO to see the log point

    log:set INFO org.opendaylight.netconf

For deleting the log point for a package

    log:set DEFAULT org.opendaylight.netconf

Configuration of logging is done here:

    vi $ODL_KARAF_HOME/etc/org.ops4j.pax.logging.cfg

#### View the log

A good option is to cd into the log directory and use grep and vi to view into the logs.

    cd $ODL_KARAF_HOME/bin/data/log

A second option is within the karaf command line to use the command *log:display* in combination with grep.

    log:display | grep


### Operate ODL

#### In shell or background

There are two way to start and run ODL. The command are available in the $ODL_KARAF_HOME/bin directory.

  1. In the karaf shell
   - Using *./bin/karaf* command to run ODL in a shell.
   - In this way of operation ODL is running if the shell is running.
   - If you leave the shell by shutdown or logout command ODL is stopped.

  2. In the background
   - Use command *./bin/start*, *./bin/stop* to run and stop ODL.
   - Attaching to the command line with *client*
   - In this way of operation ODL is running in the background.

#### Check if ODL is running

A good way to check if ODL is running is to use the command

    ps -ef | grep karaf

The feedback of *status* is not always true during startup or shutdown.
In some cases ODL run two times in a JVM what needs to be avoided.


