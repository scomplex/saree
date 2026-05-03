const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/getcategories",async (req,res)=>{
    try{
        const categoriesCollection = await mongoose.connection.db.collection("Categories");
        const data = await categoriesCollection.find({}).toArray();


    res.send(data)
    }catch(err){
        console.log(err)
        res.send("Server Error Cant find categories")
    }
    })
    module.exports=router