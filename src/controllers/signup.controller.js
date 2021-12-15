const User = require('../models/user.model')
const express = require('express')

const passport = require('passport')
const passportLocal = require('passport-local').Strategy
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')

const router = express.Router()

router.post("/", (req, res) => {


    User.findOne({ email: req.body.email }, async (err, doc) => {
        if (err) throw err
        if (doc) res.send("User already exists")

        if (!doc) {

            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                dispayName: req.body.userName,
                email: req.body.email,
                password: hashedPassword
            })

            await newUser.save()
            res.send("Registered Successfully")
        }
    })
})

module.exports = router;