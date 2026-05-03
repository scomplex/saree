const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/addbrand", async (req, res) => {
    try {
        const brandCollection = await mongoose.connection.db.collection("Brands");
        const { bname, logo } = req.body;

        // Use a case-insensitive regex to check for existing brand names
        const existingBrand = await brandCollection.findOne({ 
            bname: { $regex: new RegExp(`^${bname}$`, 'i') } 
        });

        if (existingBrand) {
            return res.status(400).send({
                message: "Brand already exists",
            });
        }

        // Auto-increment ID for a new brand
        const latestBrand = await brandCollection.findOne({}, { sort: { id: -1 } });
        const newId = latestBrand ? latestBrand.id + 1 : 1;

        const newBrand = {
            id: newId,
            bname,
            logo,
        };

        await brandCollection.insertOne(newBrand);

        res.status(201).send({
            message: "New brand added successfully",
            brand: newBrand,
        });
    } catch (err) {
        console.error("Error adding brand:", err);
        res.status(500).send("Server error while adding brand");
    }
});

module.exports = router; // Make sure to export the router
