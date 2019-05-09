/**
 * This helper lets us check is the user is already authenticated for some functions on the app. 
 */
const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Not Authorized.');
  res.redirect('/login');
};

module.exports = helpers;
