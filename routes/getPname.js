const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/getproductnames", async (req, res) => {
    try {
        const productsCollection = await mongoose.connection.db.collection("Products");

        // Fetch only unique product names
        const productNames = await productsCollection.distinct("pname");

        res.send(productNames);
    } catch (err) {
        console.error("Error retrieving product names:", err);
        res.status(500).send("Server Error: Unable to retrieve product names");
    }
});

module.exports = router;
