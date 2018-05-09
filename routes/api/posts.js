const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Bring in Post model

const Post = require("../../models/Post");

//Bring in validation

const validatePostInput = require("../../validation/post");

// @route   GET api/post/test
// @desc    Tests the Post route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Post Route Works" }));

// @route   POST api/posts
// @desc    Create a post
// @access  Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);
module.exports = router;
