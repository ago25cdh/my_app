var mongoose = require('mongoose');

var carSchema = mongoose.Schema({
  carnum : {type:String, required:true},
  carin : {type:Date, default:Date.now},
  carout : {type:Date},
  keylocation : {type:Number},
  sale : {type:Number}
});
var Car = mongoose.model('car', carSchema);

module.exports = Car;
