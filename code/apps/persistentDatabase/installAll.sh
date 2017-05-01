# Install database structure

HERE=$(pwd)

if ! [ -d indexConfig -a -d indexMwtn -a -d indexSdnevents ] ; then
   echo "Started at wrong place or underlaying files not complete. Terminate"
else
   cd indexConfig
   node initConfig.js
   cd ../indexMwtn
   #node initDatabase.j
   ./manageMwtn.sh
   cd ../indexSdnevents
   ./manageSdnevents.sh
   cd ../indexSdnperformance
   ./manageSdnperformance.sh
   cd ..
fi

