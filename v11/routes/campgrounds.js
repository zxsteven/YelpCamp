var express    = require("express");
var router     = express.Router({
  mergeParams: true
});
var Campground = require("../models/campground");
var middleware = require("../middleware");

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
router.post('/', middleware.isLoggedIn, function(req, res){
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
      res.redirect('/campgrounds/' + newlyCreated._id);
    }
  });
});

//New - Show form to create a new campground
router.get('/new', middleware.isLoggedIn, function(req, res){
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

//Edit - Change campground post
router.get('/:id/edit', middleware.checkOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp){
        res.render('campgrounds/edit', {campground: foundCamp});
  });
});

//Update - Save edit changes
router.put('/:id', middleware.checkOwner, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
    if(err){
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
      console.log(updatedCamp);
    }
  });
});

//Destroy - Delete camp
router.delete('/:id', middleware.checkOwner, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;