
/**
 * This is the MongoDB configuration with mongoose, its a module thats lets us access the database.
 */

const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/trackingDB', { useCreateIndex: true, useNewUrlnoParser: true })
  /*mongoose.connect('mongodb://mongo-server/project1GPS', {
    useCreateIndex: true,
    useNewUrlParser: true
  })*/
  .then(db => console.log('DB is connected'))
  .catch(err => console.error(err));

var AWS = require('aws-sdk');

var awsConfig = {
  'region': 'us-east-2',
  'endpoint': 'http://dynamodb.us-east-2.amazonaws.com',
  'accessKeyId': 'AKIAUT5ELXJEHDTPL3KV',
  'secretAccessKey': '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'
};

AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

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
}

module.exports = docClient;