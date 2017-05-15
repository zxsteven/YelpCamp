var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB     = require("./seeds");

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
seedDB();

app.get('/', function(req, res){
  res.render("landing");
});

//INDEX - List all Campgrounds
app.get('/campgrounds', function(req, res){
  //Get all campgrounds from db
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render('index', {campgrounds:allCampgrounds});
    }
  });
});

//CREATE - Add campground to database
app.post('/campgrounds', function(req, res){
  var name = req.body.name,
      image = req.body.image,
      desc = req.body.description,
      newCampground = {name:name, image:image, description: desc};
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

//NEW - Show form to create a new campground
app.get('/campgrounds/new', function(req, res){
  res.render('new');
});

//SHOW - Show more info about one campground
app.get('/campgrounds/:id', function(req, res){
  //Find campground with provided id
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      //render template with that campground
      res.render('show', {campground: foundCampground});
    }
  });
});

app.listen(process.env.PORT, process.env.IP, function(){
  console.log('Server Started!');
});