var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Car = require('../models/Car');
var Setting = require('../models/Setting');
var Sale = require('../models/Sale');



/*
app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));
app.use('/index', require('./routes/carpage'));
app.use('/settings', require('./routes/settings'));
*/


router.get('/page/:id', function(req,res){
  Setting.findById(req.params.id, function(err,storepost){
    if(err) return res.json({success:false, message:err});
    if(req.user._id != '5bea785ce0f66f5b49ab0424') return res.redirect('../../autherror');
    res.render('posts/setting', {store:storepost});
  });
});

router.get('/storefee/:id', function(req,res){
  Setting.findById(req.params.id, function(err,storepost){
    if(err) return res.json({success:false, message:err});
    res.render('posts/storeform', {store:storepost});
  });
});


router.post('/storefee/:id', function(req,res){
  Setting.findById(req.params.id, function(err,storepost){
    Setting.create(req.body.post, function(err,post){
      if(err) return res.json({success:false, message:err});
      res.redirect('/store');
    });
  });
});

router.get('/addsale/:id', function(req,res){
  Setting.findById(req.params.id, function(err,storepost){
    Sale.find({}, function(err,salepost){
      if(err) return res.json({success:false, message:err});
      res.render("posts/settingsfee",{sdata:salepost, store:storepost});
    });
  });
});

router.post('/addsale/:id', function(req,res){
  Setting.findById(req.params.id, function(err,storepost){
    Sale.create(req.body.salepost, function(err,salepost){
        if(err) return res.json({success:false, message:err});
        res.redirect('../page/'+req.params.id);
    });
  });
});












module.exports = router;
