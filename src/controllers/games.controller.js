const express = require("express");
const router = express.Router();

const Games = require("../models/game.model");

router.get("/", async (_, res) => {
  try {
    const games = await Games.find({}).lean().exec();

    res.status(200).send(games);
  } catch (err) {
    res.send(500).send({ err });
  }
});

router.get("/filters", async (req, res) => {
  try {
    const price = req.query.price;
    let genre = req.query.genre?.split(",");
    let features = req.query.features?.split(",");
    const sortBy = req.query.sortBy;
    let platforms = req.query.platforms?.split(",");

    if (platforms[0] === "") {
      platforms = ["Windows", "Mac"];
    }

    if (features[0] === "") {
      features = [
        "single-player",
        "multiplayer",
        "controller-support",
        "co-op",
        "competitive",
      ];
    }

    if (genre[0] === "") {
      genre = [
        "Action",
        "Fighting",
        "Indie",
        "Puzzle",
        "Strategy",
        "Horror",
        "Survival",
        "Casual",
        "Shooter",
        "Adventure",
      ];
    }

    let underMinAmount = parseInt(price) || 100000000;

    let data = await Games.find({
      $and: [
        { genres: { $in: genre } },
        { features: { $in: features } },
        { "price.discountedPrice": { $lt: underMinAmount } },
        { platform: { $in: platforms } },
      ],
    });

    res.send({ data });
  } catch (err) {
    res.status(500).send({ err });
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
