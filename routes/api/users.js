const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

//Load the User Model

const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests the Users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "User Route Works" }));

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm" //default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   POST api/users/login
// @desc    User Login / Return a JWT Token
// @access  Public

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user in DB by email

  User.findOne({ email }).then(user => {
    // is user in DB
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    //does PW match
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        return res.json({ msg: "Success" });
      } else {
        return res.status(400).json({ password: "Password is incorrect" });
      }
    });
  });
});

module.exports = router;
