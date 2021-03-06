<?php
    // Startar session och kontrollerar om en sessionsvariabel finns för en användare, om inte skickas man till login-skärm
    session_start();

    if(!isset($_SESSION['username'])) {
        header("Location: index.php");
    }
?>
<?php 
    include("includes/config.php");
    $pagetitle = "Mina böcker";
    include("includes/head.php");  
?>
<?php 
    echo("<a id='logout' href='logout.php'>Logga ut</a>");
    echo("<p>Inloggad som:</p><p id='booksusername'>" . $_SESSION['username'] . "</p>");   
?>


<div id="addnew">
    <h2>Lägg till ny bok</h2>
    <input type="text" id="title" class="addbookinput" placeholder="Titel" />
    <input type="text" id="author" class="addbookinput" placeholder="Författare" />
    <input type="text" id="genre" class="addbookinput" placeholder="Genre" />
    <input type="text" id="isbn" class="addbookinput" placeholder="ISBN" />
    <input type="text" id="pages" class="addbookinput" placeholder="Antal sidor" />
    <p id="addnewErrormsg"></p>
    <input type="button" id="addbutton" class="button" value="Lägg till" />  
</div>


<h2 class="myBooks">Mina böcker</h2>
<div id="booklist"></div>

<?php include("includes/footer.php");?>