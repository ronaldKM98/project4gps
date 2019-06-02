/**
 * Controller of users
 */
const router = require('express').Router();
//const passport = require('passport');
const path = require('path');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
global.fetch = require('node-fetch');

/**
 * Global variables
 */
var userPool = require('../helpers/cognito');

/**
 * domain/signup
 */
router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/views/users/signup.html"));
});

/**
 * domain/login
 */
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/views/users/login.html"));
});

/**
 * Logout
 */
router.get('/logout', (req, res) => {
  var cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
    cognitoUser.signOut();
    req.flash('success_msg', 'You are logged out now.');
    res.redirect('/login');
  } else {
    req.flash('error_msg', 'You are not logged in.');
    res.redirect('/login');
  }
});

module.exports = router;
