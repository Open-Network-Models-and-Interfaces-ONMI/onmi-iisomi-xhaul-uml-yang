#!/bin/bash
# Build tool V2
# (c)2018 highstreet technologies GmbH
# History
#       01.01.2017 First version
#       12.01.2017 Create ZIP file and provide build version tag to bundels.
#       29.03.2018 Version 3.Start position additionally within code-home
#                  Change: Position of build config additional choice
#       16.05.2018 Some reworking
#       04.06.2018 Move beginning of tar file to root
Version=3.3

#--------------------------------------------------
# Definitions
# Furter, specific definition are in BUILDCONFIGFILE

# Used from buildconfig.txt
#TMPDIR   Path for temporary tar files

CONFIG=dist.conf
BUILDCONFIGFILE="buildconfig.txt"
BUILDPATH="builds"
BASEPATH="base"

VERSIONFILE="version.txt"

BUILDPREFIX="networkapps."
REPOSITORYPATH="$HOME/.m2/repository"

#--------------------------------------------------
# Functions

# copy from KARAF Container
# Unused at to moment
cpOdlDistRepoAppToTmpFolder() {
  for var in "$@" ; do
    TMPSRC="$ODL_KARAF_HOME/system/$var"
    echo " Take over libs from Karaf $TMPSRC"
    mkdir -p "$VERSIONPATH/$var"
    cp  -r $TMPSRC "$VERSIONPATH/$var/.."
  done
}

# Central exit. Don't use exit .. use centralexit
cexit() {
   cd $STARTLOCATION
   exit $1
}

createVersionFile() {
  VERSIONFILEABS="$BUILDPATH/$VERSIONFILE"
  echo "# Created by $USER on server $HOSTNAME" > $VERSIONFILEABS
  echo "# DATE: $(date)" >> $VERSIONFILEABS
  echo "# JAVA: $JAVA_HOME" >> $VERSIONFILEABS
  echo "# GIT-Tag:  $BUILDTAG" >> $VERSIONFILEABS
  echo "# Repositoryversion: $REPOSITORYVERSION" >> $VERSIONFILEABS
  echo "# Karaf: $ODL_KARAF_DIST" >> $VERSIONFILEABS
  echo "VERSION=\"$VERSION\"" >> $VERSIONFILEABS
  echo "BUILDTAG=\"$BUILDTAG\"" >> $VERSIONFILEABS
  echo "BUILDVERSION=$BUILDVERSION" >> $VERSIONFILEABS
  echo "BUILDSUBVERSION=$BUILDSUBVERSION" >> $VERSIONFILEABS
  echo "LASTBUILDTAR=$LASTBUILDTAR" >> $VERSIONFILEABS
  echo "LASTBUILDZIP=$LASTBUILDZIP" >> $VERSIONFILEABS
}

setGitTag() {
   read -p "Shall I create git version tag '$VERSION' with remark '$BUILDTAG' in repo '$POMHOME'. Answer y/n? " answer
   if [ "$answer" = "y" ] ; then

      echo "Setting label"
      HERE=$(pwd)
      cd $POMHOME
      git tag -a $VERSION -m "$BUILDTAG"
      git push origin $VERSION
      cd $HERE
   fi
}


doDelivery() {
   echo "Submit delivery package with version $VERSION"
   if [ -z "$DELIVERYDIRECTORY" -o -z "$DELIVERYBASE$VERSION"  ] ; then
      echo "  ERROR: Provide variables DELIVERYDIRECTORY='$DELIVERYDIRECTORY' and DELIVERYBASE='$DELIVERYBASE'. Can not proceed"
   else

      READMEFILE="$BUILDPATH/readme.$VERSION.txt"
      echo "Readmefile: $READMEFILE"

      if [ ! -e $READMEFILE ] ; then
         echo " ERROR: Readme file missing. Create the file to proceed"
      else

         DEST=$DELIVERYDIRECTORY/$DELIVERYBASE$VERSION
         if [ -d $DEST ] ; then
            echo "  ERROR: Build destination already existing. Can not proceed."
         else
            echo "Create destination $DEST and copy files..."
            mkdir $DEST
            cp $READMEFILE $DEST
            cp $BUILDPATH/$LASTBUILDTAR $DEST
            echo "Done"
            echo
            setGitTag
         fi
      fi
   fi
}

