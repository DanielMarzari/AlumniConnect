var firstColumn = document.getElementById("firstColumn");
var otherColumns = document.getElementById("otherColumns");
var firstHeader = document.getElementById("firstHeader");
var otherHeaders = document.getElementById("otherHeaders");
var sqlTxt = document.getElementById("sqlTxt");
var csv = '';

function checkField(){
	if(sqlTxt.value == "Type SQL"){
		sqlTxt.value = "";
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

function processSQL(res){
	var json_res = JSON.parse(res);
	var fields = Object.keys(json_res.response[0]);
	
	var maxlen = 0;
	var curLen = 0;
	csv = '"';
	
	for (var i = 0; i < fields.length; i++){
		if(csv != '"'){
			csv += '", "';
		}
		csv += fields[i];
		
		for	(row in json_res.response){
			if(i == 0){
				//First Column (stable)
				make_firstColumn(json_res.response[row][fields[0]]);
			}
			curLen = (json_res.response[row][fields[i]] + '').length;
			if(curLen > maxlen){
				maxlen = curLen;
			}
		}
		if(i == 0){
			//First Header (stable)
			make_firstHeader(fields[0]);
			setColumnOffset(maxlen);
		}else{
			//Other headers
			make_otherHeaders(fields[i], i+1);
		}
		if(fields[i].length > maxlen){
			setColumnStyle(i+1, fields[i].length); //this should be all caps
		}else{
			setColumnStyle(i+1, maxlen);
		}
		maxlen = " "
	}
	
	csv += '\r\n';
	//Other columns
	var data = [];
	var line = '"';
	
	for	(row in json_res.response){
		line = '"'
		for (var i = 0; i < fields.length; i++){
			if (line != '"'){
				line += '", "';
			}
			line += json_res.response[row][fields[i]];
			if(i != 0){
				data.push(json_res.response[row][fields[i]]);
			}
		}
		csv += line + '\r\n';
		make_otherColumns(data);
		data = [];
	}
}

function make_firstColumn(name){
	var row = document.createElement('tr');
	row.className = 'row100 body';
	var cell = document.createElement('td');
	cell.className = 'cell100 column1';
	var textnode = document.createTextNode(name);
	
	row.appendChild(cell);
	cell.appendChild(textnode);
	firstColumn.appendChild(row);
}

function make_otherColumns(arr){	
	var row = document.createElement('tr');
	row.className = 'row100 body';
	for(var i = 0; i < arr.length; i++){
		var cell = document.createElement('td');
		cell.className = 'cell100 column' + (i+2);
		var textnode = document.createTextNode(arr[i]);
		cell.appendChild(textnode);
		row.appendChild(cell);
	}
	otherColumns.appendChild(row);
}

function make_firstHeader(name){
	var cell = document.createElement('th');
	cell.className = 'cell100 column1';
	var textnode = document.createTextNode(name);
	
	cell.appendChild(textnode);
	firstHeader.appendChild(cell);
}

function make_otherHeaders(name, index){
	var cell = document.createElement('th');
	cell.className = 'cell100 column' + index;
	var textnode = document.createTextNode(name);
	
	cell.appendChild(textnode);
	otherHeaders.appendChild(cell);
}

function removeTable(){
	firstColumn.innerHTML = "";
	otherColumns.innerHTML = "";
	firstHeader.innerHTML = "";
	otherHeaders.innerHTML = "";
}

function setColumnStyle(indx, max){
  var style = document.createElement('style');
  style.innerHTML = ".column" + indx + " {width: " + (max * 10) + "px;}";
  document.head.appendChild(style);
}

function setColumnOffset(size){
  var style = document.createElement('style');
  style.innerHTML = ".wrap-table100-nextcols {padding-left: " + (size + 80) + "px;}";
  document.head.appendChild(style);
}

function callSQL(){
	removeTable();
	var request = makeHttpObject();
	request.open("POST", "http://localhost:8888", true);
	request.send(sqlTxt.value);
	request.onreadystatechange = function() {
		if (request.readyState == 4){
			processSQL(request.responseText);
		}
	};
	//https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
}

function downloadCSV(){
	var d = new Date();
	
	var fileTitle = d.toLocaleTimeString().replace(/:/g, "-") +  "_" + d.toDateString() + '.csv';
	var exportedFilenmae = fileTitle;
	var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	var link = document.createElement("a");
	if (link.download !== undefined) { // feature detection
		// Browsers that support HTML5 download attribute
		var url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", exportedFilenmae);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}