var http = require('http');

http.createServer(function (req, res) {
	
	//var sql = req.url.split("\r\n")[0].replace("/?sql=", "");
	//console.log(sql);
	let sql = '';
    req.on('data', chunk => {
        sql += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {//console.log(sql);
	//https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190
	
		var mysql = require('mysql');
		var connection = mysql.createConnection({
		  host: 'localhost',
		  user: 'root',
		  password: '',
		  database: 'alumnidb'
		});
		var data= [];

		connection.connect();
		console.log(sql);
		var query = connection.query(sql);
		query
			.on('error', function(err) {
				console.log(err);
			// Handle error, an 'end' event will be emitted after this as well
			})
			.on('result', function(row) {
				// Pausing the connnection is useful if your processing involves I/O
				connection.pause();
				data.push(row);
				connection.resume();
			})
			.on('end', function() {
				//https://gist.github.com/balupton/3696140
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader('Access-Control-Request-Method', '*');
				res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
				res.setHeader('Access-Control-Allow-Headers', '*');
				if (req.method === 'OPTIONS') {
					res.writeHead(200);
					res.end();
					return;
				}
				console.log(data);
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write(JSON.stringify({"response": data}));
				res.end();
			});
	});
}).listen(8888);

//https://github.com/mysqljs/mysql
//https://stackoverflow.com/questions/25113083/loading-html-page-in-node-js
//http://localhost:8888/
//https://www.w3resource.com/node.js/nodejs-mysql.php
//http://localhost:8080/practice/Backend/index.php
//https://www.w3schools.com/nodejs/nodejs_mysql_select.asp