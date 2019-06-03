var url = "https://ox653ar547.execute-api.us-east-2.amazonaws.com/allRoutes/"; //url de lambda
var poolData = {
    UserPoolId: window._config.cognito.userPoolId,
    ClientId: window._config.cognito.userPoolClientId
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var cognitoUser = userPool.getCurrentUser();

id = {id: cognitoUser.getUsername()};
console.log(id);
$.post(url, id, function (data, status) {
    console.log(data);
    data.Items.forEach(route => {
        $("#routeRow").append("<div class='col-sm-3'><div class='card'><div class='card-body'>" +
            "<h5 class='card-title'>" + route.name + "</h5>" +
            "<div class='btn-group btn-group' role='group' aria-label=" + route.name + ">"+
            "<a href='/see/"+ route._id+"' class='btn btn-primary'>See</a>" +
            "<a href='/routes/delete/" +route._id+"' class='btn btn-danger'>Delete</a>" +
            "</div>"+
            "</div></div></div>");
    });
});

//see lambda


