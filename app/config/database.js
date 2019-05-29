/**
 * This is the MongoDB configuration with mongoose, its a module thats lets us access the database.
 */

var AWS = require('aws-sdk');

// No subir esto al repo!!!
var awsConfig = {
  'region': 'us-east-2',
  'endpoint': 'http://dynamodb.us-east-2.amazonaws.com',
  'accessKeyId': '******',
  'secretAccessKey': '******'
};

AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

/** 
export function put (tableName, json) {
  console.log("asdas");
  var params = {
    TableName: tableName,
    Item: json
  }
  docClient.put(params, function (err, data) {
    if (err) console.log(err);
    else console.log(data);
  });
}*/

module.exports = docClient;