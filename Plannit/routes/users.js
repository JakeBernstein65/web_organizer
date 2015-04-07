var express = require('express');
var router = express.Router();



//this function should be called before we render any view to ensure user
//if logged in
function auth(user){
  if (user === undefined || online[user.uid] === undefined) {
    req.flash('auth', 'Not logged in!');
    res.redirect('/user/login');
    return;
  }
}

//this ensures authentication and reroutes if needed
router.post('/auth', function(req, res) {
  // redirect if logged in:
  var user = req.session.user;

  // do the check as described in the `exports.login` function.
  if (user !== undefined && online[user.uid] !== undefined) {
    res.redirect('/user/main');
  }
  else {
    // Pull the values from the form.
    var username = req.body.username;
    var password = req.body.password;
    // Perform the user lookup.
    userlib.lookup(username, password, function(error, user) {
      if (error) {
        // If there is an error we "flash" a message to the
        // redirected route `/user/login`.
        req.flash('auth', error);
        res.redirect('/user/login');
      }
      else {
        req.session.user = user;
        // Store the user in our in memory database.
        online[user.uid] = user;
        // Redirect to main.
        res.redirect('/user/main');
      }
    });
  }
});

//this is the users home where all of the users planners and todo list will
//be displayed
router.get('/home', function(req, res, next) {
  //this is calling our auth function that will check to see if the user 
  //is online if he isn't the auth funtion will redirect to user login 
  //with message
  if(auth(req.session.user)){
 
  }
  else{
    res.render;
  }
});

module.exports = router;
