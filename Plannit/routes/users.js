var express = require('express');
var router = express.Router();

var userlib = require('../lib/user');

//this function should be called before we render any view to ensure user
//if logged in
function auth(user){
  userlib.isOnline(user, function(userOnline) {
    if (userOnline === undefined) {
      req.flash('auth', 'Not logged in!');
      res.redirect('/login');
    }
  });
}

/*all routes for user home*/

//if they try to type in /users it will redirect them to users/home
router.get('/', function(req, res){
  res.redirect('users/home');
});

//this is the users home where all of the users planners and todo list will
//be displayed
router.get('/home', function(req, res, next) {
  //this is calling our auth function that will check to see if the user 
  //is online if he isn't the auth funtion will redirect to user login 
  //with message
  user = req.session.user;
  auth(user);

  //this will render the users home page and show all modules associated
  //with this particular user such as cs 326 or cs 250 it will also
  //show their to-do list
//   res.render('home', {title : 'Welcome to Plannit',
//		         listOfModules : user.modules,
// 			 todo : user.todo});
  
});

//this will call a function in userlib to add to the users home modules db
router.get('/addHomeModule', function(req, res){
  //call this everytime to verify the user is logged in
  auth(req.session.user);
  //userlib.addHomeModule(user, name of module)
});

//this will call a function in userlib to remove a module from the users
//home modules db
router.get('/removeHomeModule',function(req, res){
  //call this everytime to verify the user is logged in
  auth(req.session.user);
  //userlib.removeHomeModule(user, name of module);

});

router.get('/editToDoList', function(req, res){
 //call this everytime to verify the user is logged in
  auth(req.session.user);  
});

//this will call the remove online function in userlib and then redirect to
//the login page
router.get('/logout', function(req, res){
  var user = req.session.user;
  //call this everytime to verify the user is logged in 
  auth(req.session.user);
  //userlib.removeOnline(user);
  res.redirect('/login');
});

/*IMPORTANT REPLACE NAMEOFMODULE WITH VARIABLE FOR THE ACTUAL MODULE NAME LIKE CS 326*/
//this route will display the page for one of your planners like cs 326
//it will render the module.ejs which will display 
router.get('/nameOfModule', function(req,res){
  var user = req.session.user;
  //call this everytime to verify the user is logged in
  auth(req.session.user);

  //name of module will be replaced with the variable name we declare above
  res.render('module', {user : user,
			userPlanner : nameOfModule,});
});
module.exports = router;
