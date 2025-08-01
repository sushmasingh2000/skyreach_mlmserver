const mongoose = require("mongoose");

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected successfully");
    }
    catch(e){
        console.log("connection failed");
        process.exit(1);
    }
}

module.exports = connectDB;