# copymakro ... here all copy commands are included to copy from .m2 repository to tar file
# copyFromRepository()  .. needs to be spezified
# If build was successfull store everything and create the tar and the zip
createBuildFiles() {
  TMPVERSIONPATH="$TMPDIR/$1"
  mkdir $TMPVERSIONPATH

  LASTBUILDTAR=$BUILDPREFIX$VERSION.tar
  LASTBUILDZIP=$BUILDPREFIX$VERSION.zip
  createVersionFile

  cp $VERSIONFILEABS "$TMPVERSIONPATH/networkAppVersion.txt"

  #Copy into location for Karaf repository - system
  copyFromRepository "$TMPVERSIONPATH"

  HERE=$(pwd)
  cd $TMPVERSIONPATH

  echo "Create tar file"
  tar -czf "$ODL_BUILD_HOME/$BUILDPATH/$LASTBUILDTAR" --exclude='*.kar' *

  #17/07/11 Not used .. so changed
  #echo "Create zip file"
  #zip -r -q "../$LASTBUILDZIP" . -x '*.kar'

  cd $HERE

  #rm -r $TMPVERSIONPATH

}

# Create new readme file.
# Paramers are 1:oldversion 2:newversion 3:buildtag 4:tarfile
createReadme() {
  READMEFILENAMEOLD="readme.$1.txt"
  READMEFILENAMENEW="readme.$2.txt"
  echo "Create README $READMEFILENAMENEW"
  if [ -e "$BUILDPATH/$READMEFILENAMEOLD" ] ; then
  	echo "Network apps $BUILDTAG"> "$BUILDPATH/$READMEFILENAMENEW"
  	echo >> "$BUILDPATH/$READMEFILENAMENEW"
  	echo -n "Checksum sha256sum: " >> "$BUILDPATH/$READMEFILENAMENEW"
  	sha256sum "$BUILDPATH/$4" >> "$BUILDPATH/$READMEFILENAMENEW"
  	echo >> "$BUILDPATH/$READMEFILENAMENEW"
  	echo "Changes of released version: $BUILDTAG" >> "$BUILDPATH/$READMEFILENAMENEW"
  	echo >> "$BUILDPATH/$READMEFILENAMENEW"
  	tail -n +2 "$BUILDPATH/$READMEFILENAMEOLD" >> "$BUILDPATH/$READMEFILENAMENEW"
    #cp "$BUILDPATH/$READMEFILENAMEOLD" "$BUILDPATH/$READMEFILENAMENEW"
    # sed -i "s/.$1/.$2/g" "$BUILDPATH/$READMEFILENAMENEW"
  else
    echo "Write inital readmefile $BUILDPATH/$READMEFILENAMENEW to edit"
    echo "Initial Readme file. Edit this file for $BUILDTAG" > "$BUILDPATH/$READMEFILENAMENEW"
  fi
}

copyBinaries() {
   if [ -z "$ODL_BUILD_HOME" ] ; then
      echo "ODL_BUILD_HOME not specified. Can not execute command"
   else
     if [ -z $ODLBIN ] ; then
   	   TMPBIN="$POMHOME/../bin"
     else
       TMPBIN="$ODLBIN"
     fi
     if [ -z $TMPBIN ] ; then
   	   echo "Wrong source definition: $TMPBIN"
     else
       echo "copy binaries from $TMPBIN to repository"
       rm -r $ODL_BUILD_HOME/bin
       cp -r $TMPBIN $ODL_BUILD_HOME
     fi
   fi
}

