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
    console.log('ES INIT');
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
    var socket = io();
    document.getElementById('bWatchMe').disabled = true; //disables the button 
    //Store with socket the route name
    socket.emit('new route', {user: document.getElementById('user').value, name: document.getElementById('routeName').value});
    if (navigator.geolocation) {
        watchID = navigator.geolocation.watchPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            //Stores de users location
            socket.emit('new point', { latitude: pos.lat, longitude: pos.lng, user: document.getElementById('user').value});
            //Creates and sets the marker
            var marker = new google.maps.Marker({ position: pos });
            marker.setMap(map);
            map.setCenter(marker.getPosition());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
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
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}