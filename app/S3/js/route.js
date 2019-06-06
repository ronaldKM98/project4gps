var url = _config.api.invokeUrl + "/getroute";

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

var points;

/**
 * Shows the route
 */
function seeRoute(btnId) {
    getToken().then(result => {
        $.ajaxSetup({
            headers: {
                "Authorization": result
            }
        });

        req = {
            id: btnId
        };

        $.post(url, JSON.stringify(req), function (data, status) {
            var items = JSON.parse(data.body).Items;
            console.log(items)
            points = items
            $("#route-list").addClass("d-none");
            $("#see-map").removeClass("d-none");
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;
            directionsDisplay.setMap(map);
            calculateAndDisplayRoute(directionsService, directionsDisplay);
        });
    });
}

/**
 * Paints the map
 */
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(6.200367, -75.577609),
        zoom: 16
    });
}

/**
 * Paints the route
 * @param {*} directionsService calculate directions
 * @param {*} directionsDisplay render route
 */
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var waypts = []; //Points between origin and destination
    //Calculate the strp to store waypoints
    var max;
    if (points.length - 2 > 8) { //8 is the max waypoints permited by Google Maps for non premium
        max = Math.floor((points.length - 2) / 8);
    } else {
        max = 1;
    }
    for (var i = 1; i < points.length - 1; i = i + max) {
        waypts.push({
            location: new google.maps.LatLng(points[i].lat, points[i].lon),
            stopover: false
        });
    };
    //Paint route
    directionsService.route({
        origin: new google.maps.LatLng(points[0].lat, points[0].lon),
        destination: new google.maps.LatLng(points[points.length - 1].lat, points[points.length - 1].lon),
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: 'WALKING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}