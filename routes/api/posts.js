const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Bring in models

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//Bring in validation

const validatePostInput = require("../../validation/post");

// @route   GET api/post/test
// @desc    Tests the Post route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Post Route Works" }));

// @route   GET api/posts
// @desc    Display all posts
// @access  Public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
});

// @route   GET api/posts/:id
// @desc    Display single post by id
// @access  Public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that id" })
    );
});

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

// @route   DELETE api/posts/:id
// @desc    Delete a single post by id
// @access  Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id).then(post => {
      //Check that the user making the delete request is the post author
      //FYI:  req.user.id (from the token) is the user making the request
      //      post.user (from the post record) is the person who made the post

      if (req.user.id !== post.user.toString()) {
        return res.status(401).json({ notauthorized: "User not authorized" });
      }
      // Delete
      post
        .remove()
        .then(() => res.json({ success: true }))
        .catch(err =>
          res.status(404).json({ nopostfound: "No post found with that id" })
        );
    });
  }
);

module.exports = router;