doBuild() {
   VERSIONOLD=$(printf "%s.%03d" $BUILDVERSION $BUILDSUBVERSION)
   BUILDSUBVERSION=$((BUILDSUBVERSION+1))
   VERSION=$(printf "%s.%03d" $BUILDVERSION $BUILDSUBVERSION)
   VERSIONPATH="$BUILDPREFIX$VERSION"
   echo "New Version: $VERSION in path $VERSIONPATH"

   # Build everything with version number
   BUILDTAG="($HOSTNAME)-$VERSION $(date -u "+%F %H:%M %Z")"
   echo "Compiling everything with build tag $BUILDTAG"
   echo "Compiling in path $POMHOME"

   HERE=$(pwd)
   cd $POMHOME

   if [ "$1" = "test" ] ; then
   	  echo "Skip Compile"
   	  RESULT=0
   else
      mvn clean install -DskipTests -Dbuildtime="$BUILDTAG"
      RESULT=$?
   fi
   cd $HERE

   if [[ $RESULT -ne 0 ]] ; then
      echo "Could not succeed compilation"
   else
      echo "Create the build packages"
      createBuildFiles "$VERSIONPATH"
      createReadme "$VERSIONOLD" "$VERSION" "$BUILDTAG" "$LASTBUILDTAR"
      copyBinaries
   fi
}

# call with name and parameter that completes normally if tool is installed e.g. java -version
check4Tool() {
    $2 >/dev/null 2>&1 || { echo "Error: I require '$1' but it's not installed. Aborting."; echo; cexit 1; }
}


install_originBuild() {
   if [ ! -f ./builds/version.txt ]
   then
     echo No builds available
   else
     source ./builds/version.txt
     echo "Install Version $LASTBUILDTAR"
     tar -xf "./builds/$LASTBUILDTAR" -C "$ODL_KARAF_HOME/system"
     echo "Version info"
     mv $ODL_KARAF_HOME/system/version.txt $ODL_KARAF_HOME/networkAppVersion.txt
     cat $ODL_KARAF_HOME/networkAppVersion.txt
   fi
}

