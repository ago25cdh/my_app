var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('../passport/passport.js');
var Setting = require('../models/Setting');
var Sale = require('../models/Sale');


/*
app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));
app.use('/index', require('./routes/carpage'));
app.use('/settings', require('./routes/settings'));
*/


router.get('/', function(req,res){
  res.redirect('/login');
});

router.get('/login', function(req,res){
  res.render('posts/login', {email:req.flash("email")[0], loginError:req.flash('loginError')})
});

router.post('/login',
  function(req,res,next){
    req.flash("email");
    if(req.body.email.length === 0 || req.body.password.length === 0){
      req.flash("email", req.body.email);
      req.flash("loginError", "enter both email and password");
      res.redirect('/login');
    }else {
      next();
    }
  }, passport.authenticate('local-login', {
    successRedirect : '/store' ,
    failureRedirect : '/',
    failureFlash : true
  })
);
router.get('/logout', function(req,res){
  req.logout();
  res.redirect('/login');
});


// 관리자페이지 스토어명과 요금 결정
router.get('/store', function(req,res){
  Setting.find({}, function(err,settings){
    if(err) return res.json({success:false, message:err});
    res.render("posts/store",{data:settings});
  });
});

router.get('/autherror', function(req,res){
  res.render('posts/autherror');
});





module.exports = router;
