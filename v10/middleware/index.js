var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
};

middlewareObj.checkOwner = function (req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCamp){
      if(err){
        res.redirect('back');
      } else {
        if(foundCamp.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
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
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};

module.exports = middlewareObj;