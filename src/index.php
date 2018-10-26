<?php
/*********************************************
 * 
 * Skapat av Joel Lindberg (joli0939)
 * 
 ********************************************/
?>
<?php
// Inkluderar config-fil
include("includes/config.php");

// Startar session
session_start();

// Skapar variable för meddelande samt objekt av klassen Login
$loginMessage = "";
$database = new Login();

// När användaren klickat på login-knappen kontrolleras de ifyllda uppgifterna mot databasen
if (isset($_POST['username'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Kontrollerar så att både användarnamn och lösenord är ifyllt
    if ($username != "" && $password != "") {

        // Count skickar inloggningsuppgifter till objektet database och får ett värde tillbaka
        $count = $database->checkLogin($username, $password);

        // Finns det data i det retunerade värdet loggas användaren in
        if ($count > 0) {
            $_SESSION['username'] = $username;
            header("Location: books.php");
        } else {
            $loginMessage = "Fel användarnamn och/eller lösenord";
        }
               
    } else {
        $loginMessage = "Du har glömt att fylla i användarnamn och/eller lösenord";
    }
}

?>
<?php 
// Anger undersidans namn och inkluderar sidhuvud
$pagetitle = "Logga in";
include("includes/head.php");
?>

<div class="loginContainer">

    <!-- Formulär där användern fyller i användarnamn och lösenord -->
    <form method="post" action="index.php" id="login">

        <label for="username">Användarnamn:</label>
        <input type="text" name="username" id="username" class="loginField" autofocus />

        <label for="password">Lösenord:</label>
        <input type="password" name="password" id="password" class="loginField" />

        <?php  
            // Skriver ut felmeddelanden
            echo "<p class=\"loginMessage\">" . $loginMessage . "</p>";
        ?>

        <input type="submit" name="login" value="Logga in" id="loginButton" class="button" />
        
    </form>

    <!-- Länk för att skapa ny användare -->
    <a href="createuser.php" id="createUserLink">Skapa ny användare</a>

</div>

<?php
// Inkluderar footer
include("includes/footer.php");
?>