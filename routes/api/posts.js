const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// import models
const Post = require('./../../models/Post');

// import validation
const validatePostInput = require('./../../validation/post');

// @route     get api/posts/test
// @desc      tests posts route
// @access    public
router.get('/test', (req, res) => res.json({ msg: 'Posts works' }));

// @route     post api/posts
// @desc      create post
// @access    private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // check valiation
  if (!isValid) return res.status(400).json(errors);
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user._id
  });
  newPost.save().then(post => res.json(post));
});

module.exports = router;
