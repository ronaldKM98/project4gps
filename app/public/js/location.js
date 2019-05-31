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

/**
 * Strats tracking the user
 */
function trackMe() {
    document.getElementById('bWatchMe').disabled = true; //disables the button 
    var route = {
        userId: "testUser",
        name: document.getElementById('routeName').value
    }
    var url = "/maps/crearRuta";
    $.post(url, route, function (data, status) {
        if (navigator.geolocation) {
            watchID = navigator.geolocation.watchPosition(function (position) {
                pos = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    routeId: data._id
                };
                guardarPunto(pos);
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}

function guardarPunto(pos) {
    //Stores de users location
    var url = "/maps/guardarPunto";
    $.post(url, pos, function (data, status) {
        //Creates and sets the marker
        var marker = new google.maps.Marker({ position: {lat: pos.lat, lng: pos.lon}});
        marker.setMap(map);
        map.setCenter(marker.getPosition());
    });
}

/**
 * Stops tracking the user
 */
async function stop() {
    navigator.geolocation.clearWatch(watchID);
    document.stopForm.submit();
    document.getElementById('bWatchMe').disabled = false;
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    console.log(pos);
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}