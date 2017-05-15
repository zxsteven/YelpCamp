var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var campgrounds = [
      {name: 'Salmon Creek', image: 'https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg'},
      {name: 'Granite Hill', image: 'https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg'},
      {name: 'Mountain Goat"s Rest', image: 'https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg'}
];

app.get('/', function(req, res){
  res.render("landing");
});

app.get('/campgrounds', function(req, res){
  res.render('campgrounds', {campgrounds:campgrounds});
});

app.post('/campgrounds', function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name:name, image:image};
  campgrounds.push(newCampground);
  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req, res){
  res.render('new');
});

app.listen(process.env.PORT, process.env.IP, function(){
  console.log('Server Started!');
});