<?php
/*********************************************
 * 
 * Skapat av Joel Lindberg (joli0939)
 * 
 ********************************************/
?>
<?php 
    include("includes/config.php");
    $pagetitle = "Skapa användare";
    include("includes/head.php");
?>
<?php 
    // Anger undersidans namn, inkluderar sidhuvud och skapar ett objekt av klassen Database
    $createUserErrorMsg = "";
    $database = new Login();
?>

<?php

    // Kollar om knappen för att skapa användare trycks på eller om användaren trycker 'enter' i sista textfältet
    if (isset($_POST['createUser']) or isset($_POST['repeatPassword'])) {

        // Skapar variabler av det användaren fyllt i
        $firstName = $_POST['firstName'];
        $lastName = $_POST['lastName'];
        $username = $_POST['username'];
        $password = $_POST['password'];
        $repeatPassword = $_POST['repeatPassword'];

        // Kontrollerar så att samma lösenord fyllts i för båda lösenordsfält
        if ($repeatPassword === $password) {

            // Kollar mot metod i objektet database om användarnamnet redan används
            if ($database->checkIfUserExists($username)) {
            
                // Skickar de värden användaren angett till metod i objektet database för att de ska lagras i databasen
                if ($database->createUser($username, $password, $firstName, $lastName)) {
                    $createUserErrorMsg = "Användare skapad. <br />Klicka <a href=\"index.php\">här</a> för att logga in.";
                } else {
                    $createUserErrorMsg = "Fel vid skapande av användare";
                }
            
            } else {
                $createUserErrorMsg = "Det finns redan en användare med det användarnamnet";
            }
        } else {
            $createUserErrorMsg = "De angivna lösenorden är inte samma";
        }
    }

?>

<div id="createUserContainer">

    <h2>Skapa ny användare</h2>

    <!-- Formulär för att fylla i önskat användarnamn, lösenord, förnamn och efternamn -->
    <form method="post" action="createuser.php" id="createuser">

        <label for="firstName" class="createUserLabel">Förnamn:</label>
        <input type="text" name="firstName" id="firstName" class="createUserTxt" autofocus />

        <label for="lastName" class="createUserLabel">Efternamn:</label>
        <input type="text" name="lastName" id="lastName" class="createUserTxt" />

        <label for="username" class="createUserLabel">Användarnamn:</label>
        <input type="text" name="username" id="username" class="createUserTxt" />

        <label for="password" class="createUserLabel">Lösenord:</label>
        <input type="password" name="password" id="password" class="createUserTxt" />

        <label for="repeatPassword" class="createUserLabel">Upprepa lösenord:</label>
        <input type="password" name="repeatPassword" id="repeatPassword" class="createUserTxt" />

        <?php    
            echo "<p class=\"loginMessage\">" . $createUserErrorMsg . "</p>";
        ?>

        <input type="submit" name="createUser" value="Skapa användare" class="button" />
        
    </form>

    <a href="index.php">Tillbaka</a>

</div>

<?php
include("includes/footer.php");
?>