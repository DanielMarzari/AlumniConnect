var profilePicture = document.getElementById("picture");
var profileName = document.getElementById("name");
var picURL = document.getElementById("picurl");

var contactNumber = document.getElementById("number");
var contactWebsite = document.getElementById("website");
var contactEmail = document.getElementById("email");
var contactLinked = document.getElementById("linkedin");
var contactSlack = document.getElementById("slack");

var infoBio = document.getElementById("bio");
var infoBday = document.getElementById("bday");
var infoGender = document.getElementById("gender");
var infoGyear = document.getElementById("gradyear");
var infoDegree = document.getElementById("degree");
var infoJob = document.getElementById("job");

var updateBtn = document.getElementById("updateBtn");
var workExp = document.getElementById("workexp");

var updated = false;
var ID;
// ---------------------------------------------------------------------------------------------------------------------------------
contentArr = [contactNumber, contactWebsite, contactEmail, contactLinked, infoBio, infoBday, infoGender, infoGyear, infoDegree, infoJob, profileName];

function addEL(){
	for(var i=0; i< contentArr.length; i++){
		contentArr[i].addEventListener('input', userUpdate);
	}
}


function setEditable(section){
	if(picURL.hidden){
		picURL.hidden = false;
		picURL.classList.add("edit");
		for(var i=0; i< contentArr.length; i++){
			contentArr[i].classList.add("edit");
			contentArr[i].contentEditable = 'true';
		}
	}else{
		picURL.hidden = true;
		picURL.classList.remove("edit");
		for(var i=0; i< contentArr.length; i++){
			contentArr[i].classList.remove("edit");
			contentArr[i].contentEditable = 'true';
		}
	}
}

