<?php
/*********************************************
 * 
 * Skapat av Joel Lindberg (joli0939)
 * 
 ********************************************/
?>
<?php
// Klassfil för att hantera gästboksinlägg mot databas

class Login {
    // Medlemsvariabler
    private $db;
    private $username;
    private $password;
    private $firstName;
    private $lastName;

    // Konstruktor
    function __construct(){

        // Ansluter till databasen
        $this->db = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
        if($this->db->connect_errno > 0) {
            die("Fel vid anslutning: " . $this->db->connect_error);
        }
    }

    

    // Skapar ny användare
    public function createUser($username, $password, $firstName, $lastName) {
       
        // Kontrollerar användarnamn och lösenord mot setmetoder
        if (!$this->setUsername($username)) {return false;}
        if (!$this->setPassword($password)) {return false;}
        if (!$this->setFirstName($firstName)) {return false;}
        if (!$this->setLastname($lastName)) {return false;}

        // Skapar fråga som lägger till den nya användaren i databasen
        $sql = "INSERT INTO users (username, password, firstname, lastname) VALUES ('" . $this->username . "', '" . $this->password . "', '" . $this->firstName . "', '" . $this->lastName . "');";
        return $this->db->query($sql);
    }



    // Kontrollerar om en användare existerar
    public function checkIfUserExists($username) {

        // Skickar fråga till databasen med ifyllt användarnamn för att se om det existerar, retunerar true eller false
        $sql = "SELECT * FROM users WHERE username='$username';";
        $result = $this->db->query($sql);

        if (mysqli_num_rows($result)>0) {
            return false;
        } else {
            return true;
        }
    }



    // Hämta användarnamn och lösenord
    public function checkLogin($username, $password) {

        // Skickar fråga till databasen med ifyllt användarnamn och lösenord, frågan för lösenord är BINARY för att skilja på stora och små bokstäver, resultatet retuneras
        $sql = "SELECT id FROM users WHERE username='$username' and password = BINARY '$password'";
        $result = $this->db->query($sql);

        return mysqli_num_rows($result);
    }







    // Set- och getmetoder
    public function setUsername($username) {
        
        // Kontrollerar så att användarnamnet inte är en tom sträng samt korrigerar tecken för att kunna lagras i databasen utan problem, retunerar true eller false
        if($username != "") {
            $this->username = $this->db->real_escape_string($username);
            return true;
        } else {
            return false;
        }
    }

    public function setPassword($password) {

        $password = strval($password);
        // Kontrollerar att lösenordet är minst 6 tecken långt
        if (strlen($password)>5) {
            $this->password = $this->db->real_escape_string($password);
            return true;
        } else {
            return false;
        }
    }

    public function setFirstName($firstName) {
        
        // Kontrollerar så att användarnamnet inte är en tom sträng samt korrigerar tecken för att kunna lagras i databasen utan problem, retunerar true eller false
        if($firstName != "") {
            $this->firstName = $this->db->real_escape_string($firstName);
            return true;
        } else {
            return false;
        }
    }

    public function setLastName($lastName) {
        
        // Kontrollerar så att användarnamnet inte är en tom sträng samt korrigerar tecken för att kunna lagras i databasen utan problem, retunerar true eller false
        if($lastName != "") {
            $this->lastName = $this->db->real_escape_string($lastName);
            return true;
        } else {
            return false;
        }
    }

}
?>