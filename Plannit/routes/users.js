var express = require('express');
var router = express.Router();
var currentPlanner = undefined;
var userlib = require('../lib/user');


var editNotesButton = "false";
/*all routes for user home*/


//if they try to type in /users it will redirect them to users/home
router.get('/', function(req, res){
  res.redirect('users/home');
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
         userlib.listHomeModule(user.username, function(userHomeModules){       
	 res.render('home', {title : 'Welcome to Plannit', username : 
	user.username,  listOfModules : userHomeModules, error : errorMessage});
        // todo : user.todo});
         });//END

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

var user = req.session.user;
  if(user === undefined){
     res.redirect('/login');
   }
  else{
    userlib.addPageModule(user.username, req.query.Module, currentPlanner, 
    function(err){ console.log(err);
    }); 
    res.redirect('/users/currentHomeModule');
  }  
});

router.get('/editPageModule', function(req,res){

var user = req.session.user;
  if(user === undefined){
     res.redirect('/login');
  }
  else{
    console.log(req.query.comment);	
    userlib.editPageModule(user.username, currentPlanner, req.query.Module,
	req.query.comment, function(err){
      if(err){console.log(err)}
    });    
  
    if(req.query.notesEdit !== null){
        editNotesButton = req.query.notesEdit;
    }
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
  if(currentPlanner === null || req.query.planner !== undefined){
    currentPlanner = req.query.planner;
  }
  //call this everytime to verify the user is logged in
  if(user === undefined) {
    res.redirect('/login');
  }
  else{
    if(req.query.notesEdit !== null){
	editNotesButton = req.query.notesEdit;
    }
  
    userlib.listPageModules(user.username, currentPlanner,   
    function(listOfModule, data){  
      res.render('module', {planner : currentPlanner, 
	  listOfModules : listOfModule, editNotes : editNotesButton});
  });
 
  }
});
module.exports = router;
