#!/bin/bash 
echo "--------------------------------" 
echo "ODL network applications"
echo "Creation and setup of database"
echo "--------------------------------" 
echo

ESFILE="elasticsearch.yml"
AC="./activeConfig"
CLUSTERNAME="sdnlabodl"
NEWCLUSTERNAME=$HOSTNAME
ESFILE="$AC/elasticsearch.yml"
DBFILE="$AC/config/elasticsearch.json"
TEMPLATE="./activeConfigExamples"
if [ -n "$1" ] ; then
   TEMPLATE="$TEMPLATE/$1"
else
   echo "Use default template"
   TEMPLATE="$TEMPLATE/sdnlabodl"
fi

if [ ! -d $TEMPLATE ] ; then
   echo "Can not find template: $TEMPLATE. Terminate"
else
   if [ -d $AC ] ; then
      echo "  $AC does already exists with:"
      grep cluster.name $ESFILE
      grep node.name $ESFILE
      echo "  For creating a new one do remove the old one first"
   else
      echo "  Do create new activeConfiguration using template $TEMPLATE and clustername $NEWCLUSTERNAME"
      mkdir $AC
      cp -r $TEMPLATE/* $AC
      sed -i -- "s/$CLUSTERNAME/$NEWCLUSTERNAME/g" $ESFILE
      sed -i -- "s/$CLUSTERNAME/$NEWCLUSTERNAME/g" $DBFILE
      echo "  Done"
   fi
fi
echo 
