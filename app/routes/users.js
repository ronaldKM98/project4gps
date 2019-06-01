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
 * Store in database the user registation
 */
router.post('/signup', async (req, res) => {
  var attributeList = [];
  const { firstName, username, email, password, confirm_password } = req.body;
  if(password != confirm_password) {
    req.flash('error_msg', 'Passwords do not match.');
    res.redirect('/signup');
  }

  var dataEmail = {
    Name: 'email',
    Value: email
  };
  var dataName = {
    Name: 'name',
    Value: firstName
  };
  var dataUsername = {
    Name: 'preferred_username',
    Value: username
  }

  var emailAttributes = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
  var nameAttributes = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);
  var usernameAttributes = new AmazonCognitoIdentity.CognitoUserAttribute(dataUsername);


  attributeList.push(emailAttributes);
  attributeList.push(nameAttributes);
  attributeList.push(usernameAttributes);

  var cognitoUser;
  userPool.signUp(email, password, attributeList, null, (err, data) => {
    if(err) {
      console.error(err);
      req.flash('error_msg', err.message);
      res.redirect('/signup');
    } else {
      cognitoUser = data.user;
      req.flash('success_msg', 'Confirm your email, check in spam');
      res.redirect('/login');
    }
  });
});

/**
 * domain/login
 */
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/views/users/login.html"));
});

/**
 * check if user is registred 
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const authenticationData = {
    Username: email,
    Password: password
  }

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

  const userData = {
    Username: email,
    Pool: userPool
  }

  cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: result => {
      var accessToken = result.getAccessToken();
      console.log("access token " + accessToken + '\n');
      var idToken = result.getIdToken();
      console.log(idToken);
      var refreshToken = result.getRefreshToken();
      console.log("refresh token " + refreshToken + '\n');
      
      console.log("*********************************")
      
      res.redirect('/allRoutes');
    },
    onFailure: function(err) {
      console.error(err);
      req.flash('error_msg', err.message);
      res.redirect('/login');
    }
  });
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
