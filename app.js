(function(document,window){
const submitBtn= document.getElementById("submitIcon");
const inputField= document.getElementById("inputField");
const navArr = Array.from(document.getElementsByClassName("navBtn"));
const circle=  Array.from(document.getElementsByClassName("circle"));
let cards=Array.from(document.getElementsByClassName("cardContainer"));
let streamers=[];


let userCard ={};

function getTwitchData(options){



  let query=options.query;
  let param=options.param;
  let paramValue=options.paramValue;
  let callback=options.callback;




  $.ajaxSetup({
  headers: { 'Client-ID': 'i6wrjklokku6t99xpmmlwqu78xoacp' }
  });


      $.ajax({
      type: 'GET',
      url: 'https://api.twitch.tv/helix/'+query+"?"+param+"="+paramValue,

      success: function (data){
        callback(data);
      }
     });




}//end of getTwitchData

function initQuery(event){

  event.preventDefault();

  if(inputField.value===""){
    console.log("empty");
  }
  else{
    //reset user data for future queries
    userCard={};

    checkUserExistence();
  }


}

function checkUserExistence(){


  getTwitchData({query:"users",param:"login",paramValue:inputField.value.toLowerCase(),callback:handleUserData});

  hidePlaceHolderText();




}//end of checkUserExistence

function getUserStatus(){


    getTwitchData({query:"streams",param:"user_login",paramValue:inputField.value.toLowerCase(),callback:handleStreamData});





}//end of getUserStatus

function getGameInfo(data){


    //get game data
    getTwitchData({query:"games",param:"id",paramValue:data.data[0].game_id,callback:handleGameData});

    //store them in the obj



}//end of getGameInfo

function handleUserData(data){



  if(typeof data.data[0] ==="undefined"){
    //user does not exist
    //do something
    console.log("User not existent:", userCard);
    showWarning();
  }
  else{

    //store user data;
    userCard.streamer=data.data[0].display_name;
    userCard.streamerImage=data.data[0].profile_image_url;
    //check user status
    getUserStatus();

  }

  console.log("User:",data);



}//end of handleUserData

function handleStreamData(data){

  if(typeof data.data[0] ==="undefined"){
    //user is offline
    //return  and create the card with just user basic data
    userCard.status="offline";
    userCard.isStreaming="offline";
    console.log("User offline:", userCard);
    console.log("constructing only user");
    renderStreamerCard();

  }
  else{
    //user is streaming, store streaming data
   //get game info
   userCard.streamName=data.data[0].title;
   userCard.streamImage=data.data[0].thumbnail_url;
   userCard.views=data.data[0].viewer_count;
   userCard.isStreaming="online";
   userCard.game="";

   console.log("Stream:",data);
   getGameInfo(data);
  }


}//end of handleStreamData

function handleGameData(data){

  userCard.status="playing ";
  userCard.game=data.data[0].name;
  console.log("User online:", userCard);

  console.log("Game:",data);
  console.log("constructing complete");

  //end of handleGameData;
  renderStreamerCard();
}

function renderStreamerCard(){

  if(streamers.indexOf(inputField.value.toLowerCase())===-1){

    streamers.push(inputField.value.toLowerCase());
    clearInputField();



    var template = $('#streamerCardTemplate').html();
    // console.log(userCard);
    Mustache.parse(template);   // optional, speeds up future uses
    var rendered = Mustache.render(template, userCard);
    document.getElementById("streamContainer").innerHTML+=rendered;


    cards=Array.from(document.getElementsByClassName("cardContainer"));
    filterAll(cards);
    resetNavMarkerPosition();
    console.log("render");

  }






}//end of renderStreamerCard;

function clearInputField(){

  document.getElementById("inputField").value="";

}

function navTranstion(event){

  let target;

  if(event.target.classList.contains("circle")){
    target=event.target.parentNode;
  }
  else{
     target=event.target;
  }

  let marker = document.getElementById("btnMarker");
  let rect=marker.getBoundingClientRect();
  let width=rect.width;
  let parentWidth=width*3;
  let left=rect.left;


  marker.style.left=(parentWidth/3)*navArr.indexOf(target)+"px";


}

function setStreamContainerHeight(){

      let mainContainer=document.getElementById("mainContainer");
      let container=document.getElementById("streamContainer");
      let header=document.getElementById("header");
      let footer=document.getElementById("footer");


      container.style.height=(mainContainer.offsetHeight -header.offsetHeight - footer.offsetHeight) + "px";

      container.style.marginTop=header.offsetHeight +"px";


}

function hidePlaceHolderText(){

    document.getElementsByClassName("placeHolderText")[0].style.display="none";
}

function filterAll(cards){

  cards.forEach(function(card){

    card.style.display="flex";


  });

}

function filterOnline(cards){

  cards.forEach(function(card){

      if(card.classList.contains("offline")){
        card.style.display="none";
      }

      if(card.classList.contains("online")){
        card.style.display="flex";
      }


  });


}

function filterOffline(cards){

  cards.forEach(function(card){

      if(card.classList.contains("online")){
        card.style.display="none";
      }

      if(card.classList.contains("offline")){
        card.style.display="flex";
      }


  });

}

function filterStreamsByStatus(event){


    let target;

    if(event.target.classList.contains("circle")){
      target=event.target.parentNode;
    }
    else{
       target=event.target;
    }

    if(target.classList.contains("onlineFilter")){

        // console.log("online");
        filterOnline(cards);

        setActiveClass(target);




    }
    else if(target.classList.contains("offlineFilter")){


        // console.log("offline");
        filterOffline(cards);
        setActiveClass(target);

    }
    else{

      filterAll(cards);
      setActiveClass(target);





    }



}//filterStreamsByStatus

function allowEnterKeyPressOnInput(event){

  if(event.keyCode==13){
     event.preventDefault();
  }
}//allowEnterKeyPressOnInput

function showWarning(){

    let warningDiv=document.getElementById("warning");

    warning.style.top="40px";

    setTimeout(function(){warning.style.top="0";},2500);


}//showWarning

function setActiveClass(target){

  navArr.forEach(function(btn){
      if(btn !==target){
          if(btn.classList.contains("active")){
            btn.classList.remove("active");
          }
      }
      else{
        if(!btn.classList.contains("active")){
          btn.classList+=(" active");
        }
      }

  });
}

function resetNavMarkerPosition(){


  let marker = document.getElementById("btnMarker");

  marker.style.left=0;

  navArr.forEach(function(el){

    if(el.classList.contains("active")){
      el.classList.remove("active");
    }


  });

  navArr[0].classList+=" active";



}

window.addEventListener("resize",setStreamContainerHeight);
window.addEventListener("load",setStreamContainerHeight);
submitBtn.addEventListener("click", initQuery );
navArr.forEach(function(el){el.addEventListener("click",navTranstion);});
navArr.forEach(function(el){el.addEventListener("click",filterStreamsByStatus);});
inputField.addEventListener("keyPress",allowEnterKeyPressOnInput);


})(document,window);
