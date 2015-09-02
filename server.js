// require the path module
var path = require("path");
// require express and create the express app
var express = require("express");
var app = express();
// require mongoose and create the mongoose variable
var mongoose = require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose');
var UserSchema = new mongoose.Schema({
	name: String,
	age: Number,
	comment: String
})
var User = mongoose.model('User', UserSchema);

// require bodyParser since we need to handle post data for adding a user
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
// static content
app.use(express.static(path.join(__dirname, "./static")));
// set the views folder and set up ejs
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route

// the root route -- we want to get all of the users from the database and then render the index view passing it all of the users
app.get('/', function(req, res) {
  User.find({}, function(err, users) {
    if(err) {
      console.log('Failed to connect to database or there is no data.');
    } else { // else console.log that we did well and then redirect to the root route
      console.log('Successfully display users!');
    }
   // this is the method that finds all of the users from the database
    // notice how the first parameter is the options for what to find and the second is the callback function that has an error (if any) and all of the users
    // keep in mind that everything you want to do AFTER you get the users from the database must happen inside of this callback for it to be synchronous 
    // Make sure you handle the case for when there is an error as well as the case for when there is no error
    res.render('index', {users : users});
  })
})


// route to add a user
app.post('/users', function(req, res) {
  console.log("POST DATA", req.body);
  // create a new User with the name and age corresponding to those from req.body
  var user = new User({name: req.body.name, age: req.body.age, comment: req.body.comment });
  // try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  user.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a user!');
      res.redirect('/');
    }
  })
})
// listen on 8005
app.listen(8005, function() {
 console.log("listening on port 8005");
})