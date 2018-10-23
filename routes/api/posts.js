const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// import models
const Post = require('./../../models/Post');
const Profile = require('./../../models/Profile');

// import validation
const validatePostInput = require('./../../validation/post');

// @route     get api/posts/test
// @desc      tests posts route
// @access    public
router.get('/test', (req, res) => res.json({ msg: 'Posts works' }));

// @route     get api/posts
// @desc      get posts
// @access    public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route     get api/posts/:postId
// @desc      get specific post by ID
// @access    public
router.get('/:postId', (req, res) => {
  Post.findById(req.params.postId)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});

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

// @route     delete api/posts/:postId
// @desc      delete specific post
// @access    private
router.delete('/:postId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.postId)
    .then(post => {
      if (post.user.equals(req.user._id))
        return res.status(401).json({ notauthorized: 'User not authorized' });
      post.remove().then(() => res.json({ success: true }));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route     post api/posts/like/:postId
// @desc      like post
// @access    private
router.post('/like/:postId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.postId)
    .then(post => {
      if (post.likes.filter(like => like.user.equals(req.user._id)))
        return res.status(400).json({ alreadyliked: 'User already liked this post' });
      post.likes.unshift({ user: req.user._id });
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route     post api/posts/unlike/:postId
// @desc      unlike post
// @access    private
router.post('/unlike/:postId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.postId)
    .then(post => {
      if (!post.likes.filter(like => like.user.equals(req.user._id)))
        return res.status(400).json({ notliked: 'User has not liked this post' });
      const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user._id);
      post.likes.splice(removeIndex, 1);
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route     post api/posts/comment/:postId
// @desc      add comment to post
// @access    private
router.post('/comment/:postId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // check valiation
  if (!isValid) return res.status(400).json(errors);
  Post.findById(req.params.postId)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user._id
      };

      post.comments.unshift(newComment);
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route     delete api/posts/comment/:postId/:comment_id
// @desc      remove comment from post
// @access    private
router.delete(
  '/comment/:postId/:commentId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.postId)
      .then(post => {
        if (
          post.comments.filter(comment => comment._id.equals(req.params.commentId)).length === 0
        ) {
          return res.status(404).json({ commentnotexists: 'Comment does not exist' });
        }
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.commentId);

        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

module.exports = router;
