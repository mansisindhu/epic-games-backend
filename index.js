require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");

app.use(express.json());

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

const passport = require("./src/configs/passport");
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (id, done) {
  console.log(id);
  done(null, id);
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure", // 404 is shown
  }),
  function (_, res) {
    return res.redirect(`${process.env.ORIGIN}`);
  }
);

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({});
  }
};

app.get("/logout", (req, res) => {
  req.logout();
  res.send({});
});

module.exports = app;
