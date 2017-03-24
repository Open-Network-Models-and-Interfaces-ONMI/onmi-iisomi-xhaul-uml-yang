#!/bin/bash

#
# FILE:   md-startup.sh
# SYNTAX: md-startup.sh [option] | [-h|--help]
#

##### Consts
SCRIPT_FILE=$(readlink -f $0)
SCRIPT_DIR=$(dirname $SCRIPT_FILE)
PHP_SCRIPT_DIR=$SCRIPT_DIR
PERS_FILE="$HOME/.mdevconf"

##### Vars
name='NE-NAME'
ctrladdr="10.10.1.1"
ctrlport="8181"
ctrluser="admin"
ctrlpwrd="admin"

mdevif="eth0"
mdevip=""

tmpfile=""

##### Functions

function usage()
{
    echo ""
    echo "usage:" $(basename $0) "[option] | [-h|--help]"
    echo "where option is:"
    echo "  -e|--md-eth-interface <name>             # Mediation device eth interface name. Default: [$mdevif]"
    echo "  -n|--name <name>                         # Network element name. Default: [$name]"
    echo "  -a|--controller-ipaddress <ip-adddress>  # SDN controller ip address. Default: [$ctrladdr]"
    echo "  -p|--controller-port <port>              # SDN controller RESTconf port. Default: [$ctrlport]"
    echo "  -s|--show                                # show configured parameters (defaults)"
    echo "  -u|--controller-user <user>              # SDN controller user name. Default: [$ctrluser]"
    echo "  -w|--controller-password <pwd>           # SDN controller password. Default: [$ctrlpwrd]"
    echo ""
    echo "Note: login parameters are stored and used as default value in the next run"
    echo ""
}

function show_config_parameters()
{
    echo ""
    echo "$(basename $0) configured parameters:"
    echo "  Mediation device eth interface name ................ [$mdevif]"
    echo "  Network element name ............................... [$name]"
    echo "  SDN controller ip address .......................... [$ctrladdr]"
    echo "  SDN controller RESTconf port ....................... [$ctrlport]"
    echo "  SDN controller user name ........................... [$ctrluser]"
    echo "  SDN controller password ............................ [$ctrlpwrd]"
    echo ""
}

function create_xml_file_for_restconf()
{
   tmpfile=$(mktemp $SCRIPT_DIR/.tmpXXXXXX)
   sed -e "s/NAME/$name/" \
       -e "s/IPADDR/$mdevip/" \
       -e "s/PORT/830/" \
       -e "s/USER/compila/" \
       -e "s/PASS/compila+/" \
   $SCRIPT_DIR/RESTconf.xml > $tmpfile
}

function delete_xml_file_for_restconf
{
   rm $tmpfile
}

function save_config_parameters()
{
   echo "\$name=$name" > $PERS_FILE
   echo "\$ctrladdr=$ctrladdr" >> $PERS_FILE
   echo "\$ctrlport=$ctrlport" >> $PERS_FILE
   echo "\$ctrluser=$ctrluser" >> $PERS_FILE
   echo "\$ctrlpwrd=$ctrlpwrd" >> $PERS_FILE
   echo "\$mdevif=$mdevif" >> $PERS_FILE
   echo "\$mdevip=$mdevip" >> $PERS_FILE
}

function load_config_parameters()
{
  if [ -f "$PERS_FILE" ]
  then
    name=$(grep '$name' $PERS_FILE | sed -e 's/$name=//') 
    ctrladdr=$(grep '$ctrladdr' $PERS_FILE | sed -e 's/$ctrladdr=//') 
    ctrlport=$(grep '$ctrlport' $PERS_FILE | sed -e 's/$ctrlport=//') 
    ctrluser=$(grep '$ctrluser' $PERS_FILE | sed -e 's/$ctrluser=//') 
    ctrlpwrd=$(grep '$ctrlpwrd' $PERS_FILE | sed -e 's/$ctrlpwrd=//') 
    mdevif=$(grep '$mdevif' $PERS_FILE | sed -e 's/$mdevif=//') 
 fi
}

##### Main

# load login parameters
load_config_parameters

# Process input parameters
while [ "$1" != "" ]; do
    case $1 in
        -n | --name )           shift
                                name=$1
                                ;;
        -a | --controller-ipaddress )
                                shift
                                ctrladdr=$1
                                ;;
        -p | --controller-port )
                                shift
                                ctrlport=$1
                                ;;
        -w | --controller-password )
                                shift
                                ctrlpwrd=$1
                                ;;
        -u | --controller-user )
                                shift
                                ctrluser=$1
                                ;;
        -e | --md-eth-interface)
                                shift
                                mdevif=$1
                                ;;
        -s | --show )           show_config_parameters
                                exit
                                ;;
        -h | --help )           usage
                                exit
                                ;;
        * )                     usage
                                exit 1
    esac
    shift
done

mdevip=$(ifconfig "$mdevif" | grep 'inet addr' | awk -F: '{print $2}' | awk '{print $1}')

clear
# echo " name: ......................... " $name
# echo " controller-ipaddress: ......... " $ctrladdr
# echo " controller-port: .............. " $ctrlport
# echo " controller-user: .............. " $ctrluser
# echo " controller-password: .......... " $ctrlpwrd
# echo " mediation-ipaddress: .......... " $mdevip
echo ""
echo "---------------------------------"
echo " MD Startup"
echo "---------------------------------"

NETCONFD_running=$(ps -ef | grep "netconfd --no-startup" | grep -v grep | awk '{print $8}')

if [ "$NETCONFD_running" != "netconfd" ]
then
    echo "> MD server:              starting..."
    netconfd --no-startup --access-control=off --log-level=debug --target=running --log=/tmp/netconf.log \
             --module=microwave-model \
             --module=core-model \
    > /dev/null 2>&1 &

    # Build XML file with RESTconf message body
    # Please comment the following line if login parameter save is not required
    save_config_parameters

    # Build XML file with RESTconf message body
    create_xml_file_for_restconf

    sleep 2

    # Execute RESTconf call in order to register the NE to the SDN controller
    echo "> SDN controller login:  request sent..."
    retcode=$(php -f $PHP_SCRIPT_DIR/login.php "$tmpfile" "$ctrladdr" "$ctrlport" "$ctrluser" "$ctrlpwrd" "$mdevip" "$name")
    echo ">" $retcode

    # Delete XML file with RESTconf message body
    delete_xml_file_for_restconf
else
    echo " > MD server:             is already running"
fi

