<?php
//
// Apache HTTP Server, Web Service Test Example
// Written by Joel Lindbeg / Mid Sweden University in October 2018
//
// curl request:
// curl -i -X GET http://localhost/rest.php/books
// curl -i -X GET http://localhost/rest.php/books/1
// curl -i -X POST -d '{"title":"Ringens brödraskap","author":"J.R.R Tolkien", "genre":"Fantasy","isbn":"9789113044910","pages":511}' http://localhost/rest.php/books
// curl -i -X PUT -d '{"title":"Ringens brödraskap","author":"J.R.R Tolkien", "genre":"Fantasy","isbn":"9789113044910","pages":511}' http://localhost/rest.php/books/0
// curl -i -X DELETE http://localhost/rest.php/books/1
//
// POST            Creates a new resource.
// GET             Retrieves a resource.
// PUT             Updates an existing resource.
// DELETE          Deletes a resource.
//
// Database name: REST, Username: RESTuser, Password: testrest, Table: books 
// ----------------------------------------------------------------------------------------------------------------------------------------
// | ID (int, AI, PRIMARY KEY) | title (varchar(64)) | author (varchar(64)) | genre (varchar(64)) | isbn (varchar(64)) | pages (int(11)) |
// ----------------------------------------------------------------------------------------------------------------------------------------


// Include config
include("includes/config.php");
//
// Get HTTP method, path and input of the request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);

if($request[0] != "books"){ 
	http_response_code(404);
	exit();
}

//
// Send return header information
header("Content-Type: application/json; charset=UTF-8");

$conn = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME) or die("Error connecting to database.");;
$db_connected = mysqli_select_db($conn, DBNAME); // Work with the database named 'testrest' 

//
// HTTP method implementations of GET, POST, PUT and DELETE
switch ($method){
	case "GET":
		$sql = "SELECT ID, title, author, genre, isbn, pages, user FROM books";
		if(isset($request[1])) $sql = $sql . " WHERE ID = " . $request[1] . ";";
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

//
// Always response with json array of cars except for GET /cars/id
	$result = mysqli_query($conn,$sql) or die(mysqli_error($conn));

	$harr = [];
	if($method != "GET") $sql = "SELECT ID, title, author, genre, isbn, pages FROM books";
	$result = mysqli_query($conn,$sql) or die(mysqli_error($conn));
    while($row = mysqli_fetch_assoc($result)){
			$row_arr['ID'] = $row['ID'];
			$row_arr['title'] = $row['title'];
			$row_arr['author'] = $row['author'];
			$row_arr['genre'] = $row['genre'];
			$row_arr['isbn'] = $row['isbn'];
			$row_arr['pages'] = $row['pages'];
			$row_arr['user'] = $row['user'];
			array_push($harr,$row_arr);
	}
	mysqli_close($conn);
	
	echo json_encode($harr);