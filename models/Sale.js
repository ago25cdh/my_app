var mongoose = require('mongoose');

var saleSchema = mongoose.Schema({
  salecode : {type:Number, required:true},
  saleinfo : {type:String},
  sale : {type:Number}
});
var Sale = mongoose.model('sale', saleSchema);

module.exports = Sale;
