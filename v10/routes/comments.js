var express    = require("express");
var router     = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware");


//New Comment
router.get('/new', middleware.isLoggedIn, function(req, res){
  //Find campground by Id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

//Post Comment
router.post('/', middleware.isLoggedIn, function(req, res){
  //Lookup campground
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      //Create comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

//Edit Comment 
router.get('/:comment_id/edit', middleware.checkComment, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect('back');
    } else {
      res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
    }
  });
});

//Update Comment 
router.put('/:comment_id', middleware.checkComment, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, function(err, updatedComments){
    if(err){
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

//Delete Comment
router.delete('/:comment_id', middleware.checkComment, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});


module.exports = router;