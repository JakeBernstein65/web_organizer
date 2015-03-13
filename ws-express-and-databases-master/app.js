// Require the express library:
var express = require('express');

// Require our database library:
var db = require('db');

// Create an app:
var app = express();

// A route to list all users and provide a form to add more.
app.get('/users', function (req, res) {
	
	var html ='<br><br><form action="/users/add" method="get">' + "\n" +
  'UID:<br> <input type="text" name="uid"><br><br>' +
  'First Name:<br> <input type="text" name="fname"><br><br>' +
  'Last Name:<br> <input type="text" name="lname"><br><br>' +
  'Password:<br> <input type="text" name="password"><br><br>' +
  'Age:<br> <input type="text" name="age"><br><br>' +
  '<input type="submit" value="Add User">' +
'</form><br><br>';
	
  
  db.list(function(arg){
  res.send(arg+html);
  });
  
});

app.get('/users/add', function (req, res) {
if((req.query.uid !== undefined) && (req.query.fname !== undefined) && (req.query.lname !== undefined) 
&& (req.query.password !== undefined) && (req.query.age !== undefined)){

	db.add(req.query, function()
	{
	 console.log("redirecting!");
	 res.redirect('/users');
	}
	);
	
  }
  
else{
	res.redirect('/users'); //how we redirect ourself back to /user
  }
});

// Start the server:
var server = app.listen(3000, function () {
  console.log('Listening on port %d', server.address().port);
});
