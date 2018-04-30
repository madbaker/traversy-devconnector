const express = require("express");
const mongoose = require("mongoose");

//Bring in Routes

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

//Init App

const app = express();

//DB Config

const db = require("./config/keys").mongoURI;

//Connect to MongoDB

mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// @route   GET /
// @desc    Placeholder route for now
// @access  Public
app.get("/", (req, res) => res.send("Hello World from DevConnector"));

//Use Routes

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

//Run the server
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
