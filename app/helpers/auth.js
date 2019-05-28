/**
 * This helper lets us check is the user is already authenticated for some functions on the app. 
 */
const helpers = {};
var userPool = require('./cognito');

/** helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Not Authorized.');
  res.redirect('/login');
};*/

helpers.isAuthenticated = (req, res, next) => {
  var cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
    cognitoUser.getSession(function(err, session) {
      if(err) {
        req.flash('error_msg', err.message);
        res.redirect('/login');
      } else {
        return next();
      }
      console.log('session validity: ' + session.isValid());
    });
  }
}

module.exports = helpers;
