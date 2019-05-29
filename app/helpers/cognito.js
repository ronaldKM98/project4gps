/**
 * This helper lets us check is the user is already authenticated for some functions on the app. 
 */

const config = require('../config.json');
const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
  UserPoolId: config.cognito.userPoolId,
  ClientId: config.cognito.clientId
};

var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

module.exports = userPool;