var origBoard;
var humanPlayer="O";
var computerPlayer="X";
var difficultylevel = undefined;
const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];
const cells = document.querySelectorAll('.cell');
const level = document.querySelectorAll('.difficulty .level');
const playChar = document.querySelectorAll('.player');
init();

//initiation
function init(){
    for(let i=0;i<level.length;i++){
        level[i].addEventListener('click',setdifficultymode,false);
    }
    for(let i=0;i<playChar.length;i++){
        playChar[i].addEventListener('click',setPlayerChar,false);
    }
    
}
function setdifficultymode(mode){
    level.forEach(elem=>{
        elem.style.backgroundColor = "black";
        elem.style.color = "white"
    });
    let id = mode.target.id;
    document.getElementById(id).style.backgroundColor = "white";
    document.getElementById(id).style.color="black";
    document.querySelector(".startgame button").disabled = false;
    difficultylevel = id;
}
function setPlayerChar(xo){
    playChar.forEach(elem =>{
        elem.style.color = "darkslategray";
    });
    let id = xo.target.id;
    document.getElementById(id).style.color="maroon";
    if(id=="x"){
        computerPlayer = "O";
        humanPlayer = "X";
    }else{
        computerPlayer = "X";
        humanPlayer = "O";
    }
}

function replay(){
    document.querySelector(".endgame").style.display="none";
    document.querySelector(".startgame").style.display="block";
    document.querySelector(".startgame button").disabled = false;
}

//start game logic
function startGame(){
    document.querySelector(".startgame").style.display="none";
    
    origBoard = Array.from(Array(9).keys());
    for(let i=0;i<cells.length;i++){
        cells[i].innerText = '';
        cells[i].style.color = 'black';
        cells[i].addEventListener('click',turnclick,false);
    }
}
function turnclick(square){
    let id = square.target.id;
    let gameWonturn = false;
    if(typeof origBoard[id.substring(1)]=='number'){
        gameWon = turn(id,humanPlayer);
        
        if(!checkTie() && !gameWon){
            
            turn("q"+bestSpot(),computerPlayer);
        }
        if(checkTie() && !gameWon) declareWinner("tie");
    
    }
   
}
function turn(squareId,player){
    let Id = parseInt(squareId.substring(1));
    origBoard[Id] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard,player);
    if(gameWon){ 
        gameOver(gameWon);
        declareWinner(player);
        return true;
    }
   return false
}
function checkWin(board,player){
    let plays = board.reduce((a,v,i)=>
       (v===player)?a.concat(i):a,[]);
    let gameWon = null;
    for(let [index,win] of winningCombos.entries()){
        // check if player has played any of winning combs
        if(win.every(elem=>plays.indexOf(elem) > -1)){
            // return player and index of winning combo
            gameWon = {index: index,player: player};
            break;
        }
    }
    return gameWon
}
function gameOver(gameWon){
    for(let index of winningCombos[gameWon.index]){
       
        document.getElementById("q"+index).style.color = 
        gameWon.player === humanPlayer?'blue':'red';
    }
    
}

function bestSpot(){
    if(difficultylevel == "easy"){
        let spots =emptyspace(origBoard);
        return spots[Math.floor(Math.random() * spots.length)];
    }else if (difficultylevel == "normal"){
        return minMax(origBoard,computerPlayer);
    }
    let spot = minMax(origBoard,computerPlayer);
    let hspot = minMax(origBoard,humanPlayer);
    let cloneBoard = origBoard.slice();
    let cloneBoard2 = origBoard.slice();
    cloneBoard[hspot] = humanPlayer;
    cloneBoard2[spot] = computerPlayer;
    
    if(checkWin(cloneBoard,humanPlayer) && !checkWin(cloneBoard2,computerPlayer)){
        return hspot;
    }
    return spot; 
    
    
}

function emptyspace(board){
    return board.filter(s => typeof s=='number');
}
function checkTie(){
    if(emptyspace(origBoard).length==0){
        return true;
    }
    return false;
}

function declareWinner(who) {
    let message = "Its a tie!";
    if(who === humanPlayer){
        message = "You won!"
    }else if(who === computerPlayer){
        message = "You lose."
    }
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = message;
    cells.forEach(element => {
        element.removeEventListener('click',turnclick,false);
    });
    
}
function minMax(board,player){
    var avaiableSpot = emptyspace(board);
    if(checkWin(board,humanPlayer)){
        return -10;
    }else if(checkWin(board,computerPlayer)){
        return 10;
    }else if(avaiableSpot.length === 0){
        return 0;
    }
    
    var moves=[];
    for(let i=0;i<avaiableSpot.length;i++){
        var spot = avaiableSpot[i];
        var move ={};
        move.index = board[spot];
        board[spot] = player;
        if(player === computerPlayer){
            move.score = minMax(board,humanPlayer);
            
        }else{
            move.score =minMax(board,computerPlayer);

        }
        board[spot] = move.index;
        moves.push(move);
    }
    
    var bestmove;
    if(player === computerPlayer){
        var bestscore = Number.MIN_VALUE;
        moves.forEach(mov=>{
            if(mov.score > bestscore){
              bestscore = mov.score;
              bestmove = mov.index;  
            }
        });
    }else{
        var bestscore = Number.MAX_VALUE;
        moves.forEach(mov=>{
            if(mov.score < bestscore){
              bestscore = mov.score;
              bestmove = mov.index;  
            }
        });
    }
   
    return bestmove;

}