var express = require('express');
var router = express.Router();

var userlib = require('../lib/user');

//typing in the name of site will bring you to login page
router.get('/', function(req, res){
  res.redirect('/login');
});

router.get('/login', function(req, res) {
   var message = req.flash('auth') || '';
   var user = req.session.user;
   userlib.isOnline(user, function(users, cb){
     if(users !== undefined){
     //If it is defined we check the user.
       res.redirect('/users/home');
     }
     else{
       res.render('login', {title : 'Plannit', message: message});
     }
   });
   
});

router.post('/login/auth', function(req, res){
   console.log(req.query.username);
   if(req.query.username === "" || req.query.password === "" ||
      req.query.username === undefined ||
      req.query.password === undefined){
     req.flash('auth', 'please fill in all field');
     res.redirect('/login');
   }

   else{
     userlib.isUser(req.query.username, function(err, user){
	if(err === undefined){
	  if(req.query.password === user.password){
	    res.redirect('/user/home');
	  }
	  else{
	    req.flash('auth', 'incorrect password');
	    res.redirect('/login');
	  }
	}
	else{
	  req.flash('auth', 'user does not exist');
	  res.redirect('/login');
	}	
     });
   }
});


//this will display the sign up page for new users
router.get('/login/newUser', function(req, res){
   var message = req.flash('add') || '';
   res.render('addUser',{title: 'NewUser', message: message });  
});


////////////////////////////////////this one
//this will be called when the form has been filled out so that we can 
//add a new user, this function should redirect to /users/home once the user
//has been created otherwise send us back to newUser page
router.get('/login/addNewUser', function(req, res){
  if(req.query.username === "" || req.query.password === "" ||
	req.query.verifyPassword === "" || req.query.email === ""){
    req.flash('add', 'Please fill in all fields');
    res.redirect('/login/newUser');
  }
  else{
    if(req.query.password !== req.query.verifyPassword){
      req.flash('add', 'Passwords do not match');
      res.redirect('/login/newUser');
    }
    else{
      userlib.isUser(req.query.username, function(err){
 	if(err !== undefined){
	  req.flash('add', err);
	  res.redirect('/login/newUser');
 	}
	else{
	  userlib.addNewUser(req.query.username, req.query.password,
		req.query.email, function(err, user){	  
	    if(err === undefined){
	      userlib.addOnline(user);
	      res.redirect('/users/home');
	    }
	    else{
	      req.flash('add', err);
	      res.redirect('/login/newUser');
	    }
	  });
	}
      });
    }
  }
});

module.exports = router;
