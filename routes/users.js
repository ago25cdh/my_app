var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/User');
// async 란
var async = require('async');


/*
app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));
app.use('/index', require('./routes/carpage'));
app.use('/settings', require('./routes/settings'));
*/

router.get('/new', function(req,res){
  res.render('posts/new', {
                              formData : req.flash('formData')[0],
                              emailError : req.flash('emailError')[0],
                              usernameError : req.flash('usernameError')[0],
                              passwordError : req.flash('passwordError')[0]
                            }
  );
}); //new
router.post('/', checkUserRegValidation, function(req,res,next){
  User.create(req.body.user, function(err,user){
    if(err) return res.json({success:true, message:err});
    res.redirect('/login');
  });
}); //create by html
router.get('/:id', isLoggedIn, function(req,res){
  User.findById(req.params.id, function(err, user){
    if(err) return res.json({success:false, message:err});
    res.render('posts/show', {user : user});
  });
}); //show
router.get('/:id/edit', isLoggedIn, function(req,res){
  if(req.user._id != req.params.id) return res.json({success:false, message:"Unauthrized Attempt"});
  User.findById(req.params.id, function(err,user){
    if(err) return res.json({success:false, message:err});
    res.render("posts/edit", {
                                user : user,
                                formData : req.flash('formData')[0],
                                emailError : req.flash('emailError')[0],
                                usernameError : req.flash('usernameError')[0],
                                passwordError : req.flash('passwordError')[0]
                              }
    );
  });
});
router.put('/:id', isLoggedIn, checkUserRegValidation, function(req,res){
  if(req.user._id != req.params.id) return res.json({success:false, message:"Unauthrized Attempt"});
  User.findById(req.params.id, req.body.user, function(err,user){
    if(err) return res.json({success:false, message:err});
    if(user.authenticate(req.body.user.password)){
      if(req.body.user.newPassword){
        req.body.user.password = user.hash(req.body.user.newPassword);
      }else {
        delete req.body.user.password;
      }
      User.findByIdAndUpdate(req.params.id, req.body.user, function(err,user){
        if(err) return res.json({success:false, message:err});
        res.redirect('/users/' + req.params.id);
      });
    }else {
      req.flash("formData", req.body.user);
      req.flash("passwordError", " - invalid password");
      res.redirect('/users/'+req.params.id+"/edit");
    }
  });
});

function checkUserRegValidation(req, res, next){
  var isValid = true;

  async.waterfall(
    [function(callback){
      User.findOne({email: req.body.user.email, _id:{$ne: mongoose.Types.ObjectId(req.params.id)}},
        function(err,user){
          if(user){
            isValid = false;
            req.flash("emailError", "this email is already resisterend");
          }
          callback(null, isValid);
        }
      );
    }, function(isValid, callback){
      User.findOne({username:req.body.user.username, _id:{$ne:mongoose.Types.ObjectId(req.params.id)}},
        function(err,user){
          if(user){
            isValid = false;
            req.flash("usernameError", "this username is already resisterend");
          }
          callback(null, isValid);
        }
      );
    }], function(err, isValid){
      if(err) return res.json({success:"false", massege:err});
      if(isValid){
        return next();
      }else{
        req.flash("formData", req.body.user);
        res.redirect("back");
      }
    }
  );
}

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/settings');
}

module.exports = router;
