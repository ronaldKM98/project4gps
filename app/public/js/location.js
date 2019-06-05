/**
 * Paints the map and tracks the users location
 */
var map;
var watchID;
var infoWindow;

/**
 * Paints the map
 */
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(6.200367, -75.577609),
        zoom: 16
    });
    infoWindow = new google.maps.InfoWindow;
}

// AWS
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

/**
 * Starts tracking the user
 */
function trackMe() {
    document.getElementById('bWatchMe').disabled = true; //disables the button 
    var url = _config.api.invokeUrl + "/newroute";
    getToken().then(result => {
        req = {
            headers: {
                idToken: result
            },
            userId: cognitoUser.getUsername(),
            name: document.getElementById('routeName').value
        };
        console.log("asdad")
        $.post(url, JSON.stringify(req), function (data, status) {
            console.log(data)
            console.log("aqqquiii")
            if (navigator.geolocation) {
                var id = JSON.parse(data.body)._id
                console.log(id)
                watchID = navigator.geolocation.watchPosition(function (position) {
                    pos = {
                        headers: {
                            idToken: result
                        },
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        routeId: id
                    };
                    guardarPunto(pos);
                });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infoWindow, map.getCenter());
            }
        });

    }).catch(err => {
        window.location.replace("signin");
    });
}

function guardarPunto(pos) {
    //Stores de users location
    var url = _config.api.invokeUrl + "/newpoint";
    $.post(url, JSON.stringify(pos), function (data, status) {
        //Creates and sets the marker
        var marker = new google.maps.Marker({ position: { lat: pos.lat, lng: pos.lon } });
        marker.setMap(map);
        map.setCenter(marker.getPosition());
    });
}

/**
 * Stops tracking the user
 */
async function stop() {
    navigator.geolocation.clearWatch(watchID);
    document.getElementById('bWatchMe').disabled = false;
    window.location.replace("allRoutes.html");
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    console.log(pos);
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}