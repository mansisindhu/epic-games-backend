const express = require("express");
const router = express.Router();

const User = require("../models/user.model");

router.get("/", async (req, res) => {
  try {
    res.send({ user: req.user });
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.post("/display-name", async (req, res) => {
  try {
    // After conneted to frontend the _id will come through req.user
    await User.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    })
      .lean()
      .exec();
    return res.send({});
  } catch (err) {
    res.status(500).send({});
  }
});

module.exports = router;
