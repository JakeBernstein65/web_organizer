
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
	  cb(username+'HOME' + 'couldnt be accessed'); 
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
      db.collection(username+'HOME', function(err, homeCollection){
      db.collection(username+nameOfModule, function(err, planner){
	if(!err){
	  homeCollection.remove({planner: nameOfModule});
	  var cursor = planner.find();
          cursor.toArray(function(err, arrayOfModules){
            if(err){
		console.log(err);	    
	    }
	    else{
		//this will remove all page module collections such as notes
		for(var i = 0; i < arrayOfModules.length; i++){
		  var moduleCollection = username + nameOfModule + 
			arrayOfModules[i].module;
		  db.collection(moduleCollection, function(err, newModuleCollection){
		     newModuleCollection.remove();
		  });
		}
		//this will remove the planner collection
		planner.remove();
	    }
	  });
        }
      });
     });
    }
  });
}

//this should be called to edit a pageModule with the new pageModule.
exports.editPageModule = function (username, nameOfModule, pageModule,
        pageModuleData, cb){

  db.open(function(err, db){
    if(!err){

      db.collection(username+ nameOfModule + pageModule,
        function(error, pageCollection){

        if(!error){
	  console.log(pageModule);
          if(pageModule === 'Notes'){
            //Check if text field is empty
            console.log('here');
	    if(pageCollection.find() === null)
             pageCollection.insert({text: pageModuleData});

           //Update text
            else
             pageCollection.update({text: pageModuleData});

           }
          if(pageModule === 'Budget'){
          //Checks if text field is empty
           if(pageCollection.find() === null)
            pageCollection.insert({text: pageModuleData});

          //Update text
           else
            pageCollection.update({text: pageModuleData});
          }

          if(pageModule === 'Upcoming Events'){

          pageCollection.update({uid: pageModuleData[5]}, {$set:{month: pageModuleData[0]
          ,day: pageModuleData[1], year: pageModuleData[2], time: pageModuleData[3],
           info: pageModuleData[4]}});
          }
        }
        else{
          cb(username + nameOfModule + pageModule +' couldnt be accessed' + error);
        }
      });
    }//if err
    else{
      cb('Trouble opening database' + err);
    }

  });
}

   
//this will return a list of all modules on a page for a planner and it
//will return the data associated with each module as well.
//The list of page modules will be stored in one array and the other array
//will store the associated data for each page module as an array  
exports.listPageModules = function (username, nameOfPlanner, cb){
  db.open(function(err, db){
    if(!err){
       db.collection(username+ nameOfPlanner,function(err, plannerCollection){
	  var cursor = plannerCollection.find();
          cursor.toArray(function(err, arrayOfModules){
            if(err){
                console.log(err);
		cb(err);
            }
            else{
		//data will be the array that store all of the data
		var data = [];
		
	        for(var i = 0; i < arrayOfModules.length; i++){
		  var pageModule = username + nameOfPlanner + 
			arrayOfModules[i].module;
		  db.collection(pageModule, function(err, moduleCollection){
		     var cursor = moduleCollection.find();
	             cursor.toArray(function(err, arrayOfData){
           	       if(err){
               	   	 console.log(err);
            	       }
            	       else{
			 data.push(arrayOfData);
		       }
		     });
		  });
		}//for
		
		//this will return an array of all page modules for a certain
		//planner and then the data for each of those modules stored
		// as an array. All fields in the data array are also arrays
		cb(arrayOfModules ,data);
	    }
	  });
       });
    }//if err
    else{
      cb('Trouble opening database');
    }

  });

}

exports.addPageModule = function(username, nameOfModule, newPageModule, cb){
  db.open(function(err, db){
    if(!err){
      db.collection(username+newPageModule, function(err, plannerCollection){
        if(!err){
	  plannerCollection.insert({module: nameOfModule});
        }
        else{
	  cb('Welp we broke their ' + nameOfModule);
        }
      });
      db.createCollection(username+newPageModule+nameOfModule, function(err, 
                         newCollection){
     	if(err){
	  cb('Aww the collection wasnt made');
        }    
      });
    }
    else{
      cb('Something terrible happened with the database');
    }
  });
}

//this should be called to create a new page module database that is specific
//to a user and one of their planners. The newPageModule will be the name of
//the new database and the pageModuleData will be the data you store in that
//newPageModule such as any notes you have or maybe a link. In addition,
//this should make sure that the module hasn't already been added   
exports.addModuleData = function (username, nameOfModule, newPageModule, 
	pageModuleData, cb) {
  db.open(function(err, db){
    if(!err){
      //db.collection(username+ nameOfModule,function(err, plannerCollection){
	//plannerCollection.insert({module: newPageModule});
     // });
      db.collection(username+ nameOfModule + newPageModule, 
	function(err, pageCollection){
        if(!err){

         //Do not need 'notes' or 'budget'
	  if(newPageModule === 'upcoming events'){
	    pageCollection.insert({month: pageModuleData[0], day: pageModuleData[1]
		, year: pageModuleData[2], time: pageModuleData[3],
		info: pageModuleData[4]});
	  }
	  if(newPageModule === 'useful links'){
	    pageCollection.insert({link: pageModuleData});
	  }
	  
        }
        else{
          cb(username + nameOfModule + newPageModule +' couldnt be accessed');
        }
      });
    }//if err
    else{
      cb('Trouble opening database');
    }

  });  
}

//this should remove a specified pageModule and all data associated with it 
exports.removePageModule = function (username, nameOfModule, pageModule, cb){
  
}

