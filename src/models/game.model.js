const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  title: { type: String },
  logo: { type: String },
  cardImage: { type: String },
  cardTagline: { type: String },
  price: {
    mainPrice: { type: Number },
    discountPercentage: { type: Number },
  },
  developer: { type: String },
  publisher: { type: String },
  releaseDate: { type: String },
  platform: [{ type: String }],
  description: { type: String },
  genres: [{ type: String }],
  features: [{ type: String }],
  tags: [{ type: String }],
  aboutGame: { type: String },
  gameFeatures: [{ type: String }],
  images: [{ type: String }],
  rating: {
    criticRecommend: { type: Number },
    topCriticAverage: { type: Number },
    openCriticrating: { type: String },
  },
  reviews: [
    {
      organization: { type: String },
      author: { type: String },
      rating: { type: String },
      description: { type: String },
      link: { type: String },
    },
  ],
});

module.exports = mongoose.model("game", gameSchema);
