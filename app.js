// import module
var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// connect db
mongoose.connect(process.env.MONGO_PATH, { useNewUrlParser: true });
var db = mongoose.connection;
db.once("open", function(){
  console.log("db connect!");
});
db.on("error", function(err){
  console.log("db error : ", err);
});

// model setting

//view setting
app.set("view engine", 'ejs');

// set middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
