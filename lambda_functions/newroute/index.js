// Creates a route in the database.
const AWS = require('aws-sdk');
const uuid = require("uuid/v4");

var id = uuid();

exports.handler = (event, context, callback) => {
    var awsConfig = {
        'region': 'us-east-2',
        'endpoint': 'http://dynamodb.us-east-2.amazonaws.com',
        'accessKeyId': 'AKIAUT5ELXJEHDTPL3KV',
        'secretAccessKey': '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'
    };
  
    AWS.config.update(awsConfig);
    
    const docClient = new AWS.DynamoDB.DocumentClient();
    
    var params = {
        TableName: 'Routes',
        Item: {
            _id: id, name: event.name, userId: event.userId
        }
    };
    
    var response = {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Origin": "*"
        },
        'body': JSON.stringify({"_id": id})
    };
    
    docClient.put(params, function(err, data) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, response)
        }
    });
};