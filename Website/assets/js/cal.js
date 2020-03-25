var cal = document.getElementById('cal');
var mon = document.getElementById('month');
var year = document.getElementById('year');
var descrip = document.getElementById('description');
var d = new Date();
var currentMonth = d.getMonth();
var currentYear = d.getFullYear();
var MOY = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; //Day Of Week
var day;
var textnode;
var EOLM, SOM, EOM;
var request = makeHttpObject();

function makeCalander(){
	removeEvents();
	mon.innerText = MOY[currentMonth];
	year.innerText = currentYear;
	cal.innerHTML = "";
	
	//fill the names of the days of the week
	for (var i = 0; i < 7; i++){
		day = document.createElement('span');
		day.className = 'day-name';
		textnode = document.createTextNode(DOW[i]);
		day.appendChild(textnode);
		cal.appendChild(day);
	}

	EOLM = new Date(currentYear, currentMonth, 0).getDate(); //End of last month
	SOM = new Date(currentYear, currentMonth, 1).getDay(); //1 of the month, day of the week 
	
	for (var i = SOM; i > 0 ; i--){ //needs to grab first of specified month
		//fill days prior to the first of the month
		day = document.createElement('div');
		day.className = 'day day--disabled';
		textnode = document.createTextNode((EOLM - i + 1).toString());
		day.appendChild(textnode);
		cal.appendChild(day);
	}

	EOM = new Date(currentYear, currentMonth + 1, 0).getDate(); //End of (this) month
	for (var i = 1; i < EOM + 1; i++){ //needs to grab first of specified month
		//fill days prior to the first of the month
		day = document.createElement('div');
		day.className = 'day';
		textnode = document.createTextNode(i + "");
		day.appendChild(textnode);
		cal.appendChild(day);
	}
	
	if((EOM+SOM) % 7 > 0){
		for (var i = 1; i < 7 - ((EOM+SOM) % 7) + 1; i++){
			//fill days after to the last of the month
			day = document.createElement('div');
			day.className = 'day day--disabled';
			textnode = document.createTextNode(i + "");
			day.appendChild(textnode);
			cal.appendChild(day);
		}
	}
	callSQL();
}

function makeEvent(color, col, row, duration, caption, location, hours, description, coordinator, email, invitees){
	//This function will call the database and get upcoming events
	var event = document.createElement('section');
	event.className = 'task task--primary';
	event.onclick = function(){
		if(hours > 1){
			document.getElementById("description").innerHTML = "<b>Location:</b> " + location + "<br><b>Description: </b>" + 
			description + "<br><b>Invitees: </b>" + invitees + " ("+ hours + " hours)" + 
			"<br>For more information contact " + coordinator + " (<a href='mailto:" + email + "'>" + email + "</a>)";
		}else{
			if(hours == 1){
				document.getElementById("description").innerHTML = "<b>Location:</b> " + location + "<br><b>Description: </b>" + 
				description + "<br><b>Invitees: </b>" + invitees + " (1 hour)" + 
				"<br>For more information contact " + coordinator + " (<a href='mailto:" + email + "'>" + email + "</a>)";
			}else{ //0
				document.getElementById("description").innerHTML = "<b>Location:</b> " + location + "<br><b>Description: </b>" + 
				description + "<br><b>Invitees: </b>" + invitees +
				"<br>For more information contact " + coordinator + " (<a href='mailto:" + email + "'>" + email + "</a>)";
			}
		}	
	};
	event.style.background = color;
	event.style["grid-column"] = col + ' / span ' + duration;
	event.style["grid-row"] = row;
	
	textnode = document.createTextNode(caption);
	event.appendChild(textnode);
	cal.appendChild(event);
}

function removeEvents(){
	var nodes = cal.getElementsByTagName('section');
	for(var i = 0; i < nodes.length; i++){
		cal.removeChild(nodes[i]);
	}
}

function previousMonth(){
	if(currentMonth == 0){
		currentMonth = 11;
		currentYear --;
	}else{
		currentMonth --;
	}
	makeCalander();
}

function nextMonth(){
	if(currentMonth == 11){
		currentMonth = 0;
		currentYear ++;
	}else{
		currentMonth ++;
	}
	makeCalander();
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function makeHttpObject() {
  try {return new XMLHttpRequest();}
  catch (error) {}
  try {return new ActiveXObject("Msxml2.XMLHTTP");}
  catch (error) {}
  try {return new ActiveXObject("Microsoft.XMLHTTP");}
  catch (error) {}

  throw new Error("Could not create HTTP request object.");
}

function callSQL(){
	request.open("POST", "http://localhost:8888", true);
	request.send("select * from events where Date_Time between '" + currentYear + "-" + (currentMonth+1)  + "-01' and '" + currentYear + "-" + (currentMonth+1)  + "-" + EOM + "'");
	request.onreadystatechange = function() {
		if (request.readyState == 4){
			processSQL(request.responseText);
		}
	};
	//https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
}

function dateToGrid(dom){
	//date (day of month
	var len = SOM + dom;
	var col = ((len-1) % 7) + 1;
	var row = Math.trunc((len-1) / 7) + 2;
	return [col, row];
}

function processSQL(res){
	var json_res = JSON.parse(res).response;
	var crArr = [];
	for	(var i = 0; i < json_res.length; i++){
		crArr = dateToGrid(parseInt((json_res[i].Date_Time + '').split("-")[2].split(" ")[0]))
		makeEvent(json_res[i].Color, crArr[0], crArr[1], json_res[i].DurationD, json_res[i].Name, json_res[i].Location, json_res[i].DurationH, json_res[i].Description, json_res[i].Coordinator, json_res[i].Contact, json_res[i].Invitees);
	}
}

makeCalander();

//var cr = dateToGrid(9);
//makeEvent('blue', cr[0], cr[1], 1, "class");