const express = require("express");
const router = express.Router();

const Games = require("../models/game.model");

router.get("/", async (_, res) => {
  try {
    const games = await Games.find({}).lean().exec();

    res.status(200).send({ games });
  } catch (err) {
    res.send(500).send({ err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const game = await Games.findById(req.params.id).lean().exec();

    res.status(200).send(game);
  } catch (err) {
    res.status(404).send({ err });
  }
});

module.exports = router;
