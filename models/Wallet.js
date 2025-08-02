const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({ 
    userId : {type : mongoose.Schema.Types.ObjectId, ref:"User", unique:true},
    balance : {type:Number , default:0},
    updatedAt : {type : Date , default :Date.now},
})

module.exports = mongoose.model("Wallet" , walletSchema)

