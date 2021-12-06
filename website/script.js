// const proybtns = document.getElementsByClassName("proybtn")
// const proyButtons = Array.from(proybtns).reduce(function(obj,x){
//     obj[x.id] = x;
//     return obj;
// },{});
const langButton = document.getElementById("lang-btn")
const audio = document.getElementById('audio');
const caption = document.getElementById('caption');
const code = document.getElementById('expo-code');
const author = document.getElementById('expo-author');
const proyText = document.getElementById('player-proy-txt');

var captions = {};
var authors = {};
var lang = 'es';
var proy = 1;

langButton.addEventListener('click', ()=>{
    if(lang=='es'){
        lang = 'en'
        langButton.innerHTML = "ESP"
        proyText.innerText = `PROYECTOR ${proy}`
    } else {
        lang = 'es'
        langButton.innerHTML = "ENG"
        proyText.innerText = `PROYECTOR ${proy}`
    }
})

function setAudioSource(audioUrl){
    audio.src = audioUrl;
}


function correctAudioState(current,expected){
    if (!current.src.includes(expected['audio_url'])){
        setAudioSource(expected['audio_url'])
        caption.innerText = expected['caption']
        code.innerText = expected['author'][0]
        author.innerText = expected['author'][1]
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