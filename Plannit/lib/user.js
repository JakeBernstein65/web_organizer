
//initialize mongodb and get the database of users
//every user will have a username, password, email and a uid that we 
//will set the value of

var mongo = require('mongodb');
//var connection = new Mongo();
var Server = mongo.Server;
var Db = mongo.Db;
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('users', server);

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

//this should be called to add user to users database
exports.addNewUser = function (username, password, email, cb){
  db.open(function(err, db){
    if(!err){
      var user = {username : username, password: password, email : email};
      db.collection(username, function(error, userCollection){
        userCollection.insert({username: username, password: password,
	   email: email});
      });
	  db.createCollection(username +'TODO', function(error, collectiontodo){
	  });
         db.createCollection(username+'HOME', function(error, collectionhome){
	  });
      cb(undefined, user);
    }
    else{
      cb(err);
    }
  });      
}

exports.listHomeModule = function(username, cb){
  db.open(function(err, db){
    if(!err){
      db.collection(username+'HOME', function(err, collectionref){
	if(!err){
	  var cursor = collectionref.find();
	  cursor.toArray(function(err, arrayOfHomeModules){
	    if(err){
	      console.log(err);
	    }
	    else{
	      cb(arrayOfHomeModules);
	    }
	
	  });
	}
      });
     }
  });
}

//this should be called to add a database that will store all of the users
//planners such as cs 326, cs 250 we should also verify that two
//planners of the exact same name haven't been added
//We should take in a callback that just checks if an error occurred when
//making a home module.
exports.addHomeModule = function (username, nameOfModule, cb) {
  db.open(function(err, db){
    if(!err){
      db.collection(username+ 'HOME', function(err, homeCollection){
        if(!err){
	  homeCollection.findOne({planner : nameOfModule}, function(err, stuff){
	    console.log(stuff);
	    if(!err && stuff === null){
	      homeCollection.insert({planner: nameOfModule});
	      cb(undefined);
	    }
	    else{
	      cb(nameOfModule + ' already exists');
	    }
	  });
	}
	else{
	  cb(user+'HOME' + 'couldnt be accessed'); 
	}
      });
    }//if err
    else{
      cb('Trouble opening database');
    }
  });
}	

//this will remove a planner such as cs 326 and cs 250
exports.removeHomeModule = function (username, nameOfModule) {
  db.open(function(err, db){
    if(!err){
      db.collection(username+'HOME', function(err, homecollection){
      db.collection(username+nameOfModule, function(err, collectionref){
	if(!err){
	  homecollection.remove({planner: nameOfModule});
	  //db.dropCollection(user+nameOfModule, function(err, result){
	  
        }
      });
     });
    }
  });
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

