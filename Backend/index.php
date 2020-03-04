<?php
//login info
$servername = "localhost";
$username = "root";
$password = "";
$db = "alumnidb";

// Create connection
$dblink = mysqli_connect($servername, $username, $password,$db);

// Check connection
if (!$dblink) {
   die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully";

$sql  = "SELECT * FROM alumni";
$result = mysqli_query($dblink, $sql);
$json_array = array();
while($row = mysqli_fetch_assoc($result)) {
    $json_array[] = $row;
}
echo '<pre>';
print json_encode($json_array);
echo '</pre>';
?>