var url = _config.api.invokeUrl + "/allroutes";

var poolData = {
    UserPoolId: window._config.cognito.userPoolId,
    ClientId: window._config.cognito.userPoolClientId
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var cognitoUser = userPool.getCurrentUser();

async function getToken() {
    const token = await new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();
        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                }
                else if (!session.isValid()) {
                    resolve(null);
                }
                else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        }
        else {
            resolve(null);
        }
    });
    if (token) {
        return token;
    }
    else {
        window.location.replace("/signin");
        return null;
    }
}

getToken().then(result => {
    req = {
        headers: {
            idToken: result
        },
        id: cognitoUser.getUsername()
    };
    
    $.post(url, JSON.stringify(req), function (data, status) {
        console.log("HERE", data);
        var items =JSON.parse(data.body).Items;
        
        items.forEach(route => {
            $("#routeRow").append("<div class='col-sm-3'><div class='card'><div class='card-body'>" +
                "<h5 class='card-title'>" + route.name + "</h5>" +
                "<div class='btn-group btn-group' role='group' aria-label=" + route.name + ">"+
                "<a href='/see/"+ route._id+"' class='btn btn-primary'>See</a>" +
                "<a href='/routes/delete/" +route._id+"' class='btn btn-danger'>Delete</a>" +
                "</div>"+
                "</div></div></div>");
        });
    });
}).catch(err => {
    window.location.replace("signin");
});