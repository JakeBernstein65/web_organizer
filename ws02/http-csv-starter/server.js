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
fs.readFile('people.csv', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});


//  res.writeHead(200, { 'Content-Type' : 'text/csv' });
// var data = { msg: 'hello, world' };
//var csv = JSON.stringify(data);
//res.write(csv);
//res.end();
}

var handlers = {
  text : textHandler,
  json : jsonHandler,
  csv: csvHandler
};

var h = handlers[type];

console.log('Running ' + type + ' service on port 3000');
http.createServer(h).listen(3000);
