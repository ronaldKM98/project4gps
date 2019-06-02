function logout() {
    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    
    if (cognitoUser != null) {
        console.log("logout")
        cognitoUser.signOut();
        window.location.replace("/login");
    } else {
        console.log("else   ")
        window.location.replace("/login");
    }
}