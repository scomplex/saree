const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/addproduct", async (req, res) => {
    try {
        const productCollection = await mongoose.connection.db.collection("Products");
        const categoriesCollection = await mongoose.connection.db.collection("Categories");

        const { pname, bname, cname, price, quantity, logo, dop, vendor, mrp, baseprice, extracharges, tax } = req.body;

        // Check if the product already exists (case-insensitive)
        const existingProduct = await productCollection.findOne({
            pname: { $regex: new RegExp(`^${pname}$`, 'i') },
            bname: { $regex: new RegExp(`^${bname}$`, 'i') },
            cname: { $regex: new RegExp(`^${cname}$`, 'i') },
        });

        // Function to format date in dd/mm/yyyy format
        const formatDate = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        };

        // Function to calculate price with 2% increment
        const calculatePriceWithMarkup = (price) => {
            return (parseFloat(price) * 1.02).toFixed(2); // Increment price by 2% and fix to 2 decimals
        };

        // If the product exists, update the fields accordingly
        if (existingProduct) {
            const updatedQuantity = existingProduct.quantity + quantity;
            const updatedPrice = price ? calculatePriceWithMarkup(price) : existingProduct.price;
            const updatedLogo = logo || existingProduct.logo;
            const updatedDop = dop ? (existingProduct.dop + ',' + formatDate(dop)) : existingProduct.dop;
            const updatedVendor = vendor || existingProduct.vendor;
            const updatedMrp = mrp !== undefined ? mrp : null;
            const updatedBaseprice = baseprice || existingProduct.baseprice;
            const updatedExtracharges = extracharges || existingProduct.extracharges;
            const updatedTax = tax || existingProduct.tax;

            await productCollection.updateOne(
                { _id: existingProduct._id },
                {
                    $set: {
                        quantity: updatedQuantity,
                        price: updatedPrice,
                        logo: updatedLogo,
                        dop: updatedDop,
                        vendor: updatedVendor,
                        mrp: updatedMrp,
                        baseprice: updatedBaseprice,
                        extracharges: updatedExtracharges,
                        tax: updatedTax
                    }
                }
            );

            return res.status(200).send({
                message: "Product updated successfully",
                product: { ...existingProduct, quantity: updatedQuantity, price: updatedPrice, logo: updatedLogo, dop: updatedDop, vendor: updatedVendor, mrp: updatedMrp, baseprice: updatedBaseprice, extracharges: updatedExtracharges, tax: updatedTax }
            });
        }

        // Auto-increment ID for a new product
        const latestProduct = await productCollection.findOne({}, { sort: { id: -1 } });
        const newId = latestProduct ? latestProduct.id + 1 : 1;

        // Check if logo is null or empty, and fetch from Categories if needed
        let productLogo = logo;
        if (!productLogo) {
            const category = await categoriesCollection.findOne({ cname: cname });
            productLogo = category ? category.logo : null;
        }

        // Set `dop` to user-defined date if provided, otherwise default to today's date
        const formattedDop = dop ? formatDate(dop) : formatDate(new Date());

        // Define the new product document
        const newProduct = {
            id: newId,
            pname,
            bname,
            cname,
            price: price ? calculatePriceWithMarkup(price) : null, // Apply 2% markup
            quantity,
            logo: productLogo,
            mrp: mrp !== undefined ? mrp : null, // Set MRP to null if not provided
            dop: formattedDop, // date in dd/mm/yyyy format
            vendor: `${bname} Authorized Dealer`,
            baseprice,    // Add baseprice from frontend
            extracharges, // Add extracharges from frontend
            tax           // Add tax from frontend
        };

        // Insert the new product
        await productCollection.insertOne(newProduct);

        res.status(201).send({
            message: "New product added successfully",
            product: newProduct
        });
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).send("Server error while adding product");
    }
});

module.exports = router; // Make sure to export the router
