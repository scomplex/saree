const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const saleSchema = new mongoose.Schema({
  pname: {
    type: String,
    required: true,
  },
  cname: {
    type: String,
    required: true,
  },
  bname: {
    type: String,
    required: true,
  },
  sellingprice: {
    type: Number,
    required: true,
  },
  dos: {
    type: String,
  },
  salesperson: {
    type: String,
  },
  quantity: {
    type: Number, // Keep this as Number
  }
});

const saleModel = mongoose.model("sales", saleSchema);

// API endpoint to handle sale creation
router.post("/sale", async (req, res) => {
  const { pname, bname, cname, sellingprice, dos, salesperson, quantity } = req.body;

  try {
    console.log("Creating Sale");

    // Ensure quantity is treated as a number
    const quantityNum = Number(quantity); // Convert to number from string

    // Check if the conversion was successful
    if (isNaN(quantityNum)) {
      return res.status(400).json({ success: false, error: "Quantity must be a valid number." });
    }

    // First, find the product in the products collection
    const product = await mongoose.connection.collection("Products").findOne({ pname });

    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found." });
    }

    // Check if enough quantity is available
    if (product.quantity < quantityNum) {
      return res.status(400).json({ success: false, error: "Not enough stock available." });
    }

    // Create the sale
    const newselling = await saleModel.create({
      pname,
      bname,
      cname,
      sellingprice,
      dos,
      salesperson,
      quantity: quantityNum, // Store the quantity as a number in the sale record
    });

    // Update the product quantity
    await mongoose.connection.collection("Products").updateOne(
      { pname },
      { $inc: { quantity: -quantityNum } } // Reduce the quantity by the specified amount
    );

    // Send success response with the created sale data
    res.status(201).json({ success: true, sale: newselling });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ success: false, error: "Failed to create sale." });
  }
});

module.exports = router;
