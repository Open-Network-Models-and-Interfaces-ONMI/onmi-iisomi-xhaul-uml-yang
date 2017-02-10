folder=.
out=out.xml;
header="<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
echo $header

rm $out;
echo "<modules>" >> $out;
find $folder -type f -name \*.yin -exec cat {} \; -exec echo "" \; >> $out;
echo "</modules>" >> $out;

sed -e s/"$header"//g -i $out;sed -i -e '1i<?xml version="1.0" encoding="UTF-8"?>\' $out
sed -i -e '1i<?xml version="1.0" encoding="UTF-8"?>\' $out
sed -i -e '1ixmlns="urn:ietf:params:xml:ns:yang:yin:1"' $out 
