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

module.exports = router;
