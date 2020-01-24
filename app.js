// import module
var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

// var methodOverride = require('method-override');


// connect db
mongoose.connect(process.env.MONGO_PATH, { useNewUrlParser: true });
var db = mongoose.connection;
db.once("open", function(){
  console.log("db connect!");
});
db.on("error", function(err){
  console.log("db error : ", err);
});

//view setting
app.set("view engine", 'ejs');

// set middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true})); // 
// app.use(methodOverride("_method"));
app.use(flash());
app.use(session({secret:'MySecret'}));

var passport = require('./passport/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));
app.use('/index', require('./routes/carpage'));
app.use('/settings', require('./routes/settings'));

// start server
app.listen(3000, function(){
  console.log('server on!!');
});