clean_build() {
   echo "Clean karaf distribution"
   rm -rf $ODL_KARAF_HOME/cache/schema/tailf*.yang
   rm -rf $ODL_KARAF_HOME/cache/schema/yuma*.yang

   rm -rf $ODL_KARAF_HOME/data/*

   rm -rf $ODL_KARAF_HOME/system/org/opendaylight/mwtn
   rm -rf $ODL_KARAF_HOME/system/com/hcl
   rm -rf $ODL_KARAF_HOME/system/com/highstreet

   rm $ODL_KARAF_HOME/etc/org.ops4j.pax.web.cfg
}


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
     if [ "$running1" = "2" -o "$running2" = "2" ] ; then
        running="true"
     else
        running="false"
   fi
  fi
  #echo "Test running: $running indication:$reason"
}

#wait till karaf is stopped
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

#create TAR file with new package
create_clone() {
   STEP="Create distribution"
   read -p "Press <Enter> to proceed with ... $STEP"
   echo "$STEP"
   TARDIR="distribution-karaf-0.5.1-Boron-SR1-TST-$VERSION"
   echo "  Using directory: $HOME/$TARDIR"
   if [ -d $HOME/$TARDIR ] ; then
     echo "Directory exists. Do remove. Terminate"
   else
     cd ~
     mkdir $TARDIR
     cp -r $ODL_KARAF_HOME/* $TARDIR

     echo "Creating tar file"
     tar -czf "$TARDIR.tar.gz" $TARDIR

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
       odl_feature_install

       echo "Stop and restart"
       ./bin/stop
       echo "Wait till karaf is stopped"
       karaf_waittillstopped
       echo "Start again"
       ./bin/start
       STEP="Test of distribution to shutdown or press CTRL-C to if you don't like to stop"
       read -p "Press <Enter> if ready with ... $STEP"
       echo "$STEP"
       echo "Stop now"
       ./bin/stop
       karaf_waittillstopped
       echo "Stop status reached"

     fi
  fi
}


#--------------------------------------------------
# Body

echo
echo "--------------------------------------------------"
echo "highstreet technologies GmbH (c)2018"
echo "Build tool V2 networkApplications for OpenDaylight"
echo "Version: $Version"
echo "--------------------------------------------------"
echo

STARTLOCATION="$(pwd)"
check4Tool zip "zip -L"

if [ -f "$CONFIG" ] ; then
  source "$CONFIG"
  echo "  Found config file and load configuration. Distribution: $ODL_KARAF_DIST"
  echo "  Change to related build path: $ODL_BUILD_HOME"
  echo
  cd "$ODL_BUILD_HOME"
fi

if [ ! -d "$JAVA_HOME" ] ; then
  echo; echo "JAVA_HOME not spezified. Aborting."; cexit 1;
fi

echo "  Info: Java home: $JAVA_HOME"

echo
if [ -f "$BUILDCONFIGFILE" ] ; then
  echo "  Use local config file: $BUILDCONFIGFILE"
  source "$BUILDCONFIGFILE"
else
  echo "  Use default configuration"
  DESCRIPTION="Default build configuration"
fi
echo "  Build description: $DESCRIPTION"
if [ -z $(type -t copyFromRepository) ] ; then
  echo ; echo "  Copy function copyFromRepository is not specified. Terminate" ; echo ; cexit 2
fi

echo
if [ -d "$BUILDPATH" ] ; then
  echo "  Found a buildpath: $BUILDPATH"
else
  echo "  Create the buildpath: $BUILDPATH"
  mkdir "$BUILDPATH"
fi

echo
if [ -f "$BUILDPATH"/"$VERSIONFILE" ] ; then
  echo "  Read versionfile"
  source "$BUILDPATH"/"$VERSIONFILE"
  echo "  Actual version: $BUILDVERSION.$BUILDSUBVERSION"
  SOURCEOK="1"
else
  echo "  No versionfile in $(pwd)"
  BUILDVERSION=$INITIALBUILDVERSION
  BUILDSUBVERSION=$INITIALBUILDSUBVERSION
  echo "  Set Actual version to: $BUILDVERSION.$BUILDSUBVERSION"
fi

echo
case "$1" in
   cpbin)
     copyBinaries
     ;;
   build)
      doBuild $2
      ;;

   deliver)
      if [ "$SOURCEOK" = "1" ] ; then
         doDelivery
      else
         echo "Found no build. Can not deliver."
      fi
      ;;

   dlux)
      if [ -z "$ODL_KARAF_HOME" ] ; then
         echo "  No karaf distribution available. Stop execution."
         cexit 3
      else
         echo "  Create DLUX tar bundle"
         if [ ! -d "$BASEPATH" ] ; then
            echo "  Create directory $BASEPATH"
            mkdir "$BASEPATH"
         fi
         HERE="$(pwd)"
         DLUXTAR="$HERE/$BASEPATH/dluxFullPatched.$ODL_KARAF_DIST.tar.gz"
         cd "$ODL_KARAF_HOME/system"
         tar -zcf $DLUXTAR org/opendaylight/dlux
         echo "  Done: $DLUXTAR"
         cd "$HERE"
      fi
      ;;

   in*)
      clean_build
      install_originBuild
      create_clone
      ;;

   tag)
      if [ "$SOURCEOK" = "1" ] ; then
         setGitTag
      else
         echo "Found no build. Can not tag."
      fi
      ;;

   *)
      echo ; echo "Help: "
      echo "-------------------------------------------------"
      echo "  Create a bundle for delivery"
      echo "  Build script $VERSION with command"
      echo "      build     Create a new build bundle"
      echo "      cpbin     Copy binary folder"
      echo "      deliver   Deliver actual build"
      echo "      dlux      Create dlux bundle from container"
      echo "      install   Clean and install karaf distro"
      echo "      tag       Set git Tag with actual version"
      echo "-------------------------------------------------"
      echo
      ;;
esac

cexit 0
