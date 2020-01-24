var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Car = require('../models/Car');
var Setting = require('../models/Setting');
var Sale = require('../models/Sale');

// 인덱스화면(입차등록과 출차처리 할 수 있는..)

/*
app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));
app.use('/index', require('./routes/carpage'));
app.use('/settings', require('./routes/settings'));
*/

router.get('/', function(req,res){
  if(err) return res.json({success:false, message:err});
  res.render('posts/index');
});



router.get('/:id', function(req,res){
  Setting.findById(req.params.id, function(err,storepost){
    if(err) return res.json({success:false, message:err});
    res.render('posts/overindex', {user:req.user, store:storepost});
  });
});  //overindex



 //차량 입차등록페이지
router.get('/in/:id',function(req,res){
  Setting.findById(req.params.id, function(err, storepost){
    Sale.find({}, function(err,salepost){
      Car.find({}, function(err,carpost){
        if(err) return res.json({success:false, massege:err});
        res.render("posts/in", {sdata:salepost , data:carpost , store:storepost});
      });
    });
  });
});


//수정 전
router.post('/in/:id', function(req,res){
  Setting.findById(req.params.id, function(err, storepost){
    Car.create(req.body.carinpost, function(err, carinpost){
      var primarykey = req.params.id;
      if(err) return res.json({success:false, massege:err});
      res.redirect("../../index/"+req.params.id);
    });
  });
});


router.get('/out/:id', function(req,res){
  Setting.findById(req.params.id, function(err, storepost){
    Car.find({}, function(err,caroutpost){
      if(err) return res.json({success:false, massege:err});
      res.render("posts/search", {data:caroutpost,store:storepost});
    });
  });
});

router.post('/out/:id', function(req,res){
  Setting.findById(req.params.id, function(err, storepost){
    Car.find({carnum:new RegExp(req.body.caroutpost.carnum+'$')}).
    where('carout').exists(false).
    exec(function(err,caroutpost){
      console.log(req.body.caroutpost.carnum);
      if(err) return res.json({success:false, massege:err});
      res.render('posts/searchlist', {data:caroutpost, store:storepost});
    });
  });
});

router.post('/out/:sid/:cid', function(req,res){
  var carout = Date.now();
  Car.findById(req.params.cid, function(err,caroutpost){
    caroutpost.carout = carout;
    caroutpost.save(function(err,caroutpost){
      if(err) return res.json({success:false, massege:err});
      res.redirect('/index/'+req.params.sid);
    });
  });
});

router.get('/inlist/:sid', function(req,res){
  Car.find({}).
  where('carout').exists(false).
  exec(function(err,carinpost){
    Setting.findById(req.params.sid, function(err, storepost){
      if(err) return res.json({success:false, massege:err});
      res.render("posts/inlist", {data:carinpost , store:storepost});
    });
  });
});

router.post('/inlist/:id/:cid', function(req,res){
  var carout = Date.now();
  Car.findById(req.params.cid, function(err,carinpost){
    carinpost.carout = carout;
    carinpost.save(function(err, carinpost){
      if(err) return res.json({success:false, massege:err});
      res.redirect('../../'+req.params.id);
    });
  });
});


router.get('/outlist/:id', function(req,res){
  Car.find({}).
  where('carout').exists(true).
  sort('-carout').
  exec(function(err,caroutpost){
    Setting.findById(req.params.id, function(err,storepost){
      if(err) return res.json({success:false, massege:err});
      res.render("posts/outlist", {data:caroutpost, store:storepost});
    });
  });
});


module.exports = router;
