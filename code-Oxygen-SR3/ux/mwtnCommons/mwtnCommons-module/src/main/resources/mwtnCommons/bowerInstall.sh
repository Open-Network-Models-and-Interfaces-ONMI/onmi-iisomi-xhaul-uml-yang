echo "---------------------------------"
echo "Install bower and adapt to ODL UX"
echo "---------------------------------"
echo "Step1: Install bower"
bower install -q

echo "Step2: Install Bower patches to adapt to ODL-DLUX"

FileToPatch="angular-chart.js"
FileToPatchDestination="bower_components/angular-chart.js/dist"
FileToPatchOrigination="bower_components_patches"

echo "- File to handle: $FileToPatch"
mv $FileToPatchDestination/$FileToPatch $FileToPatchDestination/$FileToPatch.orig
cp $FileToPatchOrigination/$FileToPatch.patch $FileToPatchDestination
mv $FileToPatchDestination/$FileToPatch.patch $FileToPatchDestination/$FileToPatch

echo "Install bower script ends"
