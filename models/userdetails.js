var mongoose=require('mongoose');
var userSchema=mongoose.Schema({
   // id: Number,
    fullname:String,
    username: String,
    email: String,
    phonenumber:String,
    password: String,
    role: Number,
    age: Number,
    location: String,
    status:String,
    isfirsttimelogin:Boolean
})
//the name of the collection!
var Customer= mongoose.model("Customer",userSchema);
module.exports=Customer ;



