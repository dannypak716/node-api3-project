function logger(req, res, next) {
  const timestamp = new Date().toLocaleDateString();
  const method = req.method;
  const url = req.originalUrl;
  console.log(`[${timestamp}] ${method} to ${url}`);
  next();
}

function validateUserId(req, res, next) {
  console.log('validateUserId middleware');
  next();
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