const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// require routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

// run express as app
const app = express();

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configure db
const db = require("./config/keys").mongoURI;

// connect mongoose to db
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected."))
  .catch(err => console.log(err));

// root route
app.get("/", (req, res) => res.send("Hello."));

// use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`The magic happens on port ${port}.`));
