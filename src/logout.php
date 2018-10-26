<?php
/*********************************************
 * 
 * Skapat av Joel Lindberg (joli0939)
 * 
 ********************************************/
?>
<?php
// Startar session, tar bort sessionsvariabel och skickar användaren till index.php
session_start();
unset($_SESSION['username']);
header("Location: index.php");