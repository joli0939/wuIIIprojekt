// Aktiverar när webbläsaren laddad innehåll i DOM
document.addEventListener("DOMContentLoaded", function(){ 
    
    // Skapar variabler med länk till RESTtjänst samt element för att skriva ut böcker
    let url: string = "http://studenter.miun.se/~joli0939/dt173G/projekt/rest.php/books";
    
    
    
    // Interface för värden som ska används med RESTtjänst
    interface values {
        id?: string;
        user?: string;
        title: string;
        author: string;
        genre: string;
        isbn: string;
        pages: number;
    };

    // Class for POST,PUT och DELETE
    class RESTservices{

        url:string;

        // Konstruktor som använder inkommen url till RESTtjänst 
        constructor(incomming: string) {
            this.url = incomming;
        }

        // Använder RESTtjänst (POST) för att lägga till en ny post i databasen
        // Får ett objekt med alla värden
        insertPOST(inputObj: values) {
            let xml = new XMLHttpRequest();
            let json = {"title": inputObj.title, "author": inputObj.author, "genre": inputObj.genre, "isbn": inputObj.isbn, "pages": inputObj.pages, "user": inputObj.user};
            xml.open("POST", this.url, true);
            xml.setRequestHeader('Content-Type', 'application/json');
            xml.send(JSON.stringify(json));
    
            // Laddar om sidan när anrop är färdigt
            xml.onload = function() {
                location.reload();
            };
    
            // Tar bort text från fält för att fylla i böcker
            (<HTMLInputElement>document.getElementById("title")).value = "";
            (<HTMLInputElement>document.getElementById("author")).value = "";
            (<HTMLInputElement>document.getElementById("genre")).value = "";
            (<HTMLInputElement>document.getElementById("isbn")).value = "";
            (<HTMLInputElement>document.getElementById("pages")).value = "";
        };

        // Använder RESTtjänst (PUT) för att ändra en existerande post i databasen
        insertPUT(inputObj: values) {
            let xml = new XMLHttpRequest();
            let json = {"title": inputObj.title, "author": inputObj.author, "genre": inputObj.genre, "isbn": inputObj.isbn, "pages": inputObj.pages};
            xml.open("PUT", this.url+"/"+inputObj.id, true);
            xml.setRequestHeader('Content-Type', 'application/json');
            xml.send(JSON.stringify(json));
    
            // Laddar om sidan när anrop är färdigt
            xml.onload = function() {
                location.reload();
            };
        };

        // Använder RESTtjänst (DELETE) för att ta bort en vald post i databasen
        // Får den valda postens id som värde
        deletePost(elementid:string) {
            let xml = new XMLHttpRequest();
            xml.open("DELETE", url + "/" + elementid, true);
            xml.send();
            xml.onload = function() {
                location.reload();
            };
        };
    }



    // Skapar en instans av klassen RESTservices
    let RESTclass = new RESTservices(url);
    


    // Eventlistener som förbereder för att lägga till ny bok
    document.getElementById("addbutton").addEventListener("click", function() {

        // Läser in värdet från fält
        let titleEl = (<HTMLInputElement>document.getElementById("title")).value;
        let authorEl = (<HTMLInputElement>document.getElementById("author")).value;
        let genreEl = (<HTMLInputElement>document.getElementById("genre")).value;
        let isbnEl = (<HTMLInputElement>document.getElementById("isbn")).value;
        let pagesEl = (<HTMLInputElement>document.getElementById("pages")).value;
        
        // Kontrollerar att alla fält är ifyllda, skriver annars ut ett felmeddelande
        if (titleEl == "" || authorEl == "" || genreEl == "" || isbnEl == "" || pagesEl == "") {
            (<HTMLInputElement>document.getElementById("addnewErrormsg")).innerHTML = "Ett eller flera av fälten är inte ifyllda";
        } 
        else {
            // Kontrollerar att antalet sidor är angett som ett nummer, skriver annars ut ett felmeddelande
            if (!isNaN(parseInt((<HTMLInputElement>document.getElementById("pages")).value))) {
                let myObj = {
                    title: titleEl,
                    author: authorEl,
                    genre: genreEl,
                    isbn: isbnEl,
                    pages: parseInt(pagesEl), // Omvandlar antal sidor från string till number för att stämma överens med interface och databas
                    user: (<HTMLInputElement>document.getElementById('booksusername')).innerHTML
                };
        
                // Använder metod insertPOST i objektet RESTclass för att lägga till post
                RESTclass.insertPOST(myObj);

            }
            else {
                (<HTMLInputElement>document.getElementById("addnewErrormsg")).innerHTML = "'Antal sidor' måste vara en siffra";
            };
        };

    });



    // Eventlistener som förbereder anrop för att ändra en post
    function RESTPUT(){
        // Skickar this.id (valda elementets ID) till returnID som returnerar endast en siffra som används som id i databasen
        let bookID: string = returnID(this.id);

        // Läser in värden från fällt
        let titleEl = (<HTMLInputElement>document.getElementById("edittitle"+bookID)).value;
        let authorEl = (<HTMLInputElement>document.getElementById("editauthor"+bookID)).value;
        let genreEl = (<HTMLInputElement>document.getElementById("editgenre"+bookID)).value;
        let isbnEl = (<HTMLInputElement>document.getElementById("editisbn"+bookID)).value;
        let pagesEl = (<HTMLInputElement>document.getElementById("editpages"+bookID)).value;
        
        // Kontrollerar om alla fällt är ifyllda, skriver annars ut ett felmeddelande
        if (titleEl == "" || authorEl == "" || genreEl == "" || isbnEl == "" || pagesEl == "") {
            (<HTMLInputElement>document.getElementById("editErrormsg"+bookID)).innerHTML = "Ett eller flera av fälten är inte ifyllda";
        } 
        else {
            // Kontrollerar om antal sidor är angett som en siffra, skriver annars ut ett felmeddelande
            if (!isNaN(parseInt((<HTMLInputElement>document.getElementById("editpages"+bookID)).value))) {
                let myObj = {
                    id: bookID,
                    title: titleEl,
                    author: authorEl,
                    genre: genreEl,
                    isbn: isbnEl,
                    pages: parseInt(pagesEl)// Omvandlar antal sidor från string till number för att stämma överens med interface och databas
                };
        
                // Använder metod insertPUT i objektet RESTclass
                RESTclass.insertPUT(myObj);
            }
            else {
                (<HTMLInputElement>document.getElementById("editErrormsg"+bookID)).innerHTML = "'Antal sidor' måste vara en siffra";
            };
        };

    };



    // Funktion som förbereder anrop för att ta bort en post
    function RESTDELETE(){  
        // Skickar this.id (valda elementets ID) till returnID som returnerar endast en siffra som används som id i databasen
        let thisID: string = returnID(this.id);
        // Använder metoden deletePost i objektet RESTclass
        RESTclass.deletePost(thisID);   
    };



    



    // Funktion som aktiveras när använder trycker på knapp för att ändra ett inlägg
    function SHOWCHANGE(){
        // Skickar this.id (valda elementets ID) till returnID som returnerar endast en siffra som används som id i databasen
        let thisID: string = returnID(this.id);
        // Skapar variabel med vald knapp
        let button = (<HTMLInputElement>document.getElementById("edit"+thisID));
        // Ändrar class för div (som är displat: none;) som är kopplad till valt objekt, detta ändrar till display: block; och gör det synligt
        document.getElementById("divedit" + thisID).classList.toggle("showEdit");
        // Ändrar text på knapp för att representera vad den gör
        if (button.value == "Ändra") button.value = "Dölj";
        else button.value = "Ändra";
    };



    // Tar emot en sträng som är ID för ett valt element och returnerar endast det nummer som används, vilket är samma som ID i databasen
    function returnID(input:string) {
        // RegExp som endast sparar siffror
        let theid: RegExpMatchArray = input.match(/\d+/g);
        return theid[0];
    };


    
    
    

    // Läser via RESTtjänst ut alla böcker kopplade till användaren när sidan laddas
    let xml = new XMLHttpRequest();
    xml.onreadystatechange = function() {
        if (xml.readyState == XMLHttpRequest.DONE) {

            if (xml.status == 200) {
                console.log("Status 200");

                // Gör parse och skapar variabel med text från JSON från RESTtjänst
                let jsonData: any = JSON.parse(xml.responseText); 
                // Använder utskriften av användare på toppen av sidan för att skapa variabel med användare (OBS risk för modifiering och utläsning av fel poster)
                let username = (<HTMLInputElement>document.getElementById("booksusername")).innerHTML; 
                // Element som lista med böcker ligger i
                let bookliste:HTMLElement = document.getElementById("booklist");
                let count: number = 0;

                // Kontrollerar om den inloggade användaren har några poster i JSON-filen
                for (let q = 0; q<jsonData.length; q++) {
                    if (jsonData[q].user == username) count = count+1;
                }

                // Om användaren har poster skrivs dessa ut
                if (!(count==0)){
                    // Går igenom alla poster i JSON-fil
                    for (let i:number = 0; i < jsonData.length; i++) {
                        // Om en post är skriven av den inloggade användaren skrivs den ut i ett element på sidan
                        // Skapar först ett element där information om bok skrivs ut, därefter en div med fält för att ändra boken, detta fält döljs
                        // Element och knappar får ett ID som innehåller postens ID från databasen
                        if (jsonData[i].user == username) {

                            // Skapar DIV för information om bok
                            let showbooks: HTMLDivElement = document.createElement("div");
                            showbooks.setAttribute("class", "showbooks");

                            // Skapar element med titel
                            let titleEl: HTMLParagraphElement = document.createElement("p");
                            let txtTitleEl: Text = document.createTextNode("Titel: " + jsonData[i].title);
                            titleEl.appendChild(txtTitleEl);
                            showbooks.appendChild(titleEl);

                            // Skapar element med författare
                            let authorEl: HTMLParagraphElement = document.createElement("p");
                            let txtAuthorEl: Text = document.createTextNode("Författare: " + jsonData[i].author);
                            authorEl.appendChild(txtAuthorEl);
                            showbooks.appendChild(authorEl);

                            // Skapar element med genre
                            let genreEl: HTMLParagraphElement = document.createElement("p");
                            let txtGenreEl: Text = document.createTextNode("Genre: " + jsonData[i].genre);
                            genreEl.appendChild(txtGenreEl);
                            showbooks.appendChild(genreEl);

                            // Skapar element med ISBN
                            let isbnEl: HTMLParagraphElement = document.createElement("p");
                            let txtIsbnEl: Text = document.createTextNode("ISBN: " + jsonData[i].isbn);
                            isbnEl.appendChild(txtIsbnEl);
                            showbooks.appendChild(isbnEl);

                            // Skapar element med antal sidor
                            let pagesEl: HTMLParagraphElement = document.createElement("p");
                            let txtPagesEl: Text = document.createTextNode("Antal sidor: " + jsonData[i].pages);
                            pagesEl.appendChild(txtPagesEl);
                            showbooks.appendChild(pagesEl);

                            // Skapar knapp för att ändra
                            let openChange: HTMLInputElement = document.createElement("input");
                            openChange.setAttribute("type", "button");
                            openChange.setAttribute("value", "Ändra");
                            openChange.setAttribute("id", "edit" + jsonData[i].ID);
                            openChange.setAttribute("class", "openChange button");
                            showbooks.appendChild(openChange);

                            // Skapar knapp för att ta bort
                            let deletebutton: HTMLInputElement = document.createElement("input");
                            deletebutton.setAttribute("type", "button");
                            deletebutton.setAttribute("value", "Ta bort");
                            deletebutton.setAttribute("id", "delete" + jsonData[i].ID);
                            deletebutton.setAttribute("class", "deletebutton button");
                            showbooks.appendChild(deletebutton);



                            // Skapar div som innehåller fält för att ändra post
                            let hidden: HTMLDivElement = document.createElement("div");
                            hidden.setAttribute("class", "hidden");
                            hidden.setAttribute("id", "divedit" + jsonData[i].ID);



                            // Skapar fält för att ändra titel
                            let edittitleEl: HTMLInputElement = document.createElement("input");
                            edittitleEl.setAttribute("type", "text");
                            edittitleEl.setAttribute("id", "edittitle" + jsonData[i].ID);
                            edittitleEl.setAttribute("class", "editinput");
                            edittitleEl.setAttribute("value", jsonData[i].title);
                            hidden.appendChild(edittitleEl);

                            // Skapar fält för att ändra titel
                            let editauthorEl: HTMLInputElement = document.createElement("input");
                            editauthorEl.setAttribute("type", "text");
                            editauthorEl.setAttribute("id", "editauthor" + jsonData[i].ID);
                            editauthorEl.setAttribute("class", "editinput");
                            editauthorEl.setAttribute("value", jsonData[i].author);
                            hidden.appendChild(editauthorEl);

                            // Skapar fält för att ändra titel
                            let editgenreEl: HTMLInputElement = document.createElement("input");
                            editgenreEl.setAttribute("type", "text");
                            editgenreEl.setAttribute("id", "editgenre" + jsonData[i].ID);
                            editgenreEl.setAttribute("class", "editinput");
                            editgenreEl.setAttribute("value", jsonData[i].genre);
                            hidden.appendChild(editgenreEl);

                            // Skapar fält för att ändra titel
                            let editisbnEl: HTMLInputElement = document.createElement("input");
                            editisbnEl.setAttribute("type", "text");
                            editisbnEl.setAttribute("id", "editisbn" + jsonData[i].ID);
                            editisbnEl.setAttribute("class", "editinput");
                            editisbnEl.setAttribute("value", jsonData[i].isbn);
                            hidden.appendChild(editisbnEl);

                            // Skapar fält för att ändra titel
                            let editpagesEl: HTMLInputElement = document.createElement("input");
                            editpagesEl.setAttribute("type", "text");
                            editpagesEl.setAttribute("id", "editpages" + jsonData[i].ID);
                            editpagesEl.setAttribute("class", "editinput");
                            editpagesEl.setAttribute("value", jsonData[i].pages);
                            hidden.appendChild(editpagesEl);

                            // P-element för att skriva ut felmeddelande
                            let editErrormsg: HTMLParagraphElement = document.createElement("p");
                            editErrormsg.setAttribute("id", "editErrormsg" + jsonData[i].ID);
                            hidden.appendChild(editErrormsg);

                            // Knapp för att bekfräfta ändring
                            let confirmeditbtn: HTMLInputElement = document.createElement("input");
                            confirmeditbtn.setAttribute("type", "button");
                            confirmeditbtn.setAttribute("id", "confirmedit" + jsonData[i].ID);
                            confirmeditbtn.setAttribute("class", "confirmeditbtn button");
                            confirmeditbtn.setAttribute("value", "Bekräfta");
                            hidden.appendChild(confirmeditbtn);


                            
                            // Lägger till dold div för ändringar till div som visar bok
                            showbooks.appendChild(hidden);

                            // Lägger till div med bok till div i HTML-fil
                            bookliste.appendChild(showbooks);

                        };
                    };

                    // Skapar lista med alla knappar för att ta bort poster
                    let deletebuttons: HTMLCollectionOf<Element> = document.getElementsByClassName("deletebutton");

                    // Lägger till eventlisteners som anropar funktion RESTDELETE för alla 'Ta bort' knappar,
                    for (var c:number = 0; c<deletebuttons.length; c++) {
                        deletebuttons[c].addEventListener("click", RESTDELETE);
                        
                    };

                    // Skapar lista med alla knappar som visar fältet för att ändra poster
                    let openchangebuttons: HTMLCollectionOf<Element> = document.getElementsByClassName("openChange");

                    // Lägger till eventlistener som anropar SHOWCHANGE för alla knappar som visar ändringar
                    for (var t:number = 0; t<openchangebuttons.length; t++) {
                        openchangebuttons[t].addEventListener("click", SHOWCHANGE);
                    };

                    // Skapar lista med alla knappar för att bekräfa ändringar
                    let changebuttons: HTMLCollectionOf<Element> = document.getElementsByClassName("confirmeditbtn");

                    // Lägger till eventlistener som anropar funktion RESTPUT för alla knappar som bekräftar ändring
                    for (var k:number = 0; k<changebuttons.length; k++) {
                        changebuttons[k].addEventListener("click", RESTPUT);
                    };
                    
                }
                else {
                    // Om användaren inte har några tillagda böcker visas en text
                    bookliste.innerHTML = "<p class='noBooks'>Du har inte lagt till några böcker än, fyll i fälten i toppen på sidan för att börja lägga till dina böcker</p>";
                };

            }
            else if (xml.status == 400) {
                alert("ERROR: 400");
            }
            else {
                alert("ERROR: Annat svar än 200 returnerades");
            };

        };
    }
    xml.open("GET", url, true);
    xml.send();
});