
//Guardar Punto
const AWS = require('aws-sdk');
const uuid = require("uuid/v4");

var id = uuid();

exports.handler = (event, context, callback) => {
    
    var awsConfig = {
        'region': 'us-east-2',
        'endpoint': 'http://dynamodb.us-east-2.amazonaws.com',
        'accessKeyId': '****',
        'secretAccessKey': '****'
    };
  
    AWS.config.update(awsConfig);
    const docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: 'Points',
        Item: {
            _id: id, lat: event.lat,
            lon: event.lon, routeId: event.routeId
        }
    };
    
    var response = {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Origin": "*"
        },
        'body': JSON.stringify({})
    };
    
    docClient.put(params, function (err, data) {
        if (err) callback(err, null);
        else callback(null, response);
    });
};