const User = require("../model/user");
exports.adminAuthentication = (req, res, next) => {
  User.findById(req.cookies.user_id).then((data) => {
    if (data.role === "admin" && data.role !== "client") return next();
    return res.send({ error: true, message: "You are not a admin" });
  });
};
