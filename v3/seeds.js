var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
      name: 'Daisy Mountain', 
      image: "http://i1.trekearth.com/photos/28591/mountain3.jpg",
      description: 'Guaranteed to never have to work again.'
    },
    {
      name: 'Dog Mountain', 
      image: "http://cdn.images.express.co.uk/img/dynamic/80/590x/96063809-415737.jpg",
      description: 'I saw a dog here once.'
    },
    {
      name: 'Summer Camp', 
      image: "http://buzzoye.pk/media/uploads/83/56cb00df74bc7.jpg",
      description: "Fell off twice, didn't even die."
    }
  ];

function seedDB(){
  //Remove campgrounds
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    }
    console.log('Removed campgrounds');
    
    //Add a few campgrounds
    data.forEach(function(seed){
      Campground.create(seed, function(err, campground){
        if(err){
          console.log(err);
        } else {
          console.log('Added campground');
          //Add a few comments
          Comment.create(
          {
            text: "This place is nice, but I wish there was WiFi!!!",
            author: 'Dave'
          }, function(err, comment){
            if(err){
              console.log(err);
            } else {
            campground.comments.push(comment);
            campground.save();
            console.log('Created new comment');
            }
          }
          );
        }
      });
    });
  });
}
module.exports = seedDB;