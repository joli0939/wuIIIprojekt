<?php
//
// Apache HTTP Server, Lista med böcker
// Skriven av Joel Lindbeg / Mittuniversitetet oktober 2018
//
// curl request:
// curl -i -X GET http://localhost/rest.php/books
// curl -i -X GET http://localhost/rest.php/books/1
// curl -i -X POST -d '{"title":"Ringens brödraskap","author":"J.R.R Tolkien", "genre":"Fantasy","isbn":"9789113044910","pages":511,"user":"admin"}' http://localhost/rest.php/books
// curl -i -X PUT -d '{"title":"Ringens brödraskap","author":"J.R.R Tolkien", "genre":"Fantasy","isbn":"9789113044910","pages":511,"user":"admin"}' http://localhost/rest.php/books/0
// curl -i -X DELETE http://localhost/rest.php/books/1
//
// POST            Skapar ny post
// GET             Hämtar en eller flera poster
// PUT             Uppdaterar en existerande post
// DELETE          Tar bort en post
//
// Database name: REST, Username: RESTuser, Password: testrest, Table: books
// ----------------------------------------------------------------------------------------------------------------------------------------------------------
// | ID (int, AI, PRIMARY KEY) | title (varchar(64)) | author (varchar(64)) | genre (varchar(64)) | isbn (varchar(64)) | pages (int(11)) | user (varchar(64))
// ----------------------------------------------------------------------------------------------------------------------------------------------------------


// Inkludera config.php
include("includes/config.php");

// Ger HTTP method, sökväg och input för anrop
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);

// Om anrop inte inhåller /books ges 404
if($request[0] != "books"){ 
	http_response_code(404);
	exit();
}

// Skickar header information
header("Content-Type: application/json; charset=UTF-8");

// Anger vilken databas som ska användas och användaruppgifter (har angetts i konstanter i config.php)
$conn = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME) or die("Error connecting to database.");
$db_connected = mysqli_select_db($conn, DBNAME); // Arbeta med databas i variabel DBNAME 

// HTTP method-implementering av GET, POST, PUT och DELETE
switch ($method){
	case "GET":
		$sql = "SELECT ID, title, author, genre, isbn, pages, user FROM books";
		if(isset($request[1])) $sql = $sql . " WHERE ID = " . $request[1] . ";"; // Om specifikt ID har angetts i anrop ska endast den posten skickas
		break;
	case "PUT":
		$sql = "UPDATE books SET title = '" . $input['title'] . "', author = '" . $input['author'] . "', genre = '" . $input['genre'] . "', isbn = '" . $input['isbn'] . "', pages = '" . $input['pages'] . "' WHERE ID = " . $request[1] . ";";
    	break;
	case "POST":
		$sql = "INSERT INTO books (title, author, genre, isbn, pages, user) VALUES ('" . $input['title'] . "', '" . $input['author'] . "', '" . $input['genre'] . "', '" . $input['isbn'] . "', '" . $input['pages'] . "', '" . $input['user'] . "');";
		break;

	case "DELETE":
   		$sql = "DELETE FROM books WHERE ID = " . $request[1] . ";";
   		break;
}

// Om inget specifikt ID har angetts ska alltid JSON-fil skickas med GET med alla poster
$result = mysqli_query($conn,$sql) or die(mysqli_error($conn));

$harr = [];
if($method != "GET") $sql = "SELECT ID, title, author, genre, isbn, pages FROM books"; // Skapar SQL-fråga
$result = mysqli_query($conn,$sql) or die(mysqli_error($conn)); // Skickar fråga till databasen
while($row = mysqli_fetch_assoc($result)){ // Lagrar svaret i en associativ array
		$row_arr['ID'] = $row['ID'];
		$row_arr['title'] = $row['title'];
		$row_arr['author'] = $row['author'];
		$row_arr['genre'] = $row['genre'];
		$row_arr['isbn'] = $row['isbn'];
		$row_arr['pages'] = $row['pages'];
		$row_arr['user'] = $row['user'];
		array_push($harr,$row_arr);
}
mysqli_close($conn); // Stänger anslutning

echo json_encode($harr); // Returnerar JSON-fil som innehåller associativ array med svar från databasen		