var express = require('express');
var router = express.Router();
var currentPlanner = undefined;
var userlib = require('../lib/user');

/*all routes for user home*/


//if they try to type in /users it will redirect them to users/home
router.get('/', function(req, res){
  res.redirect('/users/home');
});

router.get('/home', function(req,res){

  var user = req.session.user;
  if(user === undefined) {
      res.redirect('/login');
  }
  else{
    res.sendFile('home.html', {root:"public/views"});
  }
  
});

//this is the users home where all of the users planners and todo list will
//be displayed
router.get('/home', function(req, res) {
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
	   res.json({"err":errorMessage,"plannerList": userHomeModules, 
	     "todo": todo});
        // res.render('home', {title : 'Welcome to Plannit', username : 
	//user.username,  listOfModules : userHomeModules, data: todo,
        //error : errorMessage});
        // todo : user.todo});
         });//END
         }
         });
    }
  
});

router.get('/todoRemove', function(req, res){
  var user = req.session.user;
  if(user === undefined){
    res.redirect('/login');
  }
  else{
    var entry = [];
    entry.push(req.body.Month);
    entry.push(req.body.Day);
    entry.push(req.body.Year);
    entry.push(req.body.Time);
    entry.push(req.body.Info);
    userlib.todoRemove(user.username, entry);
    res.redirect('/users/home');
  }
});

router.get('/todoAdd', function(req, res){
  var user = req.session.user;
  if(user === undefined){
    res.redirect('/login');
  }
  else{
    if(req.body.Info === null || req.body.Time === null){
      req.flash('error', 'please fill in all fields');
      res.redirect('/users/home');
    }
    else{
      var arrayOfDates = [];
      var round = Math.round; //This will be used to convert strings to int.
      var month = round(req.body.Month);
      var day = round(req.body.Day);
      var year = round(req.body.Year);
      arrayOfDates.push(month);
      arrayOfDates.push(day);
      arrayOfDates.push(year);
      arrayOfDates.push(req.body.Time);
      arrayOfDates.push(req.body.Info);
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
    userlib.addHomeModule(user.username, req.body.planner, function(err){
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
  var user = req.session.user;
  if(user === undefined) {
      res.redirect('/login');
  }
  else{
    userlib.removeHomeModule(user.username, req.body.planner);
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
	  if(listOfModule[i].module === req.body.Module){
	    req.flash('moduleExists','section already exists');
	    res.redirect('/users/currentHomeModule');
	    redirected = true;
	  }
	}	 
    if(redirected === false){
      userlib.addPageModule(user.username, req.body.Module, currentPlanner,
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
    userlib.removePageModule(user.username, currentPlanner, req.body.Module);
    res.redirect('/users/currentHomeModule');
  }
});



router.get('/addModuleData', function(req,res){
  var user = req.session.user;
  if(user === undefined){
    res.redirect('/login');
  }
  else {
     
   if(req.body.data === null){
      req.flash('moduleExists','no data entered');
      res.redirect('/users/currentHomeModule');
   }

   else{
    if("UsefulLinks" === req.body.Module){
      userlib.addModuleData(user.username, currentPlanner, req.body.Module, 
      req.body.data, function(err){   
      if(err){ 
        console.log(err);}
      }); 
    }
    if("UpcomingEvents" === req.body.Module){
	var arrayOfEvent= [];
	arrayOfEvent.push(req.body.Month);
	arrayOfEvent.push(req.body.Day);
	arrayOfEvent.push(req.body.Year);
	arrayOfEvent.push(req.body.Time);
	arrayOfEvent.push(req.body.Info);
     userlib.addModuleData(user.username, currentPlanner, req.body.Module,
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
    if(req.body.Module === "UsefulLinks"){
      userlib.removeModuleData(user.username, currentPlanner, req.body.Module,
	req.query.entry);
    }
    if(req.query.Module === "UpcomingEvents"){
      var arrayOfEvent = [];
      arrayOfEvent.push(req.body.Month);
      arrayOfEvent.push(req.body.Day);
      arrayOfEvent.push(req.body.Year);
      arrayOfEvent.push(req.body.Time);
      arrayOfEvent.push(req.body.Info);
     userlib.removeModuleData(user.username, currentPlanner, req.body.Module,
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
    userlib.editPageModule(user.username, currentPlanner, req.body.Module,
	req.body.comment, function(err){
      if(err){console.log(err);}
    });    
 
   
    res.redirect('/users/currentHomeModule');
  }
});

router.get('/currentHomeModule', function(req,res){
  var user = req.session.user;

  if(user === undefined) {
    res.redirect('/login');
  }
  else{
    res.sendFile('prettyModule.html', {root: "public/views"});
  }
  
});

//this route will display the page for one of your planners like cs 326
//it will render the module.ejs which will display 
router.get('/currentHomeModuleData', function(req,res){
  res.json({"note": "HAHAHAH"});
  return;
  var user = req.session.user;
  var errorMessage = req.flash('moduleExists') || '';
  
  if(currentPlanner === null || req.body.planner !== undefined){
    currentPlanner = req.body.planner;
  }
  //call this everytime to verify the user is logged in
  if(user === undefined) {
    res.redirect('/login');
  }
  else{
    userlib.listPageModules(user.username, currentPlanner,   
    function(listOfModule, data){  
      res.json({"message": errorMessage,"listOfModules": listOfModule, 
	"data": data});
      //res.render('module', {planner : currentPlanner, 
	//  listOfModules : listOfModule, data: data, message: errorMessage});
    });

 
  }
});
module.exports = router;
