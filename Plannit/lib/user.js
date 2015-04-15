//initialize mongodb and get the database of users
//every user will have a username, password, email and a uid that we 
//will set the value of

var mongo = require('mongodb');
//var connection = new Mongo();
var Server = mongo.Server;
var Db = mongo.Db;
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('users', server);


//this will store everyone who is online
var online = {};

exports.addOnline = function(user){
  online[user.uid] = user; 
}

exports.removeOnline = function(user){
  delete online[user.uid];
}

exports.isOnline = function(user, cb){
  if(user === undefined || user.username !== online[user.uid].username){
    cb(undefined);
  }
  else{
    cb(user);
  }
}
///////////////////////////this one
//this will confirm whether a user exists or not

exports.isUser = function (username, cb){
db.open(function(err, db) {
  if(!err) {
    db.collection(username, function(err, user) {
      if(!err){
	user.findOne({username:username}, function(err, currentUser){
	  if(!err && currentUser !== null){
 	    cb(undefined, currentUser);
	  }
	  else{
	    cb('User not found');
	  }	
	});
      }
      else{
	cb('User not found');
      }

    });
  }
});  

}
///////////////////////////this one
//this should be called to add user to users database
exports.addNewUser = function (username, password, email, cb){
//Add new users assumes you've checked that this username is unique
//using the isUser function.
//This function will add a new user and provide them an empty
//todo collection that will enlist all the things to do, and it will
//add the home collection that holds all the module collections.
  db.open(function(err, db){
    if(!err){
      var user = {username : username, password: password, email : email,
	uid: online.length};
      db.collection(username, function(error, userCollection){
         db.collection(username+ 'TODO', function(error, collectiontodo){         
	 });
	 db.collection(username+ 'HOME', function(error, collectionhome){
	 });
 	 userCollection.insert({username: username, password: password,
	   email: email, uid: online.length});
      });
      cb(undefined, user);
    }
    else{
      cb(err);
    }
  });      
}
//this should be called to add a database that will store all of the users
//planners such as cs 326, cs 250 we should also verify that two
//planners of the exact same name haven't been added
exports.addHomeModule = function (username, nameOfModule, cb) {
  db.open(function(err, db){
    if(!err){
      db.collection(username+nameOfModule, function(err, collectionref){
	if(!err){
          cb(err);
	}
	else{
	  db.createCollection(username+nameOfModule);
	}
      });
    }
  });
}	

//this will remove a planner such as cs 326 and cs 250
exports.removeHomeModule = function (user, nameOfModule) {

}

//this should be called to create a new page module database that is specific
//to a user and one of their planners. The newPageModule will be the name of
//the new database and the pageModuleData will be the data you store in that
//newPageModule such as any notes you have or maybe a link. In addition,
//this should make sure that the module hasn't already been added   
exports.addPageModule = function (user, nameOfModule, newPageModule, 
	pageModuleData) {

}
//this should be called to edit a pageModule with the new pageModule.
exports.editPageModule = function (user, nameOfModule, pageModule, 
	pageModuleData){

}

//this should remove a specified pageModule and all data associated with it 
exports.removePageModule = function (user, nameOfModule, pageModule){
  
}

