const express = require("express");
const router = express.Router();

const Games = require("../models/game.model");

router.get("/", async (req, res) => {
  try {
    const games = await Games.find({}).lean().exec();

    res.status(200).send({ games });
  } catch (err) {
    res.send(500).send({ err });
  }
});

module.exports = router;
