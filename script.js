console.log("script is working! Let's play some Towers");

// variables
let disk = null;
let numOfDisks = 3;

let numbers = document.getElementById('box');
for (let i = 0; i < 9; i++) {
    var span = document.createElement('span');
    span.textContent = i;
    numbers.appendChild(span);
}
var num = numbers.getElementsByTagName('span');
var index = 0;

function nextNum () {
    num[index].style.display = 'none';
    index = (index + 1) % num.length;
    num[index].style.display = 'initial';
}
function prevNum () {
    num[index].style.display = 'none';
    index = (index - 1 + num.length) % num.length;
    num[index].style.display = 'initial';
}


// document.getElementById("disk-range").value = numOfDisks;
if (localStorage.getItem("numOfDisks") !== 3) numOfDisks = localStorage.getItem("numOfDisks");
document.getElementById("disk-range").value = numOfDisks;

// populate the board with number of disks inputed
function populateBoard () {
    for (let i = 1; i <= numOfDisks; i++) {
        // create a disk
        let disk = document.createElement("div")
        disk.setAttribute("class", "disk");
        disk.setAttribute("id", "disk"+i);

        // allow the disk to be draggable
        disk.setAttribute("ondragstart", "dragStart(event)");

        // append the disk on the first tower
        document.querySelector(".source").appendChild(disk);
    }
}

// calculate the minimum number of moves to solve the game
function minPossibleNumOfMoves (n) {
    let solution = (2**n)-1;
    if (solution < 10) document.querySelector("#min-possible-moves").innerHTML = "00" + solution;
    else if (solution < 100) document.querySelector("#min-possible-moves").innerHTML = "0" + solution;
    else document.querySelector("#min-possible-moves").innerHTML = solution;
}

// add or take away disks
function changeDiskPopulation (value) {
    localStorage.setItem("numOfDisks",document.getElementById("disk-range").value.toString())
    location.reload();
}

// add 1 to score each time a disk is moved
function addToScore () {
    let score = document.querySelector("#score").innerText;
    
    // if counter is less than 10, then fill one 0 before the score
    if (parseInt(score) < 9) score = "00" + (parseInt(score)+1);
    else score = "0" + (parseInt(score)+1);

    // save the new score "number of moves"
    document.querySelector("#score").innerHTML = score;
}


const towers = document.getElementsByClassName("tower");
// a function that makes each of the disks draggable
function disksDraggable () {
    for (tower of towers) {
        // set the disk's draggability to false if it is not on top
        if (tower.hasChildNodes) {
            for (let i=0; i<tower.childElementCount; i++){
                tower.children[i].setAttribute("draggable", "false")
            }
        }
        // tower.children.setAttribute("draggable", "false")
        if (tower.firstElementChild != null) tower.firstElementChild.setAttribute("draggable", "true");
    }
}

function illegalMoveModal () {
    document.getElementById('illegal-move-modal').style.display = "block";
}

// preventing the user from placing a larger disk on a smaller one
function isLegalMove (event, data) {
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
    else illegalMoveModal();
}

// check to see if the game is complete
function isComplete (event, data, n) {
    if (event.target.children[0].classList[1] == "destination") {
        if (event.target.children[0].childElementCount == n) {
            alert("CONGRATULATIONS! YOU DID IT!");
        }
    } else if (event.target.classList[1] == "destination") {
        if (event.target.childElementCount == n) {
            alert("CONGRATULATIONS! YOU DID IT!");
        }
    }
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
    let data = event.dataTransfer.getData("disk");
    isLegalMove(event, data);
    isComplete(event, data, numOfDisks);
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

// set the board
populateBoard();
minPossibleNumOfMoves(numOfDisks);
disksDraggable();

// slider to set how many disks
document.getElementById("disk-range").addEventListener('change', function() {
    let value = document.getElementById("disk-range").value
    changeDiskPopulation(value);
})

// game modals
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

// reset the board
document.getElementById("reload").addEventListener('click', () => {
    window.location.reload();
});