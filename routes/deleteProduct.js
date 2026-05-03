const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/deleteproduct", async (req, res) => {
    try {
        const productsCollection = mongoose.connection.db.collection("Products");

        // Convert pid to a number
        const pid = parseInt(req.body.pid, 10);

        // Validate the conversion
        if (isNaN(pid)) {
            return res.status(400).send("Invalid input format for pid");
        }

        // Perform the delete operation
        const result = await productsCollection.deleteOne({ id: pid });

        if (result.deletedCount > 0) {
            res.status(200).send("Product deleted successfully.");
        } else {
            res.status(404).send("Product not found.");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error: Can't delete product");
    }
});

module.exports = router;
