// Aktiverar när webbläsaren laddad innehåll i DOM
document.addEventListener("DOMContentLoaded", function () {
    // Skapar variabler med länk till RESTtjänst samt element för att skriva ut böcker
    var url = "http://studenter.miun.se/~joli0939/dt173G/projekt/rest.php/books";
    ;
    // Class for POST,PUT och DELETE
    var RESTservices = /** @class */ (function () {
        // Konstruktor som använder inkommen url till RESTtjänst 
        function RESTservices(incomming) {
            this.url = incomming;
        }
        // Använder RESTtjänst (POST) för att lägga till en ny post i databasen
        // Får ett objekt med alla värden
        RESTservices.prototype.insertPOST = function (inputObj) {
            var xml = new XMLHttpRequest();
            var json = { "title": inputObj.title, "author": inputObj.author, "genre": inputObj.genre, "isbn": inputObj.isbn, "pages": inputObj.pages, "user": inputObj.user };
            xml.open("POST", this.url, true);
            xml.setRequestHeader('Content-Type', 'application/json');
            xml.send(JSON.stringify(json));
            // Laddar om sidan när anrop är färdigt
            xml.onload = function () {
                location.reload();
            };
            // Tar bort text från fält för att fylla i böcker
            document.getElementById("title").value = "";
            document.getElementById("author").value = "";
            document.getElementById("genre").value = "";
            document.getElementById("isbn").value = "";
            document.getElementById("pages").value = "";
        };
        ;
        // Använder RESTtjänst (PUT) för att ändra en existerande post i databasen
        RESTservices.prototype.insertPUT = function (inputObj) {
            var xml = new XMLHttpRequest();
            var json = { "title": inputObj.title, "author": inputObj.author, "genre": inputObj.genre, "isbn": inputObj.isbn, "pages": inputObj.pages };
            xml.open("PUT", this.url + "/" + inputObj.id, true);
            xml.setRequestHeader('Content-Type', 'application/json');
            xml.send(JSON.stringify(json));
            // Laddar om sidan när anrop är färdigt
            xml.onload = function () {
                location.reload();
            };
        };
        ;
        // Använder RESTtjänst (DELETE) för att ta bort en vald post i databasen
        // Får den valda postens id som värde
        RESTservices.prototype.deletePost = function (elementid) {
            var xml = new XMLHttpRequest();
            xml.open("DELETE", url + "/" + elementid, true);
            xml.send();
            xml.onload = function () {
                location.reload();
            };
        };
        ;
        return RESTservices;
    }());
    // Skapar en instans av klassen RESTservices
    var RESTclass = new RESTservices(url);
    // Eventlistener som förbereder för att lägga till ny bok
    document.getElementById("addbutton").addEventListener("click", function () {
        // Läser in värdet från fält
        var titleEl = document.getElementById("title").value;
        var authorEl = document.getElementById("author").value;
        var genreEl = document.getElementById("genre").value;
        var isbnEl = document.getElementById("isbn").value;
        var pagesEl = document.getElementById("pages").value;
        // Kontrollerar att alla fält är ifyllda, skriver annars ut ett felmeddelande
        if (titleEl == "" || authorEl == "" || genreEl == "" || isbnEl == "" || pagesEl == "") {
            document.getElementById("addnewErrormsg").innerHTML = "Ett eller flera av fälten är inte ifyllda";
        }
        else {
            // Kontrollerar att antalet sidor är angett som ett nummer, skriver annars ut ett felmeddelande
            if (!isNaN(parseInt(document.getElementById("pages").value))) {
                var myObj = {
                    title: titleEl,
                    author: authorEl,
                    genre: genreEl,
                    isbn: isbnEl,
                    pages: parseInt(pagesEl),
                    user: document.getElementById('booksusername').innerHTML
                };
                // Använder metod insertPOST i objektet RESTclass för att lägga till post
                RESTclass.insertPOST(myObj);
            }
            else {
                document.getElementById("addnewErrormsg").innerHTML = "'Antal sidor' måste vara en siffra";
            }
            ;
        }
        ;
    });
    // Eventlistener som förbereder anrop för att ändra en post
    function RESTPUT() {
        // Skickar this.id (valda elementets ID) till returnID som returnerar endast en siffra som används som id i databasen
        var bookID = returnID(this.id);
        // Läser in värden från fällt
        var titleEl = document.getElementById("edittitle" + bookID).value;
        var authorEl = document.getElementById("editauthor" + bookID).value;
        var genreEl = document.getElementById("editgenre" + bookID).value;
        var isbnEl = document.getElementById("editisbn" + bookID).value;
        var pagesEl = document.getElementById("editpages" + bookID).value;
        // Kontrollerar om alla fällt är ifyllda, skriver annars ut ett felmeddelande
        if (titleEl == "" || authorEl == "" || genreEl == "" || isbnEl == "" || pagesEl == "") {
            document.getElementById("editErrormsg" + bookID).innerHTML = "Ett eller flera av fälten är inte ifyllda";
        }
        else {
            // Kontrollerar om antal sidor är angett som en siffra, skriver annars ut ett felmeddelande
            if (!isNaN(parseInt(document.getElementById("editpages" + bookID).value))) {
                var myObj = {
                    id: bookID,
                    title: titleEl,
                    author: authorEl,
                    genre: genreEl,
                    isbn: isbnEl,
                    pages: parseInt(pagesEl) // Omvandlar antal sidor från string till number för att stämma överens med interface och databas
                };
                // Använder metod insertPUT i objektet RESTclass
                RESTclass.insertPUT(myObj);
            }
            else {
                document.getElementById("editErrormsg" + bookID).innerHTML = "'Antal sidor' måste vara en siffra";
            }
            ;
        }
        ;
    }
    ;
    // Funktion som förbereder anrop för att ta bort en post
    function RESTDELETE() {
        // Skickar this.id (valda elementets ID) till returnID som returnerar endast en siffra som används som id i databasen
        var thisID = returnID(this.id);
        // Använder metoden deletePost i objektet RESTclass
        RESTclass.deletePost(thisID);
    }
    ;
    // Funktion som aktiveras när använder trycker på knapp för att ändra ett inlägg
    function SHOWCHANGE() {
        // Skickar this.id (valda elementets ID) till returnID som returnerar endast en siffra som används som id i databasen
        var thisID = returnID(this.id);
        // Skapar variabel med vald knapp
        var button = document.getElementById("edit" + thisID);
        // Ändrar class för div (som är displat: none;) som är kopplad till valt objekt, detta ändrar till display: block; och gör det synligt
        document.getElementById("divedit" + thisID).classList.toggle("showEdit");
        // Ändrar text på knapp för att representera vad den gör
        if (button.value == "Ändra")
            button.value = "Dölj";
        else
            button.value = "Ändra";
    }
    ;
    // Tar emot en sträng som är ID för ett valt element och returnerar endast det nummer som används, vilket är samma som ID i databasen
    function returnID(input) {
        // RegExp som endast sparar siffror
        var theid = input.match(/\d+/g);
        return theid[0];
    }
    ;
    // Läser via RESTtjänst ut alla böcker kopplade till användaren när sidan laddas
    var xml = new XMLHttpRequest();
    xml.onreadystatechange = function () {
        if (xml.readyState == XMLHttpRequest.DONE) {
            if (xml.status == 200) {
                console.log("Status 200");
                // Gör parse och skapar variabel med text från JSON från RESTtjänst
                var jsonData = JSON.parse(xml.responseText);
                // Använder utskriften av användare på toppen av sidan för att skapa variabel med användare (OBS risk för modifiering och utläsning av fel poster)
                var username = document.getElementById("booksusername").innerHTML;
                // Element som lista med böcker ligger i
                var bookliste = document.getElementById("booklist");
                var count = 0;
                // Kontrollerar om den inloggade användaren har några poster i JSON-filen
                for (var q = 0; q < jsonData.length; q++) {
                    if (jsonData[q].user == username)
                        count = count + 1;
                }
                // Om användaren har poster skrivs dessa ut
                if (!(count == 0)) {
                    // Går igenom alla poster i JSON-fil
                    for (var i = 0; i < jsonData.length; i++) {
                        // Om en post är skriven av den inloggade användaren skrivs den ut i ett element på sidan
                        // Skapar först ett element där information om bok skrivs ut, därefter en div med fält för att ändra boken, detta fält döljs
                        // Element och knappar får ett ID som innehåller postens ID från databasen
                        if (jsonData[i].user == username) {
                            // Skapar DIV för information om bok
                            var showbooks = document.createElement("div");
                            showbooks.setAttribute("class", "showbooks");
                            // Skapar element med titel
                            var titleEl = document.createElement("p");
                            var txtTitleEl = document.createTextNode("Titel: " + jsonData[i].title);
                            titleEl.appendChild(txtTitleEl);
                            showbooks.appendChild(titleEl);
                            // Skapar element med författare
                            var authorEl = document.createElement("p");
                            var txtAuthorEl = document.createTextNode("Författare: " + jsonData[i].author);
                            authorEl.appendChild(txtAuthorEl);
                            showbooks.appendChild(authorEl);
                            // Skapar element med genre
                            var genreEl = document.createElement("p");
                            var txtGenreEl = document.createTextNode("Genre: " + jsonData[i].genre);
                            genreEl.appendChild(txtGenreEl);
                            showbooks.appendChild(genreEl);
                            // Skapar element med ISBN
                            var isbnEl = document.createElement("p");
                            var txtIsbnEl = document.createTextNode("ISBN: " + jsonData[i].isbn);
                            isbnEl.appendChild(txtIsbnEl);
                            showbooks.appendChild(isbnEl);
                            // Skapar element med antal sidor
                            var pagesEl = document.createElement("p");
                            var txtPagesEl = document.createTextNode("Antal sidor: " + jsonData[i].pages);
                            pagesEl.appendChild(txtPagesEl);
                            showbooks.appendChild(pagesEl);
                            // Skapar knapp för att ändra
                            var openChange = document.createElement("input");
                            openChange.setAttribute("type", "button");
                            openChange.setAttribute("value", "Ändra");
                            openChange.setAttribute("id", "edit" + jsonData[i].ID);
                            openChange.setAttribute("class", "openChange button");
                            showbooks.appendChild(openChange);
                            // Skapar knapp för att ta bort
                            var deletebutton = document.createElement("input");
                            deletebutton.setAttribute("type", "button");
                            deletebutton.setAttribute("value", "Ta bort");
                            deletebutton.setAttribute("id", "delete" + jsonData[i].ID);
                            deletebutton.setAttribute("class", "deletebutton button");
                            showbooks.appendChild(deletebutton);
                            // Skapar div som innehåller fält för att ändra post
                            var hidden = document.createElement("div");
                            hidden.setAttribute("class", "hidden");
                            hidden.setAttribute("id", "divedit" + jsonData[i].ID);
                            // Skapar fält för att ändra titel
                            var edittitleEl = document.createElement("input");
                            edittitleEl.setAttribute("type", "text");
                            edittitleEl.setAttribute("id", "edittitle" + jsonData[i].ID);
                            edittitleEl.setAttribute("class", "editinput");
                            edittitleEl.setAttribute("value", jsonData[i].title);
                            hidden.appendChild(edittitleEl);
                            // Skapar fält för att ändra titel
                            var editauthorEl = document.createElement("input");
                            editauthorEl.setAttribute("type", "text");
                            editauthorEl.setAttribute("id", "editauthor" + jsonData[i].ID);
                            editauthorEl.setAttribute("class", "editinput");
                            editauthorEl.setAttribute("value", jsonData[i].author);
                            hidden.appendChild(editauthorEl);
                            // Skapar fält för att ändra titel
                            var editgenreEl = document.createElement("input");
                            editgenreEl.setAttribute("type", "text");
                            editgenreEl.setAttribute("id", "editgenre" + jsonData[i].ID);
                            editgenreEl.setAttribute("class", "editinput");
                            editgenreEl.setAttribute("value", jsonData[i].genre);
                            hidden.appendChild(editgenreEl);
                            // Skapar fält för att ändra titel
                            var editisbnEl = document.createElement("input");
                            editisbnEl.setAttribute("type", "text");
                            editisbnEl.setAttribute("id", "editisbn" + jsonData[i].ID);
                            editisbnEl.setAttribute("class", "editinput");
                            editisbnEl.setAttribute("value", jsonData[i].isbn);
                            hidden.appendChild(editisbnEl);
                            // Skapar fält för att ändra titel
                            var editpagesEl = document.createElement("input");
                            editpagesEl.setAttribute("type", "text");
                            editpagesEl.setAttribute("id", "editpages" + jsonData[i].ID);
                            editpagesEl.setAttribute("class", "editinput");
                            editpagesEl.setAttribute("value", jsonData[i].pages);
                            hidden.appendChild(editpagesEl);
                            // P-element för att skriva ut felmeddelande
                            var editErrormsg = document.createElement("p");
                            editErrormsg.setAttribute("id", "editErrormsg" + jsonData[i].ID);
                            hidden.appendChild(editErrormsg);
                            // Knapp för att bekfräfta ändring
                            var confirmeditbtn = document.createElement("input");
                            confirmeditbtn.setAttribute("type", "button");
                            confirmeditbtn.setAttribute("id", "confirmedit" + jsonData[i].ID);
                            confirmeditbtn.setAttribute("class", "confirmeditbtn button");
                            confirmeditbtn.setAttribute("value", "Bekräfta");
                            hidden.appendChild(confirmeditbtn);
                            // Lägger till dold div för ändringar till div som visar bok
                            showbooks.appendChild(hidden);
                            // Lägger till div med bok till div i HTML-fil
                            bookliste.appendChild(showbooks);
                        }
                        ;
                    }
                    ;
                    // Skapar lista med alla knappar för att ta bort poster
                    var deletebuttons = document.getElementsByClassName("deletebutton");
                    // Lägger till eventlisteners som anropar funktion RESTDELETE för alla 'Ta bort' knappar,
                    for (var c = 0; c < deletebuttons.length; c++) {
                        deletebuttons[c].addEventListener("click", RESTDELETE);
                    }
                    ;
                    // Skapar lista med alla knappar som visar fältet för att ändra poster
                    var openchangebuttons = document.getElementsByClassName("openChange");
                    // Lägger till eventlistener som anropar SHOWCHANGE för alla knappar som visar ändringar
                    for (var t = 0; t < openchangebuttons.length; t++) {
                        openchangebuttons[t].addEventListener("click", SHOWCHANGE);
                    }
                    ;
                    // Skapar lista med alla knappar för att bekräfa ändringar
                    var changebuttons = document.getElementsByClassName("confirmeditbtn");
                    // Lägger till eventlistener som anropar funktion RESTPUT för alla knappar som bekräftar ändring
                    for (var k = 0; k < changebuttons.length; k++) {
                        changebuttons[k].addEventListener("click", RESTPUT);
                    }
                    ;
                }
                else {
                    // Om användaren inte har några tillagda böcker visas en text
                    bookliste.innerHTML = "<p class='noBooks'>Du har inte lagt till några böcker än, fyll i fälten i toppen på sidan för att börja lägga till dina böcker</p>";
                }
                ;
            }
            else if (xml.status == 400) {
                alert("ERROR: 400");
            }
            else {
                alert("ERROR: Annat svar än 200 returnerades");
            }
            ;
        }
        ;
    };
    xml.open("GET", url, true);
    xml.send();
});
