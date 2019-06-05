function logout() {
    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    
    if (cognitoUser != null) {
        cognitoUser.signOut();
        window.location.replace("../users/login.html");
    } else {
        window.location.replace("../users/login.html");
    }
}