var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash*('error', 'You need to be logged in to do that!!');
  res.redirect('/login');
};

middlewareObj.checkOwner = function (req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCamp){
      if(err){
        req.flash('error', 'Campground not found');
        res.redirect('back');
      } else {
        //Does the User own the camp?
        if(foundCamp.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that!!');
    res.redirect('back');
  }
};

middlewareObj.checkComment = function (req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        res.redirect('back');
      } else {
        //Does User own the comment?
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash('error', 'You don"t have permission to do that');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that!');
    res.redirect('back');
  }
};

module.exports = middlewareObj;