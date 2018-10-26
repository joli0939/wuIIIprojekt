
</div><!-- Content -->

<footer>
    <p>Min boksamling</p>
</footer>

<?php
    // Läser endast in JavaScript om användaren är på sidan 'Mina böcker'
    if ($pagetitle == "Mina böcker") {
        echo("<script src='js/main.min.js'></script>");
    }
?>

</body>
</html>