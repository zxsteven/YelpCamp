var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");


router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(user, err){
    if(err){
      console.log(err);
      res.render('register');
    }
    passport.authenticate('local')(req, res, function(){
      res.redirect('/campgrounds');
    });
  });
});

//Login
router.get('/login', function(req, res) {
    res.render('login');
});

//Login logic
router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
  }) , function(req, res){
});

//Logout
router.get('logout', function(req, res) {
  req.logout();
  res.redirect('/campgrounds');
});

module.exports = router;