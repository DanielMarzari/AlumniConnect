var table = document.getElementById("row");
var search = document.getElementById("searchTxt");
var result = document.getElementById("res");

function checkField(){
	if(search.value == "Search for Alumni"){
		search.value = "";
	}
}

search.onkeydown = function (e) {
    if (e.keyCode == 13) {
		e.preventDefault();
		callSQL();
	}
};

function makeHttpObject() {
  try {return new XMLHttpRequest();}
  catch (error) {}
  try {return new ActiveXObject("Msxml2.XMLHTTP");}
  catch (error) {}
  try {return new ActiveXObject("Microsoft.XMLHTTP");}
  catch (error) {}

  throw new Error("Could not create HTTP request object.");
}

function processSQL(res){
	var json_res = JSON.parse(res).response;
	var comp = []
	var val = ""
	for	(var i = 0; i < json_res.length; i++){
		val = "";
		comp = json_res[i].Company.split(",")
		for (var j = 0; j < comp.length; j++){
			if(comp[j].indexOf(search.value) > 0){
				val = comp[j]
			}
		} 
		if (val == ""){
			val = comp[0];
		}
		makeRow([json_res[i].FullName, json_res[i].GraduationYear, json_res[i].Degree, val, json_res[i].ID]);
	}
	result.innerHTML = json_res.length + " results";
}


function makeRow(arr){
	var row = document.createElement('tr');
	for (var i = 0; i <= 3; i++){
		var cell = document.createElement('td');
		var textnode = document.createTextNode(arr[i]);
		cell.appendChild(textnode);
		row.appendChild(cell);
		table.appendChild(row);
	}
	var cell = document.createElement('td');	
	var link = document.createElement('a');
	link.href = "profile.html#" + arr[4];
	var textnode = document.createTextNode("View Profile");
	link.appendChild(textnode);
	cell.appendChild(link);
	row.appendChild(cell);
}

function removeTable(){
	table.innerHTML = "<th>Name</th><th>Grad year</th><th>Degree</th><th>Company</th><th>Profile Link</th>";
}


function callSQL(){
	var str = search.value;
	//Distinct FullName
	var sql = "SELECT FullName, GraduationYear, Degree, GROUP_CONCAT(CONCAT(Title, ' at ', Company)) AS Company, alumni.ID FROM workhistory " + 
			"INNER JOIN alumni ON workhistory.Alumni_ID=alumni.ID " + 
			"WHERE FullName LIKE '%" + str + "%' " + 
			"OR GraduationYear like '" + str + "' " +
			"OR Degree LIKE '%" + str + "%' " +
			"OR Company LIKE '%" + str + "%' " + 
			"GROUP BY alumni.ID " + 
			"ORDER BY FullName";
	removeTable();
	var request = makeHttpObject();
	request.open("POST", "http://localhost:8888", true);
	request.send(sql); 
	request.onreadystatechange = function() {
		if (request.readyState == 4){
			processSQL(request.responseText);
		}
	};
	//https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
}

function colourize() {
  var dnl = document.getElementsByTagName("tr");
  for(i = 0; i < dnl.length; i++) {
    if((Math.round(i / 2) * 2) == ((i / 2) * 2) )
    dnl.item(i).style.background="#F0F0F0";
  }
}

function logout(){
	if(getCookie("admin") == ""){
		document.cookie = 'UID=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
	}else{
		document.cookie = 'admin=; UID=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
	}
	window.location.href = 'index.html';
}

window.onload = colourize;

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

var tabs = document.getElementById("tabs");
tabs.innerHTML += '<li><a href="profile.html">Profile</a></li>'
if(getCookie("admin") == "true"){
	tabs.innerHTML += '<li><a href="reports.html">Reporting</a></li>'
}
tabs.innerHTML += '<li onclick="logout()"><a href="index.html">Logout</a></li>'
