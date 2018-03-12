$("document").ready(function(){

  $.ajaxSetup({
  headers: { 'Client-ID': 'i6wrjklokku6t99xpmmlwqu78xoacp' }
});


      $.ajax({
      type: 'GET',
      url: 'https://api.twitch.tv/helix/users?login=shroud',

       success: function(data) {
         console.log(data);
       }
     });





});

let navBtns=document.getElementsByClassName("navBtn");
var navArr = Array.prototype.slice.call( navBtns );


  console.log(navArr);

  navArr.forEach(function(el){

    console.log(el);

  el.addEventListener("click",navTranstion);
});

function navTranstion(event){


  let target=event.target;
  let marker = document.getElementById("btnMarker");

  let rect=marker.getBoundingClientRect();

  let width=rect.width;
  let parentWidth=width*3;
  let left=rect.left;

  console.log(parentWidth,width,left);
  console.log(navArr.indexOf(target));

  marker.style.left=(parentWidth/3)*navArr.indexOf(target)+"px";

  console.log(marker.style.left);

}
//search for the name or your favourite streamer
