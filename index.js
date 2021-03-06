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

// CORS config
const cors = require("cors");
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));

// Models and controllers import
const User = require("./src/models/user.model");
const userController = require("./src/controllers/user.controller");

const gamesController = require("./src/controllers/games.controller");

// Passport auth
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
    if (req.user.displayName) {
      res.redirect(process.env.FRONTEND_URL);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/signup/display-name`);
    }
  }
);

// user auth middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({});
  }
};

// display name api
app.post("/user/display-name-availability", async (req, res) => {
  try {
    if (req.body.displayName.length <= 2) {
      return res.send({
        message: "Too short",
        status: false,
      });
    }

    const displayName = await User.findOne({
      displayName: req.body.displayName,
    })
      .lean()
      .exec();
    if (displayName)
      return res.send({
        message: "Already taken",
        status: false,
      });

    return res.send({ message: "Perfect", status: true });
  } catch (err) {
    return res.status(500).send({});
  }
});

app.get("/test", isAuthenticated, (req, res) => {
  res.send({ user: req.user || null });
});

// API paths
app.use("/user", isAuthenticated, userController); // pass middleware

app.use("/games", gamesController);

// Logout api
app.get("/logout", (req, res) => {
  req.logout();
  res.send({});
});

module.exports = app;
