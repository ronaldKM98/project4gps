var poolData = {
    UserPoolId: window._config.cognito.userPoolId,
    ClientId: window._config.cognito.userPoolClientId
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var cognitoUser = userPool.getCurrentUser();


console.log(cognitoUser)
if (cognitoUser != null) {
    cognitoUser.getSession(function (err, session) {
        if (err) {
            alert(err);
            return;
        }
        console.log(session.isValid())
        if (session.isValid()) {
            $(".loggedIn").addClass("enable");
            $(".loggedOut").addClass("disable");
        }
    })
} else {
    $(".loggedIn").addClass("disable");
    $(".loggedOut").addClass("enable");

}