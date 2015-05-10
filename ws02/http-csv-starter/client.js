var url  = require('url');
var http = require('http');

function usage() {
  console.log('node client.js [text|json|csv|jsonUser] [url]');
  process.exit(1);
}

function isURL(str) {
  if (!str)
    return undefined;  
  var u = url.parse(str);
  if (u.protocol !== null)
    return str;
  else
    return undefined;
}

function checkType(type) {
  if (!type) return undefined
  else if (type === 'text' ||
	   type === 'json' || type === 'csv' || type === 'jsonUser')
    return type;
}

function checkURL(str) {
  if (!str) return undefined
  else {
    var u = url.parse(str);
    if (u.protocol !== null)
      return u;
    else
      return undefined;
  }
}

var args = process.argv;
var type = checkType(args[2]) || 'text';
var url  = checkURL(args[3])  || url.parse('http://localhost:3000');

console.log(type);
console.log(url);

// This function is used to receive data being received from the
// server's response. The provided callback has a single argument that
// is passed a string of the received data.
function receive(res, callback) {
  var str = '';

  // When data is received we append to string.
  res.on('data', function (chunk) {
    str += chunk;
  });

  // When the connection is closed, we invoke our callback.
  res.on('end', function () {
    callback(str);
  });  
}

function textHandler(res) {
  receive(res, function (data) {
    console.log('received text: ' + data);
  });
}

function jsonHandler(res) {
  receive(res, function (data) {
    var obj = JSON.parse(data);
    console.log('received json message: ' + obj.msg);
  });
}

function jsonUserHandler(res) {
  receive(res, function (data) {
    var jsonObj = JSON.parse(data);
    for(i = 0; i < jsonObj.addressBook.length; i++){
    console.log('First Name: ' + jsonObj.addressBook[i].fname);
    console.log('Last Name: ' + jsonObj.addressBook[i].lname);
    console.log('User ID: ' + jsonObj.addressBook[i].uid);
    console.log('Phone: ' + jsonObj.addressBook[i].phone);
    console.log('Address: ' + jsonObj.addressBook[i].address + '\n');


    }
  });
}

function csvUserHandler(res) {
  receive(res, function (data) {
    var csvObj = JSON.parse(data);
    console.log('fname, lname, uid, phone, address') 
    for(i = 0; i < csvObj.addressBook.length; i++){
    //prints the csv file but won't print any of the consol log statements, prints received text info
    console.log(csvObj.addressBook[i].fname + ', ' + csvObj.addressBook[i].lname + ', '
    + csvObj.addressBook[i].uid + ', ' + csvObj.addressBook[i].phone + ', ' +
    csvObj.addressBook[i].address);
    }
   }); 
}

var handlers = {
  text : textHandler,
  json : jsonHandler,
  jsonUser : jsonUserHandler,
  csv : csvUserHandler
};

var options = {
  host: url.hostname,
  path: url.path,
  port: url.port || 80,
  method: 'GET'
};

var h   = handlers[type];
var req = http.request(options, h);
req.end();
