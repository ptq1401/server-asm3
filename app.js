const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

//-----require router-------
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");
const sessionRouter = require("./routes/session");
//-----server----------
const corsOptions = {
  origin: true,
  credentials: true,
};
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "data/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: fileStorage });
const app = express();

app.use("/data/images", express.static("data/images"));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(upload.array("files", 5));

app.use((req, res, next) => {
const arrayDomain = ["http://localhost:3000", "http://localhost:3001"];
  const origin = req.headers.origin;
 if (arrayDomain.includes(origin)) {
 res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  next();
});
//----router---
app.use(userRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(sessionRouter);

//-------------------------
mongoose
  .connect(
    "mongodb+srv://moonnie:nYNadjCW2W9ZWiiC@assiment.z4ayje8.mongodb.net/asm3?retryWrites=true&w=majority&appName=assiment"
  )
  .then((result) => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
