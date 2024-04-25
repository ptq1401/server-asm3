const Session = require("../model/session");

exports.getChat = (req, res, next) => {
  if (!req.cookies.user_id) return res.send([]);
  Session.findOne({ user_id: req.cookies.user_id }).then((data) => {
    if (!data) {
      //create new chat if data = null
      const session = new Session({
        user_id: req.cookies.user_id,
        message: [],
      });
      session.save();
      return res.send([]);
    }
    return res.send(data.message);
  });
};

exports.postMessage = (req, res, next) => {
  const id = req.cookies.user_id;
  Session.findOne({ user_id: id })
    .then((data) => {
      data.message.push(req.body);
      data.save();
      return res.send({ error: false });
    })
    .catch((error) => {
      console.log(error);
      return res.send({ error: true });
    });
};
exports.postMessageAdmin = (req, res, next) => {
  const id = req.body._id;
  Session.findById(id)
    .then((data) => {
      data.message.push(req.body.data);
      data.save();
      return res.send({ error: false });
    })
    .catch((error) => {
      console.log(error);
      return res.send({ error: true });
    });
};

exports.getAllChat = (req, res, next) => {
  Session.find().then((data) => {
    return res.send(data);
  });
};
