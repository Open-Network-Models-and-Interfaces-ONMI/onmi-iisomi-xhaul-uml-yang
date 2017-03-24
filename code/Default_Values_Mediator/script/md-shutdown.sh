#!/bin/bash

#
# FILE:   md-shutdown.sh
# SYNTAX: md-shutdown.sh [option] | [-h|--help]
#

##### Consts
SCRIPT_FILE=$(readlink -f $0)
SCRIPT_DIR=$(dirname $SCRIPT_FILE)
PHP_DIR=$SCRIPT_DIR
PERS_FILE="$HOME/.mdevconf"

##### Vars
name='NE-NAME'
ctrladdr="10.10.1.1"
ctrlport="8181"
ctrluser="admin"
ctrlpwrd="admin"

mdevif="eth0"

##### Functions

function usage()
{
    echo ""
    echo "usage:" $(basename $0) "[option] | [-h|--help]"
    echo "where option is:"
    echo "  -n|--name <name>                         # Network element name. Default: [$name]"
    echo "  -a|--controller-ipaddress <ip-adddress>  # SDN controller ip address. Default: [$ctrladdr]"
    echo "  -p|--controller-port <port>              # SDN controller RESTconf port. Default: [$ctrlport]"
    echo "  -s|--show                                # show configured parameters (defaults)"
    echo "  -u|--controller-user <user>              # SDN controller user name. Default: [$ctrluser]"
    echo "  -w|--controller-password <pwd>           # SDN controller password. Default: [$ctrlpwrd]"
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

function load_login_parameters()
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

# load login parameters
load_login_parameters

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

clear
echo
echo "---------------------------------"
echo " MD Stop"
echo "---------------------------------"

echo "> SDN controller logout:  request sent..."
retcode=$(php -f $PHP_DIR/logout.php "$ctrladdr" "$ctrlport" "$ctrluser" "$ctrlpwrd" "$name" &) # > /dev/null 2>&1 &)
echo ">" $retcode

#------------------------------------------------------------
# STOP MD server
#------------------------------------------------------------
pid=`ps -ef | grep "netconfd --no-startup" | grep -v grep | awk '{print $2}'`
if [ -n "$pid" ]
then
	kill $pid
	sleep 2
	
	pid=`ps -ef | grep "netconfd --no-startup" | grep -v grep | awk '{print $2}'`
	if [ -n "$pid" ]
	then
		echo "> MD server:  STILL RUNNING (UNABLE TO STOP IT)"
	else
		echo "> MD server:  STOPPED"
	fi
else
	echo "> MD server:  NOT RUNNING"
fi

echo


