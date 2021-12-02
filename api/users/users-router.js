const express = require('express');
const {
  validateUserId,
  validateUser, 
  validatePost
} = require('../middleware/middleware');

const User = require('./users-model')
const Post = require('../posts/posts-model')

const router = express.Router();

router.get('/', (req, res, next) => {
  User.get()
    .then(users => {
      res.json(users);
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user);
});

router.post('/', validateUser, (req, res, next) => {
  User.insert({ name: req.name })  // because we put name on the req in the middleware
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  User.update(req.params.id, { name: req.name })  // because we put name on the req in the middleware
    .then(() => {                         // 1) bc this doesn't return user, it returns lines changed.
      return User.getById(req.params.id)  // 2) so return the specific user you updated here 
    })
    .then(user => {                       // 3) then run with the returned user to update
      res.json(user);
    })
    .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {  // using async await to switch things up
  try {
    await User.remove(req.params.id)
    res.json(req.user)
  } catch (err) {
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try {
    const userPosts = await User.getUserPosts(req.params.id)
    res.json(userPosts)
  } catch (err) {
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {// eslint-disable-line
  try {
    const result = await Post.insert({
      user_id: req.params.id,
      text: req.text
    })
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
});

router.use((err, req, res, next) => {   // eslint-disable-line
  res.status(err.status || 500).json({
    custom: 'something went wrong in the hubs router',
    message: err.message,
    stack: err.stack
  });
});

// do not forget to export the router
module.exports = router;