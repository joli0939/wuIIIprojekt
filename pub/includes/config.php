<?php
    // Möjliggör felrapportering
    error_reporting(-1);              // Rapportera alla typer av fel
    ini_set("display_errors", 1);     // Visa alla fel

    // Laddar automatiskt klasser i mappen classes
    spl_autoload_register(function ($class) {
        include 'classes/' . $class . '.class.php';
    });

    // Information för anslutning till databas
    define("DBHOST", "studentmysql.miun.se");
    define("DBUSER", "joli0939");
    define("DBPASS", "EM2DjlRQwIByzU5L");
    define("DBNAME", "joli0939");
