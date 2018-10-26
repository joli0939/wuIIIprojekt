<?php
    // Möjliggör felrapportering
    error_reporting(-1);              // Rapportera alla typer av fel
    ini_set("display_errors", 1);     // Visa alla fel

    // Laddar automatiskt klasser i mappen classes
    spl_autoload_register(function ($class) {
        include 'classes/' . $class . '.class.php';
    });

    // Information för anslutning till databas
    define("DBHOST", "localhost");
    define("DBUSER", "RESTuser");
    define("DBPASS", "testrest");
    define("DBNAME", "REST");
