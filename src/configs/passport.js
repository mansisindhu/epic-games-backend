const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      const email = profile?._json?.email;
      try {
        console.log(profile);

        return cb(null, email);
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);

module.exports = passport;
