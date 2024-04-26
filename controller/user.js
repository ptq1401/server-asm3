const User = require("../model/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

//-------signup module--------
exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const fullName = req.body.fullName;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  //if error
  if (!errors.isEmpty()) {
    // console.log(errors.array());
    return res.send({ error: true, message: errors.array()[0].msg });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        //if user does't exit
        if (password === confirmPassword) {
          bcrypt
            .hash(password, 12)
            .then((hashPass) => {
              const user = new User({
                email: email,
                fullName: fullName,
                password: hashPass,
                role: "client",
              });
              user.save();
              return res.send({ error: false, message: "" });
            })
            .catch((error) => {
              console.log(error);
              return res.send({ errorService: true });
            });
        } // password don't match
        else return res.send({ error: true, message: "Password does't match" });
      } //user exists
      else return res.send({ error: true, message: "User already exists" });
    })
    .catch((error) => {
      console.log(error);
      return res.send({ errorService: true });
    });
};

//-------login module--------
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  //if error
  if (!errors.isEmpty()) {
    // console.log(errors.array());
    return res.send({ error: true, message: errors.array()[0].msg });
  }

  User.findOne({ email: email })
    .then((user) => {
      //user exist
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then((doMatch) => {
            if (doMatch) {
              //----set cookie---
              res.cookie("user_id", user._id, {sameSite: 'none', secure: true });
              res.cookie("login", true, {sameSite: 'none', secure: true });
              return res.send({
                error: false,
                user: { name: user.fullName },
              });
            } else return res.send({ error: true, message: "Password Error" });
          })
          .catch((error) => {
            console.log(error);
            return res.send({ errorService: true });
          });
      } else return res.send({ error: true, message: "User doesn't exist" });
    })
    .catch((error) => {
      console.log(error);
      return res.send({ errorService: true });
    });
};

exports.getLogout = (req, res, next) => {
  res.clearCookie("user_id");
  res.clearCookie("login");
  res.end();
};

exports.getCheckLogin = (req, res, next) => {
  if (!req.cookies.login) return res.send("");
  consoel.log(req.cookies.user_id)
  const _id = req.cookies.user_id;
  User.findById(_id)
    .then((user) => {
      if (user) {
        return res.send({
          error: false,
          user: { name: user.fullName },
        });
      } else return res.send(null);
    })
    .catch((error) => {
      console.log(error);
      return res.send({ errorService: true });
    });
};

//---login with role admin--
exports.postLoginAdmin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  //if error
  if (!errors.isEmpty()) {
    // console.log(errors.array());
    return res.send({ error: true, message: errors.array()[0].msg });
  }

  User.findOne({ email: email })
    .then((user) => {
      //user exist
      if (user) {
        //xác thực role
        if (user.role === "client")
          return res.send({ error: true, message: "You do not have access" });
        //xác thực password
        bcrypt
          .compare(password, user.password)
          .then((doMatch) => {
            if (doMatch) {
              res.cookie("user_id", user._id, {sameSite: 'none', secure: true });
              res.cookie("login", true, {sameSite: 'none', secure: true });
              return res.send({
                error: false,
              });
            } else return res.send({ error: true, message: "Password Error" });
          })
          .catch((error) => {
            console.log(error);
            return res.send({
              error: true,
              message: "Some Error, Can't Login",
            });
          });
      } else return res.send({ error: true, message: "User doesn't exist" });
    })
    .catch((error) => {
      console.log(error);
      return res.send({
        error: true,
        message: "Some Error, Can't Login",
      });
    });
};
