// is javascript running?
console.log("script is working! Let's play some Towers");

// variables
let disk = null;
let numOfDisks = 3;
let maxNumOfDisks = 8;
let diskArray = [];
for (let i = 2; i < 9; i++) diskArray.push(i);
if (localStorage.getItem("index") !== 1) index = parseInt(localStorage.getItem("index"));

// add disks to game
function addDisks () {
  index = (index + 1) % diskArray.length;
  numOfDisks = diskArray[index];
  populateBoard();
  minPossibleNumOfMoves();
}

// take away disks
function removeDisks () {
  index = (index - 1 + diskArray.length) % diskArray.length;
  numOfDisks = diskArray[index];
  populateBoard();
  minPossibleNumOfMoves();
}

/* 
 * ----- POPULATE THE BOARD -----
*/
function populateBoard () {
  numOfDisks = diskArray[index]
  document.getElementById('num-of-disks').textContent = numOfDisks;

  let s = document.getElementById("source");
  let a = document.getElementById("auxillary");
  let d = document.getElementById("destination");
  
  // remove all disks from board before populating
  while (s.firstChild || a.firstChild || d.firstChild) {
    if (d.firstChild) d.removeChild(d.firstChild);
    else if (a.firstChild) a.removeChild(a.firstChild);
    else if (s.firstChild) s.removeChild(s.firstChild);
  }

  // populate source tower with 'numOfDisks' disks
  for (let i=1; i<=numOfDisks; i++) {
      let disk = document.createElement("div") // create a disk
      disk.setAttribute("class", "disk");
      disk.setAttribute("id", "disk"+i);
      disk.setAttribute("ondragstart", "dragStart(event)"); // allow the disk to be draggable      
      document.getElementById("source").appendChild(disk); // append the disk on the first tower
  }

  disksDraggable()
}

// calculate the minimum number of moves to solve the game
function minPossibleNumOfMoves () {
  let solution = (2**numOfDisks)-1;
  if (solution < 10) document.querySelector("#min-possible-moves").innerHTML = "00" + solution;
  else if (solution < 100) document.querySelector("#min-possible-moves").innerHTML = "0" + solution;
  else document.querySelector("#min-possible-moves").innerHTML = solution;
}

// add 1 to score each time a disk is moved
function addToScore () {
  let score = document.querySelector("#score").innerText;
  score = (parseInt(score) < 9) ? "00" + (parseInt(score)+1) : "0" + (parseInt(score)+1);
  document.querySelector("#score").innerHTML = score;
}

/*
 * ----- MAKE EACH DISK DRAGGABLE -----
*/ 
const towers = document.getElementsByClassName("tower");
function disksDraggable () {
  Array.from(towers).forEach(tower => {
    if (tower.childElementCount < 1) return
    Array.from(tower).forEach(disk => disk.setAttribute("draggable", "false"))
    tower.firstElementChild.setAttribute("draggable", "true"); // set first disk's draggability to true
  })
}

/*
 * ----- ILLEGAL MOVES -----
*/ 
function illegalMoveModal () {
    document.getElementById('illegal-move-modal').style.display = "block";
}

// preventing the user from placing a larger disk on a smaller one
function isLegalMove (event) {
  const data = event.dataTransfer.getData("disk");
    // is the cursor over the actual tower
    if (event.target.classList[0] == "tower") {
        // does the tower have any disks
        if (event.target.children[0] === undefined) {
            event.target.prepend(document.getElementById(data));
            addToScore();
        }
        // if the tower contains disks, is the top disk smaller than the current disk being dragged
        else if (data < event.target.children[0].getAttribute("id")) {
            event.target.prepend(document.getElementById(data));
            addToScore();
        }
        else if (data == event.target.children[0].getAttribute("id")) {
            event.target.prepend(document.getElementById(data));
        }
        // if these conditions arent met, it must be an illegal move
        else illegalMoveModal();
    }
    // is the cursor near the tower
    else if (event.target.children[0].children[0] === undefined) {
        event.target.children[0].prepend(document.getElementById(data));
        addToScore();
    }
    else if (data < event.target.children[0].children[0].getAttribute("id")) {
        event.target.children[0].prepend(document.getElementById(data));
        addToScore();
    }
    else if (data == event.target.children[0].children[0].getAttribute("id")) {
        event.target.children[0].prepend(document.getElementById(data));
    }
    else illegalMoveModal();
}

// functions to drag the disks from tower to tower
// the start of the drag
function dragStart(event) {
  event.dataTransfer.setData("disk", event.target.id);
  event.dataTransfer.effectAllowed = "move";
} 
// dragging the disk
function dragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}
// entering a tower div
function dragEnter(event) {
    
}
function dragend(event) {
  event.preventDefault();
}
// dropping the disk
function drop(event) {
  event.preventDefault();
  const { id } = event.target
  isLegalMove(event); // check if move is illegal
  // check for win condition on drop
  if (id === 'destination') isComplete(event.target.childElementCount);
  else if (id === 'destination-area') isComplete(event.target.children[0].childElementCount)
  disksDraggable();
}

// event listener for when towers are clicked
for (tower of towers) {
    tower.addEventListener('click', function (tower) {
        if (disk == null) {
            disk = tower.target.firstElementChild;
        } else {
            tower.target.prepend(disk);
            addToScore();
            disk = null;
        }
    })
}

/*
 * ----- MODALS -----
*/ 
// open the "learn to play" modal by clicking the button
document.getElementById('open-modal').addEventListener('click', () => {
    document.getElementById('modal').style.display = "block";
});

// close the modal
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('modal').style.display = "none";
}); 

document.getElementById('close-illegal-move-modal').addEventListener('click', () => {
    document.getElementById('illegal-move-modal').style.display = "none";
}); 

/*
 * ----- START OVER -----
*/ 
document.getElementById("reload").addEventListener('click', () => {
  localStorage.setItem("index", diskArray.indexOf(numOfDisks));
  window.location.reload();
});

/*
 * ----- END GAME -----
*/ 
// check to see if the game is complete
function isComplete (childElementCount) {
  if (childElementCount !== numOfDisks) return
  displayCongratulations();
}

function displayCongratulations () {
  document.getElementById("congrats").style.display = "initial"
  party.confetti(congrats , {
    debug: false,
    gravity: 600,
    shapes: "roundedRectangle",
    count: party.variation.range(70,90),
    zIndex: 99999,
  });
}

// set the board
populateBoard();
disksDraggable();
minPossibleNumOfMoves();