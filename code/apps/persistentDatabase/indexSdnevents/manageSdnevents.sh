# sdnevents management script
# (c)2017 higstreet technologies
Version=V1.0


URL="http://localhost:9200"
BASENAME=sdnevents
BASESEP="_"
BASEVER="v"


# ----------------------------
# Functions

createIndex() {
   echo Create index $1
   curl -H "Content-Type: application/json" --data @sdneventsMapping.json $URL/$1
   echo
}

createAlias() {
   echo Create alias for index
   curl -H "Content-Type: application/json" --data @sdneventsV1Alias.json $URL/_aliases
   echo
}

moveAlias() {
   echo Move alias $1 from index $2 to $2
   jq -n --arg p1 $1 --arg p2 $2 --arg p3 $3 '{ action: [ {remove: {alias: $p1 ,index: $p2 } }, {add: {alias: $p1 ,index: $p3 }} ]  }' > sdneventsSwapAlias.json
   curl -H "Content-Type: application/json" --data @sdneventsSwapAlias.json $URL/_aliases
   rm sdneventsSwapAlias.json
   echo
}

moveData(){
    echo "Move data from $1 to $2"
    elasticdump --input=$URL/$1 --output=$URL/$2 --type=data --limit=1000000
}

checkElasticdump() {
    elasticdump --version >/dev/null 2>&1 || { echo ; echo "Error: I require elasticdump but it's not installed. Use: 'sudo npm install elasticdump -g' Aborting."; exit 1; }
}

isUrl() {
   regex='(https?|ftp|file)://[-A-Za-z0-9\+&@#/%?=~_|!:,.;]*[-A-Za-z0-9\+&@#/%=~_|]'
   if [[ $1 =~ $regex ]]
   then 
      #echo "Link is valid"
      return 0
   else
      #echo "Link not valid"
      return 1
   fi
}


# ----------------------------
# Main

echo "------------------------------------"
echo "sdnevents management script $Version"
echo "(c)2017 highstreet technologies GmbH"
echo

if [ -n "$1" ] ; then
   URLP="http://"$1":9200"
   isUrl "$URLP"
   if [ $? -ne 0 ] ; then
      echo "Invalid URL parameter: $1 -> $URLP"
   else
      URL="$URLP"
   fi
fi


echo "Check database on node: $URL"

#Query database
#OK: Actual index 
#Not running: Empty
#Not initalized: error - json feeback
INDEX=$(curl -s $URL/$BASENAME  | jq --raw-output 'keys |.[0]' )
arrIN=(${INDEX//$BASESEP/ })

BASE=${arrIN[0]}
VERSION=${arrIN[1]//$BASEVER/ }

case "$BASE" in
   error)
      echo "Version initialization"
      createIndex $BASENAME$BASESEP$BASEVER"1"
      createAlias
      ;;
   $BASENAME)
      INDEXNEW=$BASENAME$BASESEP$BASEVER$((VERSION+1))
      echo Version migration: $INDEX to $INDEXNEW

      checkElasticdump

      read -p "Confirm execution of database migration by typing yes: " answer
      if [ "$answer" = "yes" ] ; then
         echo "Start..."
         createIndex $INDEXNEW
         moveAlias $BASENAME $INDEX $INDEXNEW
         moveData $INDEX $INDEXNEW
      else
         echo "No action"
      fi
      ;;
   *)
      echo "Error not the right database. Index:$INDEX Feedback:$BASE"
      ;;
esac

