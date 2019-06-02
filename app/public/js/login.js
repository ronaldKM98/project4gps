function login() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    
    const authenticationData = {
        Username: email,
        Password: password
    }

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    const userData = {
        Username: email,
        Pool: userPool
    }

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
            var accessToken = result.getAccessToken();
            //console.log("access token " + accessToken + '\n');
            var idToken = result.getIdToken();
            //console.log(idToken);
            var refreshToken = result.getRefreshToken();
            //console.log("refresh token " + refreshToken + '\n');
            window.location.replace("/allRoutes");
        },
        onFailure: function(err) {
            alert(err.message);
        }
    });
}