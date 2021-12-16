const langButton = document.getElementById("lang-btn")
const menuButton = document.getElementById("menu-btn")
const caption = document.getElementById('caption');
const code = document.getElementById('expo-code');
const author = document.getElementById('expo-author');
const title = document.getElementById('expo-title');
const proyText = document.getElementById('player-proy-txt');
const progress = document.getElementById('progress');
const currentTimePos = document.getElementById('current-time');
const remainingTimePos = document.getElementById('remaining-time');
const params = new URLSearchParams(window.location.search)

var captions = {};
var authors = {};
var lang = 'es';
var proy = 1;

proy = parseInt(params.get("proy"));

lang = params.get("lang");
lang == 'es' ? setEspanol() : setEnglish()

langButton.addEventListener('click', ()=>{
    lang == 'es' ? setEnglish() : setEspanol()
})
menuButton.addEventListener('click', () => {
    window.location.href = `menu.html?lang=${lang}`
})

function setEnglish(){
    lang = 'en'
    langButton.innerText = "ESP"
    proyText.innerText = "PROJECTOR "+proy;
    window.history.pushState({},null,window.location.href.replace("lang=es","lang=en"))
}
function setEspanol(){
    lang = 'es'
    langButton.innerText = "ENG"
    proyText.innerText = "PROYECTOR "+proy;
    window.history.pushState({},null,window.location.href.replace("lang=en","lang=es"))
}

function getProjectorIdFrom(n,lang){
    return "p"+(n.toString())+lang
}

function errorCatch(error){
    if(!params.get("ignore-error"))
        window.location.href = `menu.html?lang=${lang}`
    else
        throw error
}

var player = new Tone.Player().toDestination();
player.loop = false;
player.onstop(()=> {
    tick()
});

// made up parameters
player.src = ""
player.started = 0
player.seekedTo = 0
player.currentTime = function(){
    return this.now() + this.seekedTo - this.started;
};

function metadataUpdate(current, expected) {
	caption.innerText = expected["caption"];
	code.innerText = expected["author"][0];
	author.innerText = expected["author"][1];
	title.innerText = expected["author"][2];

	current.started = current.now();
	current.seekedTo = expected["current_time"] - 4;
    current.seekedTo = current.seekedTo >= 0 ? current.seekedTo : 0;
	current.src = expected["audio_url"];
	current.duration = expected["duration"];
}


function correctAudioState(current,expected){
    if (!current.src.includes(expected['audio_url'])){
        let seekTo = (Date.now() + (3*60*60*1000) - (Date.parse(expected['song_start_time']) + 4000))/1000

        current.load(expected['audio_url'])
            .then(()=> {
            let startInMs = ((Date.parse(expected['song_start_time'])) + 4000) - (Date.now() + (3*60*60*1000));
            let isStarted = startInMs < 0;
            if (isStarted){
                current.start(); current.seek(seekTo); metadataUpdate(current,expected);
            }else
                setTimeout(()=>{current.start(); metadataUpdate(current,expected);},startInMs);
        });
    }
}

const MAX_DESYNC = 2
async function tick() {
    try {
        fetch(`https://us-central1-chatbot-gpt2.cloudfunctions.net/pidgeon?projector=${getProjectorIdFrom(proy,lang)}`)
            .then(response => response.json())
            .then(data => correctAudioState(player,data))
    }finally {
       // setTimeout(tick, MAX_DESYNC*1000)
    }
}

function updateProgress() {
    var currentTime = player.currentTime();
    var duration = player.duration;

    var progressPercent = (currentTime / duration) * 100;
    progressPercent = (progressPercent <= 100) ? progressPercent : 100;
    progress.style.width = `${progressPercent > 100 ? 100 : progressPercent}%`;
}

function getCurrentTimeInMinutes(){
    var currentTime = player.currentTime();

    currentTime = currentTime >= 0 ? currentTime : 0;
    let min = currentTime ? Math.floor(currentTime/60) : 0;
    let sec = currentTime ? Math.floor(currentTime-(min*60)) : 0;
    return timeFormat(min,sec)
}

function getRemainingTimeInMinutes(){
    var currentTime = player.currentTime();
    var duration = player.duration;

    let remainingTime = currentTime ? duration-currentTime : 0;
    remainingTime = (remainingTime>=0) ? remainingTime : 0;
    let min = currentTime ? Math.floor(remainingTime/60): 0;
    let sec = currentTime ? Math.floor(remainingTime-(min*60)) : 0;
    return "-"+timeFormat(min,sec)
}

function updateTimeInfo(){
    currentTimePos.innerText = getCurrentTimeInMinutes();
    remainingTimePos.innerText = getRemainingTimeInMinutes();
}


const clock = new Tone.Clock(time => {
    tick();
    updateProgress();
    updateTimeInfo();
}, 1);


function zfill2(n){
    n = Number(n).toString()
    return n.padStart(2,'0')
}

function timeFormat(min,sec){
    min = min ? min : 0;
    sec = sec ? sec : 0;
    return zfill2(min)+":"+zfill2(sec)
}

function iOS() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

var first = true;

document.addEventListener("DOMContentLoaded", function() {
    lang = params.get("lang");
    lang == 'es' ? setEspanol() : setEnglish();
    waitForUserIneraction()
    if (!iOS()) {
        Tone.start()
            .then(() => {clock.start();}).then(()=>{setOverlay(false); first = false;})
        //player.autostart = true;
    }
    getLocation();
});

function waitForUserIneraction(){
    setOverlay(true)
	document.body.addEventListener("click", () => {
		if (first) {
			Tone.start().then(() => {
				clock.start();
			});
			//player.autostart = true;
			first = false;
			setOverlay(false);
		}
	});
}

function setOverlay(on) {
	document.getElementById("overlay").style.display = on ? "block" : "none";
}