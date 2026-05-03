const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/getbrands",async (req,res)=>{
    try{
        const brandsCollection = await mongoose.connection.db.collection("Brands");
        const data = await brandsCollection.find({}).toArray();


    res.send(data)
    }catch(err){
        console.log(err)
        res.send("Server Error Cant find brands")
    }
    })
    module.exports=router