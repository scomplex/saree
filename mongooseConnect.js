const mongoose = require("mongoose");
const mongodb=async ()=>{
    await mongoose.connect("mongodb+srv://mayank20429_db_user:XiDzfUbFsp1y9eZv@cluster0.lccd5qw.mongodb.net/Saree")
    console.log("db Connected")
}
module.exports = mongodb;
