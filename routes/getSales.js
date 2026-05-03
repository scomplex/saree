const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Route to fetch all sales
router.get("/getsales", async (req, res) => {
  try {
    // Get the "Sales" collection from the MongoDB connection
    const salesCollection = await mongoose.connection.db.collection("sales");

    // Fetch all sales documents
    const sales = await salesCollection.find({}).toArray();

    console.log("Fetched Sales:", sales); // Log the fetched sales data

    // Send the sales data as a response
    res.status(200).send(sales);
  } catch (err) {
    console.error("Error fetching sales data:", err);
    res.status(500).send("Server error while fetching sales data");
  }
});

module.exports = router;
