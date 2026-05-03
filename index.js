const express = require('express');
const cors = require('cors');
const mongodb = require('./mongooseConnect');
const path=require("path");

const app = express();
mongodb();
app.use(cors());
app.use(express.json());



app.use("/api", require("./routes/getBrands"));
app.use("/api", require("./routes/getCategories"));
app.use("/api", require("./routes/getProducts"));
app.use("/api", require("./routes/sales"));
app.use("/api", require("./routes/editProduct"));
app.use("/api", require("./routes/addProduct"));
app.use("/api", require("./routes/getPname"));
app.use("/api", require("./routes/deleteProduct"));
app.use("/api", require("./routes/addCategory"));
app.use("/api", require("./routes/addBrand"));
app.use("/api", require("./routes/getSales"));
app.use("/api", require("./routes/getReport"));





const currentDir = __dirname;
console.log("Current Directory:", currentDir);
app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"))
);
console.log(path.join(__dirname, "./frontend/build/index.html"),"srvsrv")







app.listen(5000, () => {
    console.log("Backend Server Started");
});