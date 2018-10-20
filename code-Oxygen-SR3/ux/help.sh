#!/bin/bash

BUNDLE="-bundle"
MODULE="-module"
HELP="-help"
#from ux
CODE="../../code"

createSub() {
  HERE=$(pwd)
  dir2="$1"/"$1""$2"
  dir4=../../$CODE

  echo $dir2

  if [ ! -d $1 ] ; then
    mkdir $1
  fi
  mkdir $dir2
  cd $dir2
  cp  $dir4/ux/$dir2/pom.xml .
  ln -s $dir4/ux/$dir2/src 
  cd $HERE
}

createHelp() {
  dir3=../$CODE
  cd $1
  ln -s $dir3/ux/"$1"/"$1""-help"
  cd ..
}

createMain() {
  dir3=../$CODE
  if [ ! -d $1 ] ; then
    mkdir $1
  fi
  cd $1
  cp $dir3/ux/$1/pom.xml .
  cd ..
}

create() {
  createMain $1
  createSub $1 $BUNDLE
  createSub $1 $MODULE
  createHelp $1
}

declare -a arr=("ethService" "mwtnBrowser" "mwtnCompare" "mwtnFault" "mwtnMediator" "mwtnPerformanceLink" 
"mwtnTest" "onapAai" "otnBrowser" "mwtnClosedLoop" "mwtnConnect"
"mwtnInventory" "mwtnPerformanceCurrent" "mwtnSpectrum" "mwtnTopology" "onapDcae" "mwtnCommons"
"mwtnEvents" "mwtnLog" "mwtnPerformanceHistory" "mwtnTdm" "odlChat" "onapSo")

case "$1" in
     c) echo "Create linked bundles"
	for i in "${arr[@]}" ; do
   	  echo "$i"
          rm -r $i
          create $i
        done
        ;;
     v) echo "Change version numbers"
           find . -name "pom.xml" | xargs grep "<version>0.5.1-SNAPSHOT"
        ;;

     *)
       echo "c   -   create bundles"
       echo "v   -   change version numbers"
       ;;
esac

