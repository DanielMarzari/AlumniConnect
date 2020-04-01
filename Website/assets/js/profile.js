var profilePicture = document.getElementById("picture");
var profileName = document.getElementById("name");

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

// ---------------------------------------------------------------------------------------------------------------------------------
contactNumber.addEventListener('input', userUpdate);
contactWebsite.addEventListener('input', userUpdate);
contactEmail.addEventListener('input', userUpdate);
contactLinked.addEventListener('input', userUpdate);
contactSlack.addEventListener('input', userUpdate);
infoBio.addEventListener('input', userUpdate);
infoBday.addEventListener('input', userUpdate);
infoGender.addEventListener('input', userUpdate);
infoGyear.addEventListener('input', userUpdate);
infoDegree.addEventListener('input', userUpdate);
infoJob.addEventListener('input', userUpdate);
profileName.addEventListener('input', userUpdate);

function userUpdate(){
	updateBtn.style="display:block;";
	//onclick="this.style.display='none';"
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
	var json_res = JSON.parse(res).response;
	profilePicture.src = json_res[0].PictureURL ;
	
	profileName.innerText = json_res[0].FullName;
	contactNumber.innerText = json_res[0].Phone;
	contactWebsite.innerHTML = "<a href='" + json_res[0].Website + "'>" + json_res[0].Website + "</a>";
	contactEmail.innerText = json_res[0].Email;
	contactLinked.innerHTML = "<a href='" + json_res[0].LinkedInURL + "'>" + json_res[0].LinkedInURL + "</a>";
	contactSlack.innerText = "Not yet available";

	infoBio.innerText = json_res[0].Bio;
	infoBday.innerText = (new Date(json_res[0].Birthday)).toLocaleDateString(); //reformat this to mm/dd/yyy
	infoGender.innerText = json_res[0].Gender;
	infoGyear.innerText = json_res[0].GraduationYear;
	infoDegree.innerText = json_res[0].Degree;
	
}

function processWorkSQL(res){
	var json_res = JSON.parse(res).response;
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
	
	h4.contentEditable = "true";
	h5.contentEditable = "true";
	h6.contentEditable = "true";
	p.contentEditable = "true";
	
	h4.addEventListener('input', userUpdate);
	h5.addEventListener('input', userUpdate);
	h6.addEventListener('input', userUpdate);
	p.addEventListener('input', userUpdate);
	
	div2.appendChild(h4);
	div2.appendChild(h5);
	div2.appendChild(h6);
	div2.appendChild(p);
	
	div1.appendChild(div2);

	workExp.appendChild(div1);
}

function removeTable(){
	workExp.innerHTML = "<div class='panel-heading'><h3 class='panel-title'>Expierence</h3></div>";
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
		}
	};
	//https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
}

function workSQL(){
	//Distinct FullName
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
var ID = 29;
profileSQL();
workSQL();
