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
player.src = ""
player.started = 0
player.seekedTo = 0
player.currentTime = function(){
    return this.now() - this.started + this.seekedTo;
};

function correctAudioState(current,expected){
    if (!current.src.includes(expected['audio_url'])){
        audio.currentTime = expected['current_time']
        caption.innerText = expected['caption']
        code.innerText = expected['author'][0]
        author.innerText = expected['author'][1]
        title.innerText = expected['author'][2]
        current.load(expected['audio_url'])
            .then(()=> {
                current.started(); 
                current.seek(expected['current_time']); 
                current.started = current.now();
                current.seekedTo = expected['current_time'];
                current.src = expected['audio_url'];
            });
    }
    if (Math.abs(current.currentTime() - expected.currentTime) > MAX_DESYNC){
        current.seek(expected['current_time'] + MAX_DESYNC/2);
    }
}

const MAX_DESYNC = 2
async function tick() {
    try {
        fetch(`https://us-central1-chatbot-gpt2.cloudfunctions.net/pidgeon?projector=${getProjectorIdFrom(proy,lang)}`)
            .then(response => response.json())
            .then(data => correctAudioState(player,data))
    }finally {
        setTimeout(tick, MAX_DESYNC*1000)
    }
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}
//audio.addEventListener('timeupdate', updateProgress);

function zfill2(n){
    n = Number(n).toString()
    return n.padStart(2,'0')
}

function timeFormat(min,sec){
    return zfill2(min)+":"+zfill2(sec)
}

function getCurrentTimeInMinutes(e){
    const {duration,currentTime} = e.srcElement;
    let min = currentTime ? Math.floor(currentTime/60) : 0;
    let sec = currentTime ? Math.floor(currentTime-(min*60)) : 0;
    return timeFormat(min,sec)
}

function getRemainingTimeInMinutes(e){
    const {duration,currentTime} = e.srcElement;
    let remainingTime = currentTime ? duration-currentTime : 0;
    let min = currentTime ? Math.floor(remainingTime/60): 0;
    let sec = currentTime ? Math.floor(remainingTime-(min*60)) : 0;
    return "-"+timeFormat(min,sec)
}

function updateTimeInfo(e){
    currentTimePos.innerText = getCurrentTimeInMinutes(e);
    remainingTimePos.innerText = getRemainingTimeInMinutes(e);
}

//audio.addEventListener('timeupdate',updateTimeInfo);

// overlay.addEventListener('click', () => {
//     overlay.style.display = "none";
//     tick();
// });

document.addEventListener("DOMContentLoaded", function() {
    lang = params.get("lang");
    lang == 'es' ? setEspanol() : setEnglish();
    //tick();
});

var first = true;

document.body.addEventListener('click', ()=>{
    if(first){
        tick()
        first = false
    }
}
)