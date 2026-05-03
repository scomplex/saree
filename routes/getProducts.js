const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/getproducts", async (req, res) => {
    try {
        const productsCollection = await mongoose.connection.db.collection("Products");
        const bname = req.body.bname;  // Declare bname
        const cname = req.body.cname;  // Declare cname
        let data = "";

        if (bname === "All Brands" && cname === "All Categories") {
            data = await productsCollection.find({}).toArray();
        } else if (bname === "All Brands") {
            data = await productsCollection.find({ cname: cname }).toArray();
        } else if (cname === "All Categories") {
            data = await productsCollection.find({ bname: bname }).toArray();
        } else {
            data = await productsCollection.find({ bname: bname, cname: cname }).toArray();
        }

        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error: Can't find category-specific products");
    }
});

module.exports = router;
