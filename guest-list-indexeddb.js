// some sample data
// See line 43 where guestData is called
const guestData = [
   { firstname: "Andy", lastname: "Seimer", email: "andy@cool.com", notes: "You rock" },
   { firstname: "Frank", lastname: "Cool", email: "frank@cool.com", notes: "Thanks for the invite!" }
];

//the database reference
let db;

//initializes the database
function initDatabase() {

	//create a unified variable for the browser variant
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

		//if a variant wasn't found, let the user know
	if (!window.indexedDB) {
			window.alert("Your browser doesn't support a stable version of IndexedDB.")
	}

   //attempt to open the database
	let request = window.indexedDB.open("guest", 1);
	request.onerror = function(event) {
		console.log(event);
	};

   //map db to the opening of a database
	request.onsuccess = function(event) { 
		db = request.result;
		console.log("success: " + db);
      readAll();
	};

   //if no database, create one and fill it with data
	request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore("guest", {keyPath: "email"});
      // "guest" is the db
      
      for (var i in guestData) {
         objectStore.add(guestData[i]);
      }
   }
}

//adds a record as entered in the form
function add() {
	//get a reference to the fields in html
	let firstname = document.querySelector("#firstname").value;
	let lastname = document.querySelector("#lastname").value;
	let email = document.querySelector("#email").value;
	let notes = document.querySelector("#notes").value;

	//alert(name + email + notes);

   //create a transaction and attempt to add data
	var request = db.transaction(["guest"], "readwrite")
	.objectStore("guest")
   .add({ firstname: firstname, lastname: lastname, email: email, notes: notes });

   //when successfully added to the database
	request.onsuccess = function(event) {
		// alert(`${firstname} has been added to your database.`);
      readAll();
	};

   //when not successfully added to the database
	request.onerror = function(event) {
	alert(`Unable to add data\r\n${firstname} is already in your database! `);
	}
}

//not used in code example
//reads one record by id
function read() {
   //get a transaction
   var transaction = db.transaction(["guest"]);
   
   //create the object store
   var objectStore = transaction.objectStore("guest");

   //get the data by id
   var request = objectStore.get("00-03");
   
   request.onerror = function(event) {
      alert("Unable to retrieve daa from database!");
   };
   
   request.onsuccess = function(event) {
      // Do something with the request.result!
      if(request.result){ 
         alert(request.result.email);
      }
      
      else {
         alert("Couldn't be found in your database!");
      }
   };
}
//reads all the data in the database
function readAll() {
   var objectStore = db.transaction("guest").objectStore("guest");
   var result = document.getElementById("result");
   result.innerHTML=" ";
   //creates a cursor which iterates through each record
   objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      
      if (cursor) {
         result.innerHTML += "Name: " + cursor.value.firstname + " " + cursor.value.lastname + ", Email: " + cursor.value.email + ", Notes: " + cursor.value.notes + "<br>";
         cursor.continue();
      }
      
   };
}

//deletes a record by id
function remove() {
	let delid = document.querySelector("#delid").value;
   var request = db.transaction(["guest"], "readwrite")
   .objectStore("guest")
   .delete(delid);
   
   request.onsuccess = function(event) {
      alert("Entry has been removed from your database.");
   };
}

initDatabase();