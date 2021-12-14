const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const localStrategy = require('passport-local').Strategy;
const passport = require('passport')

passport.use(
    new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {

            const user = await User.findOne({ email: email })

            if (!user) {
                return done(null, false, { message: "User not exist" })
            }

            const isMatch = await user.isValidPassword(password)

            return isMatch ? done(null, user) : done(null, false, { message: "Incorrect password" })


        } catch (err) {
            done(err, 'nothing is working go to sleep')
        }
    })
)

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById({ _id: id }, function (err, user) {
        done(err, user);
    });
});