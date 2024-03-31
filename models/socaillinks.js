var mongoose=require('mongoose');
var sociallinksSchema=mongoose.Schema({
    socailtype:String,
    url:String
})
var SocialBroadCast=mongoose.model("socialmedia_broadCast",sociallinksSchema);
module.exports=SocialBroadCast;