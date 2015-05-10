var http = require('http');
var url  = require('url');
var fs = require('fs');

function usage() {
  console.log('node server.js [text|json|csv]');
  process.exit(1);
}

var args = process.argv;
var type = args[2] || 'text';

function textHandler(req, res) {
  res.writeHead(200, { 'Content-Type' : 'text/plain' });
  res.write('hello, world');
  res.end();
}

function jsonHandler(req, res) {
  res.writeHead(200, { 'Content-Type' : 'text/json' });
  var data = { msg: 'hello, world' };
  var json = JSON.stringify(data);
  res.write(json);
  res.end();
}

function csvHandler(req, res) {
fs.readFile('people.csv', 'ascii', function (err,data) {
  if (err) {
    return console.log(err);
  }
  
var lines = data.split("\n");
var result = [];
var headers = lines[0].split(", ");
var finalAddressBook = []; 
for(var i = 1; i < lines.length-1; i++){
	var obj = {};
	var currentline=lines[i].split(", ");
	
	for(var j = 0; j < headers.length; j++){
	    //console.log(currentline[j]);
		obj[headers[j]] = currentline[j];
	  }
	  finalAddressBook[i-1] = obj;
	  
}
var addressBook = {};
addressBook["addressBook"] = finalAddressBook;
res.writeHead(200, { 'Content-Type' : 'text/json' });
res.write(JSON.stringify(addressBook));
res.end();

});



}

var handlers = {
  text : textHandler,
  json : jsonHandler,
  csv: csvHandler
};

var h = handlers[type];

console.log('Running ' + type + ' service on port 3000');
http.createServer(h).listen(3000);
