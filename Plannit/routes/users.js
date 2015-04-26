var express = require('express');
var router = express.Router();
var currentPlanner = undefined;
var userlib = require('../lib/user');

/*all routes for user home*/


//if they try to type in /users it will redirect them to users/home
router.get('/', function(req, res){
  res.redirect('/users/home');
});

//this is the users home where all of the users planners and todo list will
//be displayed
router.get('/home', function(req, res, next) {
  //this is used to check if user is online
  var user = req.session.user;
  var errorMessage = req.flash('error') || '';

  if(user === undefined) {
      res.redirect('/login');
  }  
    else{
        //this will render the users home page and show all modules associated
  	//with this particular user such as cs 326 or cs 250 it will also
  	//show their to-do list
         userlib.todoSorted(user.username, function(err, todo){
           if(err){
             res.redirect('/login');
           }
           else{
         userlib.listHomeModule(user.username, function(userHomeModules){       
	 res.render('home', {title : 'Welcome to Plannit', username : 
	user.username,  listOfModules : userHomeModules, data: todo,
        error : errorMessage});
        // todo : user.todo});
         });//END
         }
         });
    }
  
});

router.get('/todoAdd', function(req, res){
  var user = req.session.user;
  if(user === undefined){
    res.redirect('/login');
  }
  else{
    if(req.query.data === null){
      //Add some flash messages in which not enough data or something.
      res.redirect('/users/home');
    }
    else{
      var arrayOfDates = [];
      //arrayOfDates.push(req.query.Month);
      //arrayOfDates.push(req.query.Day);
      //arrayOfDates.push(req.query.Year);
      //arrayOfDates.push(req.query.time);
      //arrayOfDates.push(req.query.comment);
      var round = Math.round; //This will be used to convert strings to int.
      var month = round(req.query.Month);
      var day = round(req.query.Day);
      var year = round(req.query.Year);
      var time = round(req.query.time);
      arrayOfDates.push(month);
      arrayOfDates.push(day);
      arrayOfDates.push(year);
      arrayOfDates.push(time);
      arrayOfDates.push(req.query.comment);
      userlib.todoAdd(user.username, arrayOfDates, function(err, list){
        if(err){
          console.log(err);
        }
      });
      res.redirect('/users/home');
    }
  }
});

//this will call a function in userlib to add to the users home modules db
router.get('/addHomeModule', function(req, res){
  var user = req.session.user;
  if(user === undefined) {
	  
            res.redirect('/login');
  }
  else{
    userlib.addHomeModule(user.username, req.query.planner, function(err){
	if(err === undefined){
	  res.redirect('/users/home');
	}
	else{
	  req.flash('error', err);
	  res.redirect('/users/home');
	}
    });
  }
});

//this will call a function in userlib to remove a module from the users
//home modules db
router.get('/removeHomeModule',function(req, res){
//
  var user = req.session.user;
  if(user === undefined) {
      res.redirect('/login');
  }
  else{
    userlib.removeHomeModule(user.username, req.query.planner);
    res.redirect('/users/home');
  }
});


router.get('/addPageModule', function(req,res){

var redirected = false;
var user = req.session.user;
  if(user === undefined){
     res.redirect('/login');
   }
  else{
    userlib.listPageModules(user.username, currentPlanner,
      function(listOfModule, data){
        for(var i = 0; i < listOfModule.length; i++){
	console.log('this ' +listOfModule[i].module + req.query.Module);
	  if(listOfModule[i].module === req.query.Module){
	    req.flash('moduleExists','section already exists');
	    res.redirect('/users/currentHomeModule');
	    redirected = true;
	  }
	}	 
    if(redirected === false){
      userlib.addPageModule(user.username, req.query.Module, currentPlanner,
        function(err){ console.log(err);});

      res.redirect('/users/currentHomeModule');
    }
    });
  }  
});

router.get('/removePageModule', function(req, res){
  var user = req.session.user;

  if(user === undefined){
     res.redirect('/login');
  }
  else{
    userlib.removePageModule(user.username, currentPlanner, req.query.Module);
    res.redirect('/users/currentHomeModule');
  }
});



router.get('/addModuleData', function(req,res){
  var user = req.session.user;
  if(user === undefined){
    res.redirect('/login');
  }
  else {
   console.log(req.query.Module);
     
   if(req.query.data === null){
      req.flash('moduleExists','no data entered');
      res.redirect('/users/currentHomeModule');
   }

   else{
    console.log(user.username + currentPlanner + req.query.Module + ' ' +
	req.query.data);
    if("UsefulLinks" === req.query.Module){
      userlib.addModuleData(user.username, currentPlanner, req.query.Module, 
      req.query.data, function(err){   
      if(err){ 
        console.log(err);}
      }); 
    }
    if("UpcomingEvents" === req.query.Module){
	var arrayOfEvent= [];
	arrayOfEvent.push(req.query.Month);
	arrayOfEvent.push(req.query.Day);
	arrayOfEvent.push(req.query.Year);
	arrayOfEvent.push(req.query.time);
	arrayOfEvent.push(req.query.comment);
     userlib.addModuleData(user.username, currentPlanner, req.query.Module,
      arrayOfEvent, function(err){
      if(err){
        console.log(err);}
      });
      
    }
    res.redirect('/users/currentHomeModule');
   }

}

});

router.get('/removeModuleData', function(req,res){
  var user = req.session.user;
  if(user === undefined){
     res.redirect('/login');
  }
  else{
    if(req.query.Module === "UsefulLinks"){
      userlib.removeModuleData(user.username, currentPlanner, req.query.Module,
	req.query.entry);
    }
    if(req.query.Module === "UpcomingEvents"){
      var arrayOfEvent = [];
      arrayOfEvent.push(req.query.month);
      arrayOfEvent.push(req.query.day);
      arrayOfEvent.push(req.query.year);
      arrayOfEvent.push(req.query.time);
      arrayOfEvent.push(req.query.info);
     userlib.removeModuleData(user.username, currentPlanner, req.query.Module,
        arrayOfEvent);     
     
    }
       res.redirect('/users/currentHomeModule');    
  }
});

router.get('/editPageModule', function(req,res){

var user = req.session.user;
  if(user === undefined){
     res.redirect('/login');
  }
  else{	
    userlib.editPageModule(user.username, currentPlanner, req.query.Module,
	req.query.comment, function(err){
      if(err){console.log(err);}
    });    
 
   
    res.redirect('/users/currentHomeModule');
  }
});


router.get('/editToDoList', function(req, res){
 //call this everytime to verify the user is logged in
});

//this route will display the page for one of your planners like cs 326
//it will render the module.ejs which will display 
router.get('/currentHomeModule', function(req,res){
  var user = req.session.user;
  var errorMessage = req.flash('moduleExists') || '';
  
  if(currentPlanner === null || req.query.planner !== undefined){
    currentPlanner = req.query.planner;
  }
  //call this everytime to verify the user is logged in
  if(user === undefined) {
    res.redirect('/login');
  }
  else{
    userlib.listPageModules(user.username, currentPlanner,   
    function(listOfModule, data){  
      res.render('module', {planner : currentPlanner, 
	  listOfModules : listOfModule, data: data, message: errorMessage});
    });

 
  }
});
module.exports = router;
