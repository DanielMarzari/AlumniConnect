function makeHttpObject() {
  try {return new XMLHttpRequest();}
  catch (error) {}
  try {return new ActiveXObject("Msxml2.XMLHTTP");}
  catch (error) {}
  try {return new ActiveXObject("Microsoft.XMLHTTP");}
  catch (error) {}

  throw new Error("Could not create HTTP request object.");
}

function getSQL(sql) {
	var request = makeHttpObject();
	request.open("POST", "http://localhost:8888", true);
	request.send(sql);
	request.onreadystatechange = function() {
	  if (request.readyState == 4)
		return request.responseText;
	};
	//https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
}