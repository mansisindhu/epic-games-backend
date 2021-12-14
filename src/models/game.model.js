const mongoose = require('mongoose')

const game = new mongoose.Schema({
    name: { type: String, required: true },
})