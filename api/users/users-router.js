const express = require('express');
const {
  validateUserId,
  validateUser, 
  validatePost
} = require('../middleware/middleware');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const User = require('./users-model')
const Post = require('../posts/posts-model')

const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  User.get()
    .then(users => {
      res.json(users);
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  console.log(req.user)
  res.json(req.user);
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  console.log(req.name)
  User.insert({ name: req.name })  // because we put name on the req in the middleware
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  console.log(req.user)
  User.update(req.params.id, { name: req.name })  // because we put name on the req in the middleware
    .then(() => {                         // 1) bc this doesn't return user, it returns lines changed.
      return User.getById(req.params.id)  // 2) so return the specific user you updated here 
    })
    .then(user => {                       // 3) then run with the returned user to update
      res.json(user);
    })
    .catch(next)
});

router.delete('/:id', validateUserId, (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  console.log(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  console.log(req.user)
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {// eslint-disable-line
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  console.log(req.user)
  console.log(req.text)
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