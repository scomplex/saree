const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/addcategory", async (req, res) => {
    try {
        const categoryCollection = await mongoose.connection.db.collection("Categories");
        const { cname, logo } = req.body;

        // Use a case-insensitive regex to check for existing category names
        const existingCategory = await categoryCollection.findOne({ 
            cname: { $regex: new RegExp(`^${cname}$`, 'i') } 
        });

        if (existingCategory) {
            return res.status(400).send({
                message: "Category already exists",
            });
        }

        // Auto-increment ID for a new category
        const latestCategory = await categoryCollection.findOne({}, { sort: { id: -1 } });
        const newId = latestCategory ? latestCategory.id + 1 : 1;

        const newCategory = {
            id: newId,
            cname,
            logo,
        };

        await categoryCollection.insertOne(newCategory);

        res.status(201).send({
            message: "New category added successfully",
            category: newCategory,
        });
    } catch (err) {
        console.error("Error adding category:", err);
        res.status(500).send("Server error while adding category");
    }
});

module.exports = router; // Make sure to export the router
