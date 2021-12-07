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
    x.addEventListener('click', () => window.location.href = "player.html?proy="+(i+1)+"&lang="+lang)
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

document.addEventListener("DOMContentLoaded", function() {
    lang = params.get("lang");
    lang == 'es' ? setEspanol() : setEnglish()
});

