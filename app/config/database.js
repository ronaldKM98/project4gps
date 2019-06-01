/**
 * This is the MongoDB configuration with mongoose, its a module thats lets us access the database.
 */
const AWS = require('aws-sdk');
const awsConfig = {
    'region': 'us-east-2',
    'endpoint': 'http://dynamodb.us-east-2.amazonaws.com',
    'accessKeyId': '***',
    'secretAccessKey': '***'
};
  
AWS.config.update(awsConfig);
  
let docClient = new AWS.DynamoDB.DocumentClient();
console.log("DB is connected :)");

module.exports = docClient;