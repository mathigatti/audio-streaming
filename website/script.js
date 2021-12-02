// const proybtns = document.getElementsByClassName("proybtn")
// const proyButtons = Array.from(proybtns).reduce(function(obj,x){
//     obj[x.id] = x;
//     return obj;
// },{});
const langButton = document.getElementById("langbtn")
const audio = document.getElementById('audio');
const caption = document.getElementById('caption');
const code = document.getElementById('expo-code');
const author = document.getElementById('expo-author');
const proyText = document.getElementById('proy');

var captions = {};
var authors = {};
var lang = 'es';
var proy = 1;

langButton.addEventListener('click', ()=>{
    if(lang=='es'){
        lang = 'en'
        langButton.innerHTML = "ES | <b>EN</b>"
        proyText.innerText = `Projector ${proy}`
    } else {
        lang = 'es'
        langButton.innerHTML = "<b>ES</b> | EN"
        proyText.innerText = `Proyector ${proy}`
    }
})

function setAudioSource(filename){
    audio.src = `../audios/${filename.substring(0,4)}/${filename}.mp3`;
}

fetch('../audios/captions.json')
  .then(response => response.json())
  .then(data => captions = data);

fetch('../audios/code_authors.json')
  .then(response => response.json())
  .then(data => authors = data);


function correctAudioState(current,expected){
    if (!current.src.includes(expected['filename'])){
        setAudioSource(expected['filename'])
        caption.innerText = captions[expected['caption_id']]
        code.innerText = authors[expected['code_author_id']][0]
        author.innerText = authors[expected['code_author_id']][1]
    }
    if (Math.abs(audio.currentTime - expected.currentTime) > MAX_DESYNC){
        audio.currentTime = expected['current_time'] + MAX_DESYNC/2;
    }
    audio.play();
}

const MAX_DESYNC = 2
async function tick() {
    try {
        fetch(`../p${proy}${lang}`)
            .then(response => response.json())
            .then(data => correctAudioState(audio,data))
    } finally {
       setTimeout(tick, 2000)
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    //tick();
});