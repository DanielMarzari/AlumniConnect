var username = document.getElementById("uname");
var password = document.getElementById("pword");
var error = document.getElementById("onError");

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
	console.log(JSON.parse(res).response[0]);
	if(JSON.parse(res).response[0] == undefined){
		error.hidden = false;
	}else{
		var cookie = "UID=" + 
		setCookie("UID", JSON.parse(res).response[0].UID + '', 1);
		if(username.value == "admin"){
			setCookie("admin", "true", 1); //change this to a database lookup
		}
		window.location.href = "../practice/profile.html";
	}
}

function login(){
	var request = makeHttpObject();
	request.open("POST", "http://localhost:8888", true);
	request.send("SELECT MD5(ID) as UID FROM alumni INNER JOIN users ON alumni.User_ID=users.Username " +
				 "WHERE Username = '" + username.value + "' and Password = MD5('" + password.value + "')");
	request.onreadystatechange = function() {
		if (request.readyState == 4){
			processSQL(request.responseText);
		}
	};
	//https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
}

function setCookie(cname, cvalue, exhours) {
  var d = new Date();
  d.setTime(d.getTime() + (exhours*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
