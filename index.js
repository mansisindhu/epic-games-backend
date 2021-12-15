require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());

const session = require("express-session");

if (process.env.IS_HEROKU) {
  app.set("trust proxy", 1);
  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: true,
      cookie: {
        sameSite: "none",
        secure: true,
        domain: process.env.BACKEND_URL,
        path: "/",
        httpOnly: true,
      },
    })
  );
} else {
  const redis = require("redis");
  const RedisStore = require("connect-redis")(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: true,
    })
  );
}

const cors = require("cors");
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));

const User = require("./src/models/user.model");
const userController = require("./src/controllers/user.controller");

const passport = require("./src/configs/passport");
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  const newUser = await User.findById(id).lean().exec();
  done(null, newUser);
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
  function (req, res) {
    return res.send({ user: req.user });
  }
);

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({});
  }
};

app.get("/test", isAuthenticated, (req, res) => {
  res.send({ user: req.user || null });
});

app.use("/user", userController); // pass middleware

app.get("/logout", (req, res) => {
  req.logout();
  res.send({});
});

module.exports = app;
