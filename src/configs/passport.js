const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

const User = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CALLBACK_URL}/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      const email = profile?._json?.email;
      let user;
      try {
        user = await User.findOne({ email }).lean().exec();

        if (!user) {
          user = await User.create({
            firstName: profile?._json?.given_name,
            lastName: profile?._json?.family_name,
            displayName: "",
            email: email,
            orders: [],
            wishlist: [],
          });
        }

        return cb(null, user);
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);

module.exports = passport;
