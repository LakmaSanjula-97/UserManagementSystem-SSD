const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const path = require("path");

const config = require("./config/database");

mongoose.set("useCreateIndex", true);

mongoose
  .connect(config.database, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Databse connected successfully ");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

const PORT = process.env.PORT || 8070;

app.use(cors());

// Set the static folder
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  return res.json({
    message: "This is node.js role based authentication system",
  });
});

// custom middleware function
const checkUserType = function (req, res, next) {
  const userType = req.originalUrl.split("/")[2];
  // passport authentication starategy
  require('./middleware/passport')(userType, passport);
  next();
};

app.use(checkUserType);

const users = require("./routes/users.routes");
app.use("/api/users", users);

const admin = require("./routes/admin.routes");
app.use("/api/admin", admin);

const manager = require("./routes/manager.routes");
app.use("/api/manager", manager);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
