var express = require('express');
var router = express.Router();

/* GET home page. */

//typing in the name of site will bring you to login page
router.get('/', function(req, res){
  res.redirect('/login');
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Plannit' });
});


//this will display the sign up page for new users
router.get('/login/newUser', function(req, res){
  res.render('addUser',{title: 'NewUser' });  
});


////////////////////////////////////this one
//this will be called when the form has been filled out so that we can 
//add a new user, this function should redirect to /users/home once the user
//has been created otherwise send us back to newUser page
router.get('/addNewUser', function(req, res){
  //res.redirect('/users/home');
});

module.exports = router;
