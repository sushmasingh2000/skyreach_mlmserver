 const mongoose = require("mongoose");

 const userSchema = new mongoose.Schema({
    name :String,
    email :String,
    password :String,
    referralCode :String,
    referredBy :String,
    wallet : {
        type : Number,
        default:0,
    },
    role :{
        type:String,
        enum:["user", "admin"],
        default : "user"
    },
    createdAt :{
        type:Date,
        default: Date.now,
    },
 })

module.exports = mongoose.model("User" , userSchema)