function userUpdate(){
	updateBtn.style="display:block;";
	updated = true;
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

function processInfoSQL(res){
	with(JSON.parse(res).response[0]){
		profilePicture.src = PictureURL;
		picURL.innerText = PictureURL;
		profileName.innerText = FullName;
		contactNumber.innerText = Phone;
		contactWebsite.innerHTML = "<a href='" + Website + "'>" + Website + "</a>";
		contactEmail.innerText = Email;
		contactLinked.innerHTML = "<a href='" + LinkedInURL + "'>" + LinkedInURL + "</a>";
		contactSlack.innerText = "Not yet available";

		infoBio.innerText = Bio;
		infoBday.innerText = (new Date(Birthday)).toLocaleDateString();
		infoGender.innerText = Gender;
		infoGyear.innerText = GraduationYear;
		infoDegree.innerText = Degree;
	}
}

function processWorkSQL(res){
	var json_res = JSON.parse(res).response;
	console.log(json_res);
	infoJob.innerText = json_res[0].Title + " at " + json_res[0].Company;
	var data = []
	for	(var i = 0; i < json_res.length; i++){ 
		data = []
		data.push(json_res[i].Title);
		data.push(json_res[i].Company + " - " + json_res[i].Part_FullTime);
		if(json_res[i].EndDate == null){
			data.push((new Date(json_res[i].StartDate)).toLocaleDateString() + " - Present");
		}else{
			data.push((new Date(json_res[i].StartDate)).toLocaleDateString() + " - " + (new Date(json_res[i].EndDate)).toLocaleDateString());
		}
		data.push(json_res[i].Description);
		makeExp(data);
	}
}

function processUpdateSQL(res){
	var json_res = JSON.parse(res).response;
	console.log(json_res);
	//This should check if there was an error
}

function makeExp(arr){
	var div1 = document.createElement('div');
	div1.className = "panel panel-info";
	div1.style = "margin:1em";
	var div2 = document.createElement('div');
	var h4 = document.createElement('h4');
	var textnode1 = document.createTextNode(arr[0]);
	var h5 = document.createElement('h5');
	var textnode2 = document.createTextNode(arr[1]);
	var h6 = document.createElement('h6');
	var textnode3 = document.createTextNode(arr[2]);
	var p = document.createElement('p');
	var textnode4 = document.createTextNode(arr[3]);
	
	h4.appendChild(textnode1);
	h5.appendChild(textnode2);
	h6.appendChild(textnode3);
	p.appendChild(textnode4);
	
	contentArr.push(h4);
	contentArr.push(h5);
	contentArr.push(h6);
	contentArr.push(p);
	
	div2.appendChild(h4);
	div2.appendChild(h5);
	div2.appendChild(h6);
	div2.appendChild(p);
	
	div1.appendChild(div2);

	workExp.appendChild(div1);
	addEL();
}

function removeTable(){
	workExp.innerHTML = "<div class='panel-heading'><h3 class='panel-title'>Expierence<i class = 'bx bxs-edit' onclick='setEditable(2)'></i></h3></div>";
}

function profileSQL(){
	
	//Distinct FullName
	var sql = "SELECT * FROM alumni where ID = " + ID;
	var request = makeHttpObject();
	request.open("POST", "http://localhost:8888", true);
	request.send(sql); 
	request.onreadystatechange = function() {
		if (request.readyState == 4){
			processInfoSQL(request.responseText);
			workSQL();
		}
	};
	//https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
}

function workSQL(){
	var sql = "SELECT * FROM workhistory WHERE Alumni_ID = " + ID + " ORDER BY CASE WHEN EndDate IS NULL THEN CURDATE() ELSE EndDate END DESC";
	removeTable();
	var request = makeHttpObject();
	request.open("POST", "http://localhost:8888", true);
	request.send(sql); 
	request.onreadystatechange = function() {
		if (request.readyState == 4){
			processWorkSQL(request.responseText);
		}
	};
	//https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
}

function updateSQL(){
	setEditable(4, 'false');
	updateBtn.style="display:none;";
	
	var sqlArr = [];
	var sql = "";
	var sdate, edate;
	
	//Delete work history
	sqlArr.push("DELETE FROM workhistory WHERE Alumni_ID = " + ID + "; ");
	sql = "INSERT INTO workhistory VALUES ";
	for(var i = 1; i < workExp.children.length; i++){	
		with(workExp.children[i].children[0]){
		sdate = new Date(children[2].innerText.split(' - ')[0]);
		
			sql += '(NULL, "' + children[1].innerText.split(' - ')[0] + '", ' + //Company
				'"' + children[0].innerText + '", ' +  //Title
				'"' + children[1].innerText.split(' - ')[1] + '", ' +  //Time 
				'"' + sdate.getFullYear() + '-' + ('00' + (sdate.getMonth()+1)).slice(-2) + '-' + ('00' + sdate.getDate()).slice(-2) + '", '; //StartDate
			if(children[2].innerText.split(' - ')[1] == 'Present'){
				sql += 'NULL, '; //EndDate
			}else{
				edate = new Date(children[2].innerText.split(' - ')[1]);
				sql += '"' + edate.getFullYear() + '-' + ('00' + (edate.getMonth()+1)).slice(-2) + '-' + ('00' + edate.getDate()).slice(-2) + '", '; //EndDate
			}
			sql += '"' + children[3].innerText + '", ' + 
				ID + ')'; //Description
		}
		if(i == (workExp.children.length-1)){
			sql += '; ';
		}else{
			sql += ', ';
		}
	}
	sqlArr.push(sql);
	
	var bdate = new Date(infoBday.innerText);
	
	sql = 'UPDATE alumni SET FullName = "' + profileName.innerText + '", ' +  
		  'Gender = "' + infoGender.innerText + '", ' + 
		  'Birthday = "' +  bdate.getFullYear() + '-' + ('00' + (bdate.getMonth()+1)).slice(-2) + '-' + ('00' + bdate.getDate()).slice(-2) + '", ' + //convert this to yyyy/mm/dd
		  'Phone = "' + contactNumber.innerText + '", ' + 
		  'Email = "' + contactEmail.innerText + '", ' + 
		  'Degree = "' + infoDegree.innerText + '", ' + 
		  'Website = "' + contactWebsite.innerText + '", ' + 
		  'LinkedInURL = "' + contactLinked.innerText + '", ' + 
		  'Bio = "' + infoBio.innerText + '", ' + 
		  'GraduationYear = ' + infoGyear.innerText + ', ' + 
		  'PictureURL = "' + picURL.innerText +	'" ' + 
		  'WHERE ID = ' + ID + ';';
	
	sqlArr.push(sql);
	sendSQL(sqlArr, processUpdateSQL);
}

function sendSQL(sqlarr, funct){
	var request = makeHttpObject();
	request.open("POST", "http://localhost:8888", true);
	request.send(sqlarr[0]); 
	request.onreadystatechange = function() {
		if (request.readyState == 4){
			funct(request.responseText);
			if(sqlarr.length > 1){
				sqlarr.shift();
				sendSQL(sqlarr, funct);
			}
		}
	};//https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
}

function logout(){
	if(getCookie("admin") == ""){
		document.cookie = 'UID=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
	}else{
		document.cookie = 'admin=; UID=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
	}
	window.location.href = 'index.html';
}

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

function getID(){
	if(window.location.href.includes("#")){
		ID = window.location.href.split("#")[1];
		
		loadpage();
	}else{
		var cookie = getCookie("UID");
		sendSQL(["SELECT ID FROM alumni WHERE MD5(ID) = '" + cookie + "'"], function(e){
			var json_res = JSON.parse(e).response;
			ID = json_res[0].ID;
			loadpage();
		});
	}
}

function loadpage(){
	profileSQL();
}

window.onload = getID();

var tabs = document.getElementById("tabs");
if(window.location.href.includes("#")){
	tabs.innerHTML += '<li><a href="profile.html">Profile</a></li>'
}
if(getCookie("admin") == "true"){
	tabs.innerHTML += '<li><a href="reports.html">Reporting</a></li>'
}
tabs.innerHTML += '<li><a href="search.html">Search</a></li>'
tabs.innerHTML += '<li onclick="logout()"><a href="index.html">Logout</a></li>'
