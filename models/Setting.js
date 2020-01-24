var mongoose = require('mongoose');

var settingSchema = mongoose.Schema({
  storename : {type:String, required:true},
  fee : {type:Number, required:true},
  feestyle : {type:String}
});

var Setting = mongoose.model('setting', settingSchema);

module.exports = Setting;
