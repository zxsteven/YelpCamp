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
      image: "https://cdn.images.express.co.uk/img/dynamic/80/590x/96063809-415737.jpg",
      description: 'I saw a dog here once.'
    },
    {
      name: 'Summer Camp', 
      image: "https://buzzoye.pk/media/uploads/83/56cb00df74bc7.jpg",
      description: "Fell off twice, didn't even die."
    }
  ];

function seedDB(){
  //Remove campgrounds
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    }
    console.log('Seeded');
        });
      }
module.exports = seedDB;