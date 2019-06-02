function signUp() {
    var firstName = document.getElementById("firstName").value;
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm_password").value;

    if(password != confirmPassword) {
        alert("Passwords do not match");
    }

    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = []; 

    var dataEmail = {
        Name: 'email',
        Value: email
    };
    var dataName = {
        Name: 'name',
        Value: firstName
    };
    var dataUsername = {
        Name: 'preferred_username',
        Value: username
    }

    var emailAttributes = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    var nameAttributes = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);
    var usernameAttributes = new AmazonCognitoIdentity.CognitoUserAttribute(dataUsername);


    attributeList.push(emailAttributes);
    attributeList.push(nameAttributes);
    attributeList.push(usernameAttributes);

    var cognitoUser;
    userPool.signUp(email, password, attributeList, null, (err, data) => {
        if(err) {
            console.error(err);
            alert(err.message);
        } else {
            cognitoUser = data.user;
            console.log(cognitoUser.getUsername());
            alert("Check your email"); 
        }
    });
}