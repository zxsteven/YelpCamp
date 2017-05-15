var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                  = require("./models/user"),
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    seedDB                = require("./seeds");

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
seedDB();

//Passport Config
app.use(require("express-session")({
  secret: 'Catdog is a bully!!',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res){
  res.render("landing");
});

//Index - List all Campgrounds
app.get('/campgrounds', function(req, res){
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
app.post('/campgrounds', function(req, res){
  var name = req.body.name,
      image = req.body.image,
      desc = req.body.description,
      newCampground = {name:name, image:image, description:desc};
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
app.get('/campgrounds/new', function(req, res){
  res.render('campgrounds/new');
});

//Show - Show more info about one campground
app.get('/campgrounds/:id', function(req, res){
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

//Comments-------------------------------------------

//New Comment
app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res){
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
app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
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

//Auth Routes----------------------------------------

app.get('/register', function(req, res) {
    res.render('register');
});

app.post('/register', function(req, res) {
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

//Login Routes---------------------------------------
app.get('/login', function(req, res) {
    res.render('login');
});

//Login logic
app.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
  }) , function(req, res){
});

//Logout
app.get('logout', function(req, res) {
  req.logout();
  res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

app.listen(process.env.PORT, process.env.IP, function(){
  console.log('Server Started!');
});