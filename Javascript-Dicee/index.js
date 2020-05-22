document.querySelector("button").addEventListener("click", playGame);

function playGame() {
  var randomNumber1 = Math.random() * 6;
  randomNumber1 = Math.floor(randomNumber1) + 1;
  var imgName = "images/dice" + randomNumber1 + ".png";
  document.querySelector(".img1").setAttribute("src", imgName);

  var randomNumber2 = Math.random() * 6;
  randomNumber2 = Math.floor(randomNumber2) + 1;
  imgName = "images/dice" + randomNumber2 + ".png";
  document.querySelector(".img2").setAttribute("src", imgName);

  if (randomNumber1 > randomNumber2) {
    document.querySelector("h1").innerHTML = "🚩Player 1 wins!";
  } else if (randomNumber2 > randomNumber1) {
    document.querySelector("h1").innerHTML = "Player 2 wins!🚩";
  } else {
    document.querySelector("h1").innerHTML = "Draw!";
  }
}
