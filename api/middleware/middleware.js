const User = require('../users/users-model');

function logger(req, res, next) {
  const timestamp = new Date().toLocaleDateString();
  const method = req.method;
  const url = req.originalUrl;
  console.log(`[${timestamp}] ${method} to ${url}`);
  next();
}

async function validateUserId(req, res, next) {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      res.status(404).json({
        message: 'user does not exist'
      })
    } else {
      req.user = user;
      next()
    }
  } catch (err) {
    res.status(500).json({
      message: 'could not find the user for some reason'
    })
  }
}

function validateUser(req, res, next) {
  console.log('validateUser middleware');
  next();
}

function validatePost(req, res, next) {
  console.log('validatePost middleware');
  next();
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}