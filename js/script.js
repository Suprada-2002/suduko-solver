//loard-board
const easy = [
  "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
  "685329174971485326234761859362574981549618732718293465823946517197852643456137298",
];
const medium = [
  "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
  "619472583243985617587316924158247369926531478734698152891754236365829741472163895",
];
const hard = [
  "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
  "712583694639714258845269173521436987367928415498175326184697532253841769976352841",
];

//varibles
var timer;
var timeREading;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function () {
  //run start game btn when clicked
  id("start-btn").addEventListener("click", startGame);

  //add event listener to each nu,ber in number container
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].addEventListener("click", function () {
      //if selecting is not disabled
      if (!disableSelect) {
        //if number is selected - remove selection
        if (this.classList.contains("selected")) {
          this.classList.remove("selected");
          selectedNum = null;
        } else {
          //deslect other no
          for (let i = 0; i < 9; i++) {
            id("number-container").children[i].classList.remove("selected");
          }
          this.classList.add("selected");
          selectedNum = this;
          updateMove();
        }
      }
    });
  }
};

function startGame() {
  //choose diff
  let board;
  if (id("diff-1").checked) board = easy[0];
  else if (id("diff-2").checked) board = medium[0];
  else board = hard[0];

  //set  lives
  lives = 3;
  disableSelect = false;
  id("lives").textContent = "Lives Remaining: 3";

  //generate borad based on difficulty
  generateBoard(board);

  ///start timer
  startTimer();
  //set theme
  if (id("theme-1").checked) {
    qs("body").classList.remove("dark");
  } else {
    qs("body").classList.add("dark");
  }

  //show number conatiner
  id("number-container").classList.remove("hidden");
}

function startTimer() {
  //set time remaning based on input
  if (id("time-1").checked) timeRemaning = 180;
  else if (id("time-2").checked) timeRemaning = 300;
  else timeRemaning = 600;

  //set timer for first second
  id("timer").textContent = timeConversion(timeRemaning);
  //sets timer to update every second
  timer = setInterval(function () {
    timeRemaning--;
    //if no timeremaning-end game
    if (timeRemaning === 0) endGame();
    id("timer").textContent = timeConversion(timeRemaning);
  }, 1000);
}

function timeConversion(time) {
  //convert second into mm:ss format
  let minutes = Math.floor(time / 60);
  if (minutes < 10) minutes = "0" + minutes;
  let seconds = time % 60;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}

function generateBoard(board) {
  //clear prev board:
  clearPrevious();

  let idCount = 0;
  //create 81 tiles
  for (let i = 0; i < 81; i++) {
    let tile = document.createElement("p");
    if (board.charAt(i) != "-") {
      //set tile text to that number
      tile.textContent = board.charAt(i);
    } else {
      //add click event listener to tile
      tile.addEventListener("click", function () {
        if (!disableSelect) {
          if (tile.classList.contains("selected")) {
            tile.classList.remove("selected");
            selectedTile = null;
          } else {
            for (let i = 0; i < 81; i++) {
              qsa(".tile")[i].classList.remove("selected");
            }
            tile.classList.add("selected");
            selectedTile = tile;
            updateMove();
          }
        }
      });
    }
    //assign tile id
    tile.id = idCount;
    idCount++;
    //add title class
    tile.classList.add("tile");
    if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
      tile.classList.add("bottomBorder");
    }
    if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
      tile.classList.add("rightBorder");
    }

    //add tile to board
    id("board").appendChild(tile);
  }
}

function updateMove() {
  //if a tile and a number is selected
  if (selectedTile && selectedNum) {
    selectedTile.textContent = selectedNum.textContent;
    if (checkCorrect(selectedTile)) {
      selectedTile.classList.remove("selected");
      selectedNum.classList.remove("seleceted");
      selectedNum = null;
      selectedTile = null;
      if (checkDone()) {
        endGame();
      }
    } else {
      disableSelect = true;
      selectedTile.classList.add("incorrect");
      setTimeout(function () {
        lives--;
        if (lives === 0) {
          endGame();
        } else {
          id("lives").textContent = "Lives Remaining: " + lives;
          disableSelect = false;
        }
        selectedTile.classList.remove("incorrect");
        selectedTile.classList.remove("selected");
        selectedNum.classList.remove("selected");
        selectedTile.textContent = "";
        selectedTile = null;
        selectedNum = null;
      }, 1000);
    }
  }
}

function checkDone() {
  let tiles = qsa(".tile");
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].textContent === "") return false;
  }
  return true;
}

function endGame() {
  disableSelect = true;
  clearTimeout(timer);
  if (lives === 0 || timeRemaning === 0) {
    id("lives").textContent = "you lost!";
  } else {
    id("lives").textContent = "you won!";
  }
}

function checkCorrect(tile) {
  let solution;
  if (id("diff-1").checked) solution = easy[1];
  else if (id("diff-2").checked) solution = medium[1];
  else solution = hard[1];

  if (solution.charAt(tile.id) === tile.textContent) return true;
  else return false;
}

function clearPrevious() {
  //access all tile
  let tiles = qsa(".tile");
  //remove all tile
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].remove();
  }
  //clear timer
  if (timer) clearTimeout(timer);

  //deselect any number
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].classList.remove("selected");
  }

  //clear selected varible
  selectedNum = null;
  selectedTile = null;
}

//helper functions
function id(id) {
  return document.getElementById(id);
}

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}
