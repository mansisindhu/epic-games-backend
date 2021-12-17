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

router.get("/filters", async (req, res) => {
  try {
    const price = req.query.price;
    let genre = req.query.genre?.split(",");
    let features = req.query.features?.split(",");
    const sortBy = req.query.sortBy;

    features = features || [
      "single-player",
      "multiplayer",
      "controller-support",
      "co-op",
      "competitive",
    ];

    genre = genre || [
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

    const underMinAmount = parseInt(price) || 100000000;

    let data = await Games.find({
      $and: [
        { genres: { $in: genre } },
        { features: { $in: features } },
        { "price.mainPrice": { $lt: underMinAmount } },
      ],
    });

    if (sortBy === "alphabetical") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "highToLow") {
      data.sort((a, b) => b.price.mainPrice - a.price.mainPrice);
    } else if (sortBy === "lowToHigh") {
      data.sort((a, b) => a.price.mainPrice - b.price.mainPrice);
    } else if (sortBy === "newRelease") {
      data.sort((date1, date2) => {
        date1 = new Date(date1.releaseDate);
        date2 = new Date(date2.releaseDate);
        return date2 - date1;
      });
    }

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
