w
//initialize mongodb and get the database of users
//every user will have a username, password, email and a uid that we 
//will set the value of

var mongo = require('mongodb');
//var connection = new Mongo();
var Server = mongo.Server;
var Db = mongo.Db;
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('users', server);
db.open(function(err, db){
});

//this will confirm whether a user exists or not

exports.isUser = function (username, cb){
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

//this should be called to add user to users database
exports.addNewUser = function (username, password, email, cb){
      var user = {username : username, password: password, email : email};
      db.collection(username, function(error, userCollection){
        userCollection.insert({username: username, password: password,
	   email: email});
      
	  db.createCollection(username +'TODO', function(error, collectiontodo){
            db.createCollection(username+'HOME', function(error, 
		collectionhome){
	        db.close();
	     });	
	  });
       });
       cb(undefined, user);      
}

exports.listHomeModule = function(username, cb){
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

//this should be called to add a database that will store all of the users
//planners such as cs 326, cs 250 we should also verify that two
//planners of the exact same name haven't been added
//We should take in a callback that just checks if an error occurred when
//making a home module.
exports.addHomeModule = function (username, nameOfModule, cb) {
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
}	

//this will remove a planner such as cs 326 and cs 250
exports.removeHomeModule = function (username, nameOfModule) {
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
		     newModuleCollection.drop(function(err){
		     });
		  });
		}
		//this will remove the planner collection
		planner.drop(function(err){
		});
	    }
	  });
        }
      });
     });
}

//this should be called to edit a pageModule with the new pageModule.
exports.editPageModule = function (username, nameOfModule, pageModule,
        pageModuleData, cb){
      db.collection(''+username+ nameOfModule + pageModule,
        function(error, pageCollection){
        if(!error){
          if(pageModule === 'Notes'){
            //Check if text field is empty
	    var cursor = pageCollection.find();
            cursor.toArray(function(err, arrayOfModules){
	    if(arrayOfModules.length === 0){
	      pageCollection.insert({text: pageModuleData});
	    }
            //Update text
            else{
              pageCollection.update({text: arrayOfModules[0].text},
		{$set: {text: pageModuleData}});
            }
		cb(undefined);
	    });
          }
          if(pageModule === 'Budget'){
            //Checks if text field is empty
            if(pageCollection.find() === null){
              pageCollection.insert({text: dpageModuleData});
	    }
            //Update text
            else{
              pageCollection.update({text: pageModuleData});
	    }
	    cb(undefined);
          }

          //if(pageModule === 'Upcoming Events'){

            //pageCollection.update({uid: pageModuleData[5]}, {$set:{month: pageModuleData[0]
            //,day: pageModuleData[1], year: pageModuleData[2], time: pageModuleData[3],
            //info: pageModuleData[4]}});
	    //cb(undefined);
          //}
        }//if error
        else{
          cb(username + nameOfModule + pageModule +' couldnt be accessed' + error);
        }
      });
}

   
//this will return a list of all modules on a page for a planner and it
//will return the data associated with each module as well.
//The list of page modules will be stored in one array and the other array
//will store the associated data for each page module as an array  
exports.listPageModules = function (username, nameOfPlanner, cb){
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
		var oneCB = 0;
		if(arrayOfModules.length !== 0){
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
		     if(i === arrayOfModules.length && oneCB === 0){
                       cb(arrayOfModules, data);
			oneCB++;
                     }
		    });		     
		  });
		}//for	
		}
		else{
		  cb(arrayOfModules, data);
		}
	    }
	  });
       });
}

