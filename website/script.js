const langButton = document.getElementById("lang-btn")
const menuButton = document.getElementById("menu-btn")
const audio = document.getElementById('audio');
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

function setAudioSource(audioUrl){
    audio.src = audioUrl;
}

function correctAudioState(current,expected){
    if (!current.src.includes(expected['audio_url'])){
        setAudioSource(expected['audio_url'])
        audio.currentTime = expected['current_time']
        caption.innerText = expected['caption']
        code.innerText = expected['author'][0]
        author.innerText = expected['author'][1]
        title.innerText = expected['author'][2]
    }
    if (Math.abs(audio.currentTime - expected.currentTime) > MAX_DESYNC){
        audio.currentTime = expected['current_time'] + MAX_DESYNC/2;
    }
    audio.play().catch(errorCatch)
}

function getProjectorIdFrom(n,lang){
    return "p"+(n.toString())+lang
}

function errorCatch(error){
    if(!params.get("ignore-error"))
        window.location.href = `menu.html?lang=${lang}`
}

const MAX_DESYNC = 2
async function tick() {
    try {
        fetch(`https://8744-190-19-109-14.ngrok.io/projector/${getProjectorIdFrom(proy,lang)}`)
            .then(response => response.json())
            .then(data => correctAudioState(audio,data))
    }finally {
        setTimeout(tick, MAX_DESYNC*1000)
    }
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}
audio.addEventListener('timeupdate', updateProgress);

function zfill2(n){
    n = Number(n).toString()
    return n.padStart(2,'0')
}

function timeFormat(min,sec){
    return zfill2(min)+":"+zfill2(sec)
}

function getCurrentTimeInMinutes(e){
    const {duration,currentTime} = e.srcElement;
    let min = (currentTime==null)? 0 : Math.floor(currentTime/60);
    let sec = (currentTime==null)? 0 : 
        Math.floor(currentTime-(min*60));
    return timeFormat(min,sec)
}

function getRemainingTimeInMinutes(e){
    const {duration,currentTime} = e.srcElement;
    let remainingTime = (currentTime==null)? 0 : duration-currentTime;
    let min = (currentTime==null)? 0 : Math.floor(remainingTime/60);
    let sec = (currentTime==null)? 0 : 
        Math.floor(remainingTime-(min*60));
    return "-"+timeFormat(min,sec)
}

function updateTimeInfo(e){
    currentTimePos.innerText = getCurrentTimeInMinutes(e);
    remainingTimePos.innerText = getRemainingTimeInMinutes(e);
}

audio.addEventListener('timeupdate',updateTimeInfo);

// overlay.addEventListener('click', () => {
//     overlay.style.display = "none";
//     tick();
// });

document.addEventListener("DOMContentLoaded", function() {
    lang = params.get("lang");
    lang == 'es' ? setEspanol() : setEnglish();
    tick();
});