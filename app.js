$("document").ready(function(){

  $.ajaxSetup({
  headers: { 'Client-ID': 'i6wrjklokku6t99xpmmlwqu78xoacp' }
});


      $.ajax({
      type: 'GET',
      url: 'https://api.twitch.tv/helix/users?login=',

       success: function(data) {
         console.log(data);
       }
     });





});





function navTranstion
//search for the name or your favourite streamer
