var mongoose=require('mongoose');
var informationSchema=mongoose.Schema({
    id:String,
    mental_state:Number,
    anxiety:Number,
    summary:String
})

var Cus_MentalHealth=mongoose.model("mental_information",informationSchema);
module.exports=Cus_MentalHealth;