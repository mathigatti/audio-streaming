const playbtns = document.getElementsByClassName("playbtn")
const playButtons = Array.from(playbtns).reduce(function(obj,x){
    obj[x.id] = x;
    return obj;
},{});