exports.addPageModule = function(username, nameOfModule, newPageModule, cb){
      db.collection(username+newPageModule, function(err, plannerCollection){
        if(!err){
	  plannerCollection.insert({module: nameOfModule});
	  db.createCollection(username+newPageModule+nameOfModule, 
		function(error, newCollection){
          //if(error){
           // cb('Aww the collection wasnt made');
          //}
	 
	  cb(undefined);
         });
        }
        else{
	  cb('Welp we broke their ' + nameOfModule);
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
        db.collection(username+ nameOfModule + newPageModule, 
	  function(error, pageCollection){
        if(!error){

         //Do not need 'notes' or 'budget'
	  if(newPageModule === 'UpcomingEvents'){
	    pageCollection.insert({month: pageModuleData[0], day: pageModuleData[1]
		, year: pageModuleData[2], time: pageModuleData[3],
		info: pageModuleData[4]});
	  }
	  if(newPageModule === 'usefullinks'){
	    pageCollection.insert({link: pageModuleData});
	  }
	  
        }
        else{
          cb(username + nameOfModule + newPageModule +' couldnt be accessed');
        }
      });
}

//this should remove a specified pageModule and all data associated with it 
exports.removePageModule = function (username, nameOfModule, pageModule){
	console.log(username+nameOfModule+pageModule);
        db.collection(username+nameOfModule,function(err, plannerCollection){
          plannerCollection.remove({module: pageModule});
	db.collection(username+nameOfModule+pageModule, function(err, 
		plannerModule){
	    plannerModule.drop(function(err){
	    });
	  });
	});

}

exports.todoAdd = function(username, data, cb){
  //NOTE: THIS IS STILL UNTESTED
  //data will be an array of data that follows the same format
  //of the array pageModuleData for upcoming events.
  //We will callback a function for error checking and for the sorted array.
  //When the data gives us the month, it'll be in string
  //format, we'll deal with sorting by converting it to an
  //int manually when we insert it into the database.
  //Then proceed to sort by year first, then month, then day
  //and then time. Obviously this'll have to sort by least to greatest.
  //If we also include previously completed objectives in the todo list
  //we'll add in a field called complete, 1 being finished, 0 meaning 
  //not finished. If you wanted to make it more technical you can try
  //to come up with a valid hash function to sort by one field instead of
  //five. Hash functions including prime factorization, concatenating dates,
  //adding dates together, etc. will not be valid for their own special
  //reasons.
  db.collection(username+'TODO', function(err, todo){
    if(!err){
      if(data[0] === 'January'){
        todo.insert({month: 1, day: data[1], year: data[2], time: data[3],
		   info: data[4], complete: 0});
      }
      else if(data[0] === 'Febuary'){
	//Change this to 'February' once someone changes module.ejs
        //dropdown to 'February'.
        todo.insert({month: 2, day: data[1], year: data[2], time: data[3],
		  info: data[4], complete: 0});
      }
      else if(data[0] === 'March'){
	todo.insert({month: 3, day: data[1], year: data[2], time: data[3],
		  info: data[4], complete: 0});
      }
      else if(data[0] === 'April'){
	todo.insert({month: 4, day: data[1], year: data[2], time: data[3],
		  info: data[4], complete: 0});
      }
      else if(data[0] === 'May'){
	todo.insert({month: 5, day: data[1], year: data[2], time: data[3],
		  info: data[4], complete: 0});
      }
      else if(data[0] === 'June'){
	todo.insert({month: 6, day: data[1], year: data[2], time: data[3],
		  info: data[4], complete: 0});
      }
      else if(data[0] === 'July'){
	todo.insert({month: 7, day: data[1], year: data[2], time: data[3],
		  info: data[4], complete: 0});
      }
      else if(data[0] === 'August'){
	todo.insert({month: 8, day: data[1], year: data[2], time: data[3],
		  info: data[4], complete: 0});
      }
      else if(data[0] === 'September'){
	todo.insert({month: 9, day: data[1], year: data[2], time: data[3],
		  info: data[4], complete: 0});
      }
      else if(data[0] === 'October'){
	todo.insert({month: 10, day: data[1], year: data[2], time: data[3],
		  info: data[4], complete: 0});
      }
      else if(data[0] === 'November'){
	todo.insert({month: 11, day: data[1], year: data[2], time: data[3],
		  info: data[4], complete: 0});
      }
      else if(data[0] === 'December'){
	todo.insert({month: 12, day: data[1], year: data[2], time: data[3],
		  info: data[4], complete: 0});
      }
      todo.find().sort({year:1, month:1, day:1, time:1}, function(error, list){
	if(!error){
	  list.toArray(function(anotherError, sortedlist){
	    if(!anotherError){
	      cb(undefined, sortedlist);
            }
            else{
              cb('Error converting to array', undefined);
            }
          });
        }
	else{
	  cb('Trouble sorting', undefined);
        }
      });
    }
    else{
      cb('Error opening the todo', undefined);
    }
  });
}

exports.todoSorted = function(username, cb){
  //NOTE: THIS IS STILL UNTESTED
  //Gives a callback giving an error message, if any, and
  //the sorted array. The difference between this function
  //and the last is that this function does not add to
  //the username+'TODO' collection it just sorts and gives
  //it back to you. The callback format follows the same
  //format as before: cb(error, array)
  db.collection(username+'TODO', function(err, todo){
    if(!err){
      todo.find().sort({year:1, month:1, day:1, time:1}, function(error, list){
	if(!error){
	  list.toArray(function(anotherError, sortedlist){
	    if(!anotherError){
	      cb(undefined, sortedlist);
            }
            else{
              cb('Error converting to array', undefined);
            }
          });
        }
	else{
	  cb('Trouble sorting', undefined);
        }
      });
    }
    else{
      cb('Trouble opening up TODO list', undefined);
    }
  });
}
