<?php   


require_once('color.php');
$colors = new Colors();

$odlIP=$argv[1];
$odlPort=$argv[2];
$odlUsername=$argv[3];
$odlPassword=$argv[4];
$neName=$argv[5];

$url="http://$odlIP:$odlPort/restconf/config/network-topology:network-topology/topology/topology-netconf/node/controller-config/yang-ext:mount/config:modules/module/odl-sal-netconf-connector-cfg:sal-netconf-connector/$neName";


  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_PROXY, '');
  // For xml, change the content-type.
  curl_setopt($ch, CURLOPT_HEADER, 1);
  curl_setopt($ch, CURLOPT_HTTPHEADER, Array("Expect:","Content-Type: application/xml","cache-control: no-cache"));
  curl_setopt($ch, CURLOPT_USERPWD, "$odlUsername:$odlPassword");
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
 
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // ask for results to be returned

 // Send to remote and return data to caller.
  $result = curl_exec($ch);
  $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
 // curl_close($ch);
  if($httpcode == 200 || $httpcode == 204)
  {
//      echo "\n";  
//      echo $colors->getColoredString("$neName logout successfully completed!", null, "cyan"); 
//      echo "\n\n";  
      exit ("$neName: Logout successful\n");
  }
  else
  {
//      echo "\n";  
//      print $colors->getColoredString("$neName # LOOUT ERRROR # ","red", "black");
//      print_r("\n\n$result\n\n");
      exit ("$neName: Logout error\n");
  }

?>
