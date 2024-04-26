const Product = require("../model/product");
const fs = require("fs");
const { validationResult } = require("express-validator");
const { error } = require("console");

exports.postAddProduct = (req, res, next) => {
  const files = req.files;
  const data = req.body;
  const errors = validationResult(req);
  //if error
  if (!errors.isEmpty()) {
    // console.log(errors.array());
    return res.send({ error: true, message: errors.array()[0].msg });
  }
  files.forEach((cur, index) => {
    const path = cur.path;
    const imageUrl = "https://server-asm3-e5pk.onrender.com/" + path.split("\\").join("/");
    data[`img${index + 1}`] = imageUrl;
  });

  //---add product to database--
  const product = new Product(data);
  return product
    .save()
    .then(() => res.send({ error: false, message: "" }))
    .catch((error) => {
      console.log(error);
      return res.send({ error: true, message: "Can't add Product!" });
    });
};

exports.postDeleteProduct = (req, res, next) => {
  Product.findByIdAndDelete(req.body._id)
    .then(() => res.send({ error: false }))
    .catch((error) => {
      console.log(error);
      return res.send({ error: true });
    });
};

exports.getProductTrending = (req, res, next) => {
  Product.find()
    .then((data) => {
      data = data.splice(0, 8);
      let resData = data.map((cur) => {
        return {
          name: cur.name,
          img: cur.img4,
          price: cur.price,
          short_desc: cur.short_desc,
          _id: cur._id,
        };
      });
      return res.send(resData);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getAllProduct = (req, res, next) => {
  Product.find()
    .then((data) => res.send(data))
    .catch((error) => {
      console.log(error);
    });
};

exports.getDetailProduct = (req, res, next) => {
  let resData = {};
  Product.findById(req.body._id)
    .then((product) => {
      resData.detailProduct = product;
      return product.category;
    })
    .then((category) => {
      Product.find({ category: category })
        .then((related) => {
          resData.relatedProduct = related.filter(
            //bỏ product trùng id sản phẩm đang tìm
            (cur) => cur._id.toString() !== req.body._id
          );
          return res.send(resData);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

exports.postUpdateProduct = (req, res, next) => {
  const errors = validationResult(req);
  //if error
  if (!errors.isEmpty()) {
    // console.log(errors.array());
    return res.send({ error: true, message: errors.array()[0].msg });
  }
  const { _id, ...update } = req.body;
  Product.findById(_id)
    .then((data) => {
      data.name = update.name;
      data.category = update.category;
      data.long_desc = update.long_desc;
      data.short_desc = update.short_desc;
      data.price = update.price;
      data.quantity = update.quantity;
      return data.save().then(() => res.send({ error: false }));
    })
    .catch((error) => {
      console.log(error);
      res.send({ error: true, message: "Some Error in server" });
    });
};
