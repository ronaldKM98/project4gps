/**
 * Controller of users
 */
const router = require('express').Router();
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');
const config = require('../config.json');


/**
 * Global variables
 */
const User = require('../models/User');
const poolData = { 
  UserPoolId: config.cognito.userPoolId,
  ClientId: config.cognito.clientId
};
const pool_region = 'us-east-1';
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

/**
 * domain/signup
 */
router.get('/signup', (req, res) => {
  res.render('users/signup', {errors: req.session['sign-up-errors']});
  req.session['sign-up-errors'] = [];
});

/**
 * Store in database the user registation
 */
router.post('/signup', async (req, res) => {
  let errors = [];
  var attributeList = [];
  const { firstName, username, email, password, confirm_password } = req.body;

  errors = req.validationErrors();
  req.session['sign-up-errors'] = [];

  if(errors) {
    for(let error in errors) {
      req.session['sign-up-errors'].push(error.msg);
    }
    return res.redirect('/signup')
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

  var cognitoUser = "";
  userPool.signUp(email, password, attributeList, null, (err, data) => {
    if(err) {
      console.error(err);
      res.redirect('/signup');
    } else {
      cognitoUser = data.user;
      console.log('email is ' + cognitoUser.getUsername());
      req.flash('success_msg', 'Confirm your email');
      res.redirect('/login');
    }
  });
});

/**
 * domain/login
 */
router.get('/login', (req, res) => {
  res.render('users/login');
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

  const userDetails = {
    Username: email,
    Pool: userPool
  }

  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userDetails);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: result => {
      console.log("access token " + result.getAccessToken().getJwtToken() + '\n');
      console.log("id token " + result.getIdToken().getJwtToken() + '\n');
      console.log("refresh token " + result.getRefreshToken().getToken() + '\n');
      res.redirect('/allRoutes');
    },
    onFailure: function(err) {
      console.error(err);
      res.redirect('/login');
    }
  });
});

/**
 * Logout
 */
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out now.');
  res.redirect('/login');
});

module.exports = router;
