/***geoloc****/

const expoCoords = {latitude: -34.596145760367925, longitude: -58.43074234662542}
const MAX_DISTANCE = 9 // kilometers

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            checkLocation
            ,geoError
            ,{maximumAge:10000, timeout:5000, enableHighAccuracy: true});
    } else { 
        window.location.href = "error.html?error=support"
    }
}

Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}

function distanceFrom(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
    var dLon = (lon2-lon1).toRad(); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

function isLocationCloseEnough(position){
    let distance = distanceFrom(expoCoords.latitude,
                                expoCoords.longitude,
                                position.coords.latitude,
                                position.coords.longitude);
    return (distance <= MAX_DISTANCE)
}

function checkLocation(position){
    if(!isLocationCloseEnough(position))
        window.location.href = "error.html?error=location"
}

function geoError(error) {
    let ref = "error.html?error="
	switch (error.code) {
		case error.PERMISSION_DENIED:
			ref+="permission";
			break;
		case error.POSITION_UNAVAILABLE:
			ref+="unavailable";
			break;
		case error.TIMEOUT:
			ref+="timeout";
			break;
		case error.UNKNOWN_ERROR:
			ref+="unknown";
			break;
	}
    window.location.href = ref;
}