var express = require('express');
var router = express.Router();

var userlib = require('../lib/user');

//typing in the name of site will bring you to login page
router.get('/', function(req, res){
  res.redirect('/login');
});

router.get('/login', function(req, res) {
   //console.log(req.session);
   var user = req.session; //Checks if req.session is defined
   if(user !== undefined){
   //If it is defined we check the user.
     user = req.session.user;
   }
   userlib.isUser(user, function(err){
     if(err !== undefined){
        res.render('login', { title: 'Plannit' });
     }
     else{
        res.redirect('/user/home');
     }
   });
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
  res.redirect('/users/home');
});

module.exports = router;
