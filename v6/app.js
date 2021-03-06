var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    User                  = require("./models/user"),
    seedDB                = require("./seeds");

//Requiring Routes
var campgroundRoutes      = require("./routes/campgrounds"),
    commentRoutes         = require("./routes/comments"),
    indexRoutes           = require("./routes/index");

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
// seedDB(); Seed the Db

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

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.get('/', function(req, res){
  res.render("landing");
});

app.listen(process.env.PORT, process.env.IP, function(){
  console.log('Server Started!');
});