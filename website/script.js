const langButton = document.getElementById("lang-btn")
const audio = document.getElementById('audio');
const caption = document.getElementById('caption');
const code = document.getElementById('expo-code');
const author = document.getElementById('expo-author');
const title = document.getElementById('expo-title');
const proyText = document.getElementById('player-proy-txt');
const progress = document.getElementById('progress');
const currentTimePos = document.getElementById('current-time')
const remainingTimePos = document.getElementById('remaining-time')

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

function setEnglish(){
    lang = 'en'
    langButton.innerText = "ESP"
    proyText.innerText = "PROJECTOR "+proy;
}
function setEspanol(){
    lang = 'es'
    langButton.innerText = "ENG"
    proyText.innerText = "PROYECTOR "+proy;
}

function setAudioSource(audioUrl){
    audio.src = audioUrl;
}

function correctAudioState(current,expected){
    if (!current.src.includes(expected['audio_url'])){
        setAudioSource(expected['audio_url'])
        caption.innerText = expected['caption']
        code.innerText = expected['author'][0]
        author.innerText = expected['author'][1]
        //TODO: title
    }
    if (Math.abs(audio.currentTime - expected.currentTime) > MAX_DESYNC){
        audio.currentTime = expected['current_time'] + MAX_DESYNC/2;
    }
    audio.play();
}

function getProjectorIdFrom(n,lang){
    return "p"+(n.toString())+lang
}

const MAX_DESYNC = 2
async function tick() {
    try {
        fetch(`http://d972-190-19-109-14.ngrok.io/projector/${getProjectorIdFrom(proy,lang)}`)
            .then(response => response.json())
            .then(data => correctAudioState(audio,data))
    } finally {
      // setTimeout(tick, 2000)
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    tick();
});

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}
audio.addEventListener('timeupdate', updateProgress);

function getCurrentTimeInMinutes(e){
    const {duration,currentTime} = e.srcElement;
    let min = (currentTime==null)? 0 : Math.floor(currentTime/60);
    let sec = (currentTime==null)? 0 : 
        Math.floor(currentTime-(min*60));
    return ""+min+":"+sec
}

function getRemainingTimeInMinutes(e){
    const {duration,currentTime} = e.srcElement;
    let remainingTime = (currentTime==null)? 0 : duration-currentTime;
    let min = (currentTime==null)? 0 : Math.floor(remainingTime/60);
    let sec = (currentTime==null)? 0 : 
        Math.floor(remainingTime-(min*60));
    return "-"+min+":"+sec
}

function updateTimeInfo(e){
    currentTimePos.innerText = getCurrentTimeInMinutes(e);
    remainingTimePos.innerText = getRemainingTimeInMinutes(e);
}

audio.addEventListener('timeupdate',updateTimeInfo);