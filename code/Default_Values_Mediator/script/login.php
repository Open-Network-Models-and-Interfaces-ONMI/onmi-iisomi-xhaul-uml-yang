<?php   

require_once('color.php');
$colors = new Colors();

$file=$argv[1];
$odlIP=$argv[2];
$odlPort=$argv[3];
$odlUsername=$argv[4];
$odlPassword=$argv[5];
$mdevIp=$argv[6];
$neName=$argv[7];

$url="http://$odlIP:$odlPort/restconf/config/network-topology:network-topology/topology/topology-netconf/node/controller-config/yang-ext:mount/config:modules";

  if(file_exists("$file"))
  {
    $postXML = file_get_contents("$file");
  }
  else
  {
//    echo "\n";
//   print $colors->getColoredString("$file # FILE ERRROR #","red", "black");
//   print $colors->getColoredString("$file: File not found", null, null );
//   echo "\n\n";  
    exit ("$file: File not found\n");
  }

  $ch = curl_init();

  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_PROXY, '');
  // For xml, change the content-type.
  curl_setopt($ch, CURLOPT_HTTPHEADER, Array("Expect:","Content-Type: application/xml","cache-control: no-cache"));
  curl_setopt($ch, CURLOPT_USERPWD, "$odlUsername:$odlPassword");
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $postXML);

  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // ask for results to be returned

  // Send to remote and return data to caller.
  $result = curl_exec($ch);
  $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if($httpcode == 200 || $httpcode == 204)
  {
//    echo "\n";  
//    echo $colors->getColoredString("SIAE-71 has been successfully registrered and logged!", null, "cyan"); 
//    echo $colors->getColoredString("$neName: successfully registrered and logged!", null, null); 
//    echo "\n\n";  
    exit ("$neName: Login successful\n");
  }
  else
  {
//    echo "\n";  
//    print $colors->getColoredString("SIAE-71 # LOGIN ERRROR # ","red", "black");
//    print $colors->getColoredString("$neName: Login Error",null, null);
//    print_r("\n\n$result\n\n");
//    echo ("http error code: $httpcode");
    exit ("$neName: Login error\n");
  }

?>
