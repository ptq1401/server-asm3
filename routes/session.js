const express = require("express");
const router = express.Router();
const sessionController = require("../controller/session");

router.get("/get-chat", sessionController.getChat);
router.get("/get-all-chat", sessionController.getAllChat);
router.post("/post-message", sessionController.postMessage);
router.post("/post-message-admin", sessionController.postMessageAdmin);
module.exports = router;
