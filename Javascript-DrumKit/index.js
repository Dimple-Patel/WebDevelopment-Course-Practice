//Add click event Listener to all button
for (var i = 0; i < document.querySelectorAll(".drum").length; i++) {
  document.querySelectorAll("button")[i].addEventListener("click", function() {
    playSound(this.innerHTML);
    buttonAnimation(this.innerHTML);
  });
}
//Add keyboard event handler
document.addEventListener("keypress",function(event){
  playSound(event.key);
  buttonAnimation(event.key);
});

//function to play sound as per key or button pressed
function playSound(charPressed)
{
  switch (charPressed) {
    case "w":
      var tom1=new Audio("sounds/tom-1.mp3");
      tom1.play();
      break;
    case "a":
      var tom2=new Audio("sounds/tom-2.mp3");
      tom2.play();
      break;
    case "s":
      var tom3=new Audio("sounds/tom-3.mp3");
     tom3.play();
      break;
    case "d":
      var tom4=new Audio("sounds/tom-4.mp3");
      tom4.play();
      break;
    case "j":
      var sna=new Audio("sounds/snare.mp3");
      sna.play();
      break;
    case "k":
      var crash=new Audio("sounds/crash.mp3");
      crash.play();
      break;
    case "l":
      var kickbass=new Audio("sounds/kick-bass.mp3");
      kickbass.play();
      break;
    default:
  }
}
function buttonAnimation(key)
{
  var currentButton=document.querySelector("."+key);
  currentButton.classList.add("pressed");
  setTimeout(function(){currentButton.classList.remove("pressed");},100);
}
