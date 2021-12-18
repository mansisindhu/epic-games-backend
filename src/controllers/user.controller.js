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
    await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    })
      .lean()
      .exec();
    return res.send({});
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.patch("/remove-wishlist", async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: req.body.gameId },
      },
      { new: true }
    );

    res.send({ data });
  } catch (err) {}
});

router.patch("/add-wishlist", async (req, res) => {
  try {
    let userData = await User.findById(req.user._id).lean().exec();

    let isPresent = false;

    userData.wishlist.forEach((el) => {
      if (req.body.gameId === el.toString()) {
        isPresent = true;
      }
    });

    if (isPresent) {
      res.status(409).send({ message: "Already in wishlist", error: true });
      return;
    }

    const data = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { wishlist: [req.body.gameId] },
      },
      { new: true }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
});

router.patch("/add-orders", async (req, res) => {
  try {
    let userData = await User.findById(req.user._id).lean().exec();

    let isPresent = false;

    userData.orders.forEach((el) => {
      if (req.body.gameId === el.toString()) {
        isPresent = true;
      }
    });

    if (isPresent) {
      res.status(409).send({ message: "Already in orders", error: true });
      return;
    }

    const data = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { orders: [req.body.gameId] },
      },
      { new: true }
    );
    res.send(data);
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
