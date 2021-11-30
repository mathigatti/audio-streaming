const playbtns = document.getElementsByClassName("playbtn")
const playButtons = Array.from(playbtns).reduce(function(obj,x){
    obj[x.id] = x;
    return obj;
},{});
const langButton = document.getElementById("langbtn")
const audio = document.getElementById('audio');
const caption = document.getElementById('caption');

var captions = {};
var lang = 'es';

//load captions
function getJsonObject(cb){
    // read text from URL location
    var request = new XMLHttpRequest();
    request.open('GET', '../audios/captions.json', true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {

            var type = request.getResponseHeader('Content-Type');
            try {
                    cb(JSON.parse(request.responseText));
            }catch(err) {
                    cb(err);
            }
        }
    }
}
getJsonObject(function(object){
     captions = object;
});

langButton.addEventListener('click', ()=>{
    if(lang=='es'){
        lang = 'en'
        langButton.innerHTML = "ES | <b>EN</b>"
    } else {
        lang = 'es'
        langButton.innerHTML = "<b>ES</b> | EN"
    }
})

function playAudio(proy,lang,n){
    caption.innerText = captions[proy+lang+n];
    audio.src = `../audios/${proy+lang}/${proy+lang+n}.mp3`;
    console.log(audio.src);
    audio.play();
}

function stopAudio(){          
    caption.innerText = "...";
    audio.pause();
}

function seekAudio(time){
    audio.currentTime = time;
}

document.getElementById("seek").addEventListener('click',()=>{
    seekAudio(audio.currentTime+10)
})

Object.keys(playButtons).forEach(key => {
    playButtons[key].addEventListener('click', ()=>{
        playAudio(key,lang,'0002')
        console.log('p1'+lang+'0002')
    })
})