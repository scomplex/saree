const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define the route
router.get("/sales-performance", async (req, res) => {
  try {
    const salesCollection = mongoose.connection.collection("sales");
    const report = await salesCollection.aggregate([
        {
          $match: { dos: { $regex: "12/2024" } } // Filter by date
        },
        {
          $lookup: {
            from: "Products",
            localField: "pname",
            foreignField: "pname",
            as: "productDetails"
          }
        },
        {
          $unwind: "$productDetails" // Unwind product details
        },
        {
          $addFields: {
            // Ensure fields are numeric
            sellingprice: { $toDouble: "$sellingprice" },
            quantity: { $toInt: "$quantity" },
            productPrice: { $toDouble: "$productDetails.price" }
          }
        },
        {
          $addFields: {
            cp: { $multiply: ["$productPrice", "$quantity"] }, // Cost price
            profit: {
              $subtract: [
                { $multiply: ["$sellingprice", "$quantity"] }, // Total selling price
                { $multiply: ["$productPrice", "$quantity"] }  // Total cost price
              ]
            }
          }
        },
        {
          $group: {
            _id: "$salesperson",
            productscount: { $sum: "$quantity" },
            totalsp: { $sum: { $multiply: ["$sellingprice", "$quantity"] } },
            totalcp: { $sum: "$cp" },
            totalprofit: { $sum: "$profit" }
          }
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            productscount: 1,
            totalsp: 1,
            totalcp: 1,
            profit_or_loss: "$totalprofit"
          }
        }
      ]).toArray();
      
    // const report= await salesCollection.aggregate([
    //     { $match: { dos: { $regex: "11/2024" } } }
    //   ]).toArray();
    //   const report= await salesCollection.aggregate([
    //     { $match: { dos: { $regex: "11/2024" } } },
    //     {
    //       $lookup: {
    //         from: "Products",
    //         localField: "pname",
    //         foreignField: "pname",
    //         as: "productDetails"
    //       }
    //     }
    //   ]).toArray();
    // console.log("Generated Report:");
    res.status(200).json(report);
  } catch (error) {
    console.error("Error generating sales performance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
