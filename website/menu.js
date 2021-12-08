const proybtns = document.getElementsByClassName("proy-btn");
const proyButtons = Array.from(proybtns);
const proytxts = document.getElementsByClassName("proy-txt");
const proyTexts = Array.from(proytxts);
const langButton = document.getElementById("lang-btn");
const params = new URLSearchParams(window.location.search);

var lang = 'es';
var proy = 1;

langButton.addEventListener('click', ()=>{
    lang == 'es' ? setEnglish() : setEspanol()
})

proyButtons.forEach((x,i) => {
    let ignoreError = params.get("ignore-error") ? "&ignore-error=true" : "";
    x.addEventListener('click', () => window.location.href = "player.html?proy="+(i+1)+"&lang="+lang+ignoreError)
});

function setEnglish(){
    lang = 'en'
    langButton.innerHTML = "ESP"
    proyTexts.forEach(x => {x.innerText = "PROJECTOR"});
    window.history.pushState({},null,window.location.href.replace("lang=es","lang=en"));
}

function setEspanol(){
    lang = 'es'
    langButton.innerHTML = "ENG"
    proyTexts.forEach(x => {x.innerText = "PROYECTOR"});
    window.history.pushState({},null,window.location.href.replace("lang=en","lang=es"));
}

/***geoloc****/

const expoCoords = {latitude: -34.596145760367925, longitude: -58.43074234662542}
const MAX_DISTANCE = 15

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

document.addEventListener("DOMContentLoaded", function() {
    lang = params.get("lang");
    lang == 'es' ? setEspanol() : setEnglish()
    getLocation();
});
