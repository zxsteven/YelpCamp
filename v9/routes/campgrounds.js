var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");

//Index - List all Campgrounds
router.get('/', function(req, res){
  //Get all campgrounds from db
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user});
    }
  });
});

//Create - Add campground to database
router.post('/', isLoggedIn, function(req, res){
  var name = req.body.name,
      image = req.body.image,
      desc = req.body.description,
      author = {
        id: req.user._id,
        username: req.user.username
      },
      newCampground = {name:name, image:image, description:desc, author:author};
  // Create a new campround and save to a DB
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      //Redirect back to campgrounds page
      res.redirect('/campgrounds');
    }
  });
});

//New - Show form to create a new campground
router.get('/new', isLoggedIn, function(req, res){
  res.render('campgrounds/new');
});

//Show - Show more info about one campground
router.get('/:id', function(req, res){
  //Find campground with provided id
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      //render template with that campground
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;