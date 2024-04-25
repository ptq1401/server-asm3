const Order = require("../model/order");
const Product = require("../model/product");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

exports.postAddToCart = (req, res, next) => {
  const user_id = req.cookies.user_id;
  const product = req.body;

  Order.findOne({ user_id: user_id, status: "Waiting for pay" })
    .then((data) => {
      //chưa có đơn hàng đang chờ => tạo giỏ hàng mới
      if (!data) {
        const order = new Order({
          user_id: user_id,
          cart: [{ product_id: product._id, quantity: product.quantity }],
        });
        order.save();
        return res.send({ errorService: false });
      }
      // có đơn hàng đang chờ` => thêm vào giỏ hàng có sẵn
      const oldProduct = data.cart.filter(
        (cur) => cur.product_id.toString() === product._id
      );
      if (oldProduct[0]) {
        oldProduct[0].quantity += Number(product.quantity);
        data.cart.forEach((cur) => {
          if (cur.product_id.toString() === product._id) {
            cur = oldProduct[0];
          }
        });
      } else
        data.cart.push({ product_id: product._id, quantity: product.quantity });
      data.save();
      return res.send({ errorService: false });
    })
    .catch((error) => {
      console.log(error);
      return res.send({ errorService: true });
    });
};

exports.getCart = (req, res, next) => {
  Order.findOne({
    user_id: req.cookies.user_id,
    status: "Waiting for pay",
  })
    .populate("cart.product_id", "name price img4")
    .then((data) => {
      if (!data) return { cart_id: "", list: [] };
      return { cart_id: data._id, list: data.cart };
    })
    .then((prod) => res.send(prod));
};

exports.postRemoveProduct = (req, res, next) => {
  Order.findById(req.body.cartId)
    .then((cart) => {
      cart.cart = cart.cart.filter(
        (cur) => cur.product_id.toString() !== req.body.prodId
      );
      // throw Error();
      return cart
        .save()
        .then(() => res.send({ errorService: false }))
        .catch((error) => {
          console.log(error);
          return res.send({ errorService: true });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.send({ errorService: true });
    });
};

exports.postOrder = (req, res, next) => {
  const errors = validationResult(req);
  //if error
  if (!errors.isEmpty()) {
    // console.log(errors.array());
    return res.send({ error: true, message: errors.array()[0].msg });
  }
  const data = req.body;
  Order.findById(data.cartId)
    .then((cart) => {
      cart.name = data.name;
      cart.email = data.email;
      cart.address = data.address;
      cart.phoneNumber = data.phoneNumber;
      cart.status = "Order Successfully";
      cart.total = data.total;
      cart.save();
    })
    .catch((error) => {
      console.log(error);
      return res.send({ errorService: true });
    });

  //------------------
  Order.findById(data.cartId)
    .populate("cart.product_id", "name price")
    .then((data) => data.cart)
    .then((result) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "quyenptfx20616@funix.edu.vn",
          pass: "lfjxcodhtiokhggn",
        },
      });

      const htmlBody = `
      <h3>Xin chào ${data.name}</h3>
      <p>Phone: ${data.phoneNumber}</p>
      <p>Address: ${data.address}</p>
      <p>${new Date()}</p>
      <table> 
        <thead>
          <tr>
             <th style="width: 250px"> Name</th>
             <th style="width: 100px">Price</th>
             <th style="width: 100px">Quantity</th>
             <th style="width: 100px">Total</th>
          </tr>
        </thead>
        <tbody>
        ${result.map(
          (cur) => `
          <tr>
            <td style="width: 250px">${cur.product_id.name}</td>
            <td style="width: 100px; text-align: center">${
              cur.product_id.price
            } $</td>
            <td style="width: 100px; text-align: center">${cur.quantity}</td>
            <td style="width: 100px; text-align: center">${
              cur.quantity * cur.product_id.price
            } $</td>
          </tr>
        `
        )}
        </tbody>
      </table>
      <h3>Total: ${result.reduce(
        (total, cur) => total + cur.product_id.price * cur.quantity,
        0
      )} $</h3>
      `;

      const mailOptions = {
        from: "quyenptfx20616@funix.edu.vn",
        to: `${data.email}`,
        subject: "Sending Email using Node.js",
        html: htmlBody,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return res.send({ errorService: true });
        }
      });
    });
  return res.send({ error: false });
};

exports.getOrder = (req, res, next) => {
  const user_id = req.cookies.user_id;
  Order.find({ user_id: user_id, status: "Order Successfully" })
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
};

exports.postDetailOrder = (req, res, next) => {
  const id = req.body.order_id;
  Order.findById(id)
    .populate("cart.product_id", "name price img4")
    .then((data) => res.send(data))
    .catch((error) => {
      console.log(error);
      return res.send({ errorService: true });
    });
};

exports.getAllOrder = (req, res, next) => {
  Order.find()
    .then((data) => res.send(data.reverse().slice(0, 5)))
    .catch((error) => {
      console.log(error);
      return res.send({
        error: true,
        message: "Server don't response. Please reload this page",
      });
    });
};
