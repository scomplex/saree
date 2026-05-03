const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/editproduct", async (req, res) => {
    try {
        const productsCollection = mongoose.connection.db.collection("Products");
        
        // Convert pid to a number
        const pid = parseInt(req.body.pid, 10);
        const newQuantity = parseInt(req.body.quantity, 10);  // Ensure quantity is an integer
        const newPrice = parseFloat(req.body.price);  // Ensure price is a decimal
        const newBasePrice = parseFloat(req.body.baseprice); 
        const newTax= parseFloat(req.body.tax); 
        const newExtracharges= parseFloat(req.body.extracharges); 
        const newPname=req.body.pname
        const newLogo=req.body.logo



        // Validate conversions
        if (isNaN(pid) || isNaN(newQuantity) || isNaN(newPrice)) {
            return res.status(400).send("Invalid input format for pid, quantity, or price.");
        }

        const result = await productsCollection.updateOne(
            { id: pid },
            { $set: { quantity: newQuantity, price: newPrice,baseprice:newBasePrice,tax:newTax,extracharges:newExtracharges,pname:newPname ,logo:newLogo} }
        );

        if (result.modifiedCount > 0) {
            res.status(200).send("Product updated successfully.");
        } else {
            res.status(404).send("Product not found or no changes applied.");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error: Can't update product");
    }
});

module.exports = router;
