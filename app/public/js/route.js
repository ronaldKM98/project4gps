/**
 * Shows the route
 */

var points;

/**
 * Paints the map
 */
function initMap() {
    points = JSON.parse(document.getElementById('points').value);
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: new google.maps.LatLng(6.200367, -75.577609),
        zoom: 16
    });
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsDisplay);
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
    if(points.length-2 > 8) { //8 is the max waypoints permited by Google Maps for non premium
        max = Math.floor((points.length-2)/8);
    } else {
        max = 1;
    }
    for(var i = 1; i < points.length-1; i = i+max) { 
        waypts.push({
            location: new google.maps.LatLng(points[i].lat, points[i].lon), 
            stopover: false
        });
    };
    //Paint route
    directionsService.route({
        origin: new google.maps.LatLng(points[0].lat, points[0].lon),
        destination: new google.maps.LatLng(points[points.length-1].lat, points[points.length-1].lon),
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