echo "Karaf commando: $@"
#sshpass -p 'karaf' ssh -p 8101 -o UserKnownHostsFile=/dev/null -oHostKeyAlgorithms=+ssh-dss -o StrictHostKeyChecking=no karaf@localhost "$1"
# Delay a little bit to prevent problems
if [ "$1" = "debug" ] ; then
  shift
  $ODL_KARAF_HOME/bin/client -u karaf "$@"
else
  $ODL_KARAF_HOME/bin/client -u karaf "$@" 2> /dev/null
fi
