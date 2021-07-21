'use strict'
var gBoard;
var gLevel = {
    size: 4,
    mines: 2,
    lives: 2
}
const MINE = '💣';
const FLAG = '🚩';
const LIVE = '❤';
const NORMAL_SMILE = '😊';
const SAD_SMILE = '😥';
const WIN_SMILE = '😎';
var livesCounter;
var clicksCount = 0;

function init() {
    clicksCount = 0;
    stopTimer()
    gBoard = buildBoard(gLevel.size, gLevel.size);
    printMat(gBoard);
    livesCounter = gLevel.lives;
    livesCount();
    document.querySelector('.smiley').innerHTML = NORMAL_SMILE;
    console.table(gBoard);
}

function setMines(board) {
    var randI;
    var randJ;
    for (var i = 0; i < gLevel.mines; i++) {
        randI = getRandomInteger(0, gLevel.size);
        randJ = getRandomInteger(0, gLevel.size);
        board[randI][randJ].isMine = true;
    }

}

function setMinesNegsCount(board) {
    var cellNegsCount;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            cellNegsCount = countNeighbors(i, j, board);
            board[i][j].minesAroundCount = cellNegsCount;
        }
    }
}

function cellClicked(elCell) {
    // console.log(clicksCount)
    clicksCount++;
    if (clicksCount === 1) {
        startTimer();
        setMines(gBoard);
        setMinesNegsCount(gBoard);
        elCell.style.backgroundColor = 'lightblue';
        // console.log(gBoard)
    }
    // elCell.classList.add('selected');
    var cellCoord = getCellCoord(elCell.className);
    var currCell = gBoard[cellCoord.i][cellCoord.j];
    if (currCell.isMarked) return;
    if (currCell.isMine) {
        elCell.innerText = MINE;
        elCell.style.backgroundColor = 'red';
        mineClicked();
    }
    if (currCell.minesAroundCount > 0 && !currCell.isMine) {
        currCell.isShown = true;
        elCell.style.backgroundColor = 'lightblue';
    }
    if (currCell.minesAroundCount === 0 && !currCell.isMine) {
        expandShown(gBoard, cellCoord.i, cellCoord.j)
        currCell.isShown = true;

    }
    if (currCell.minesAroundCount > 0 && !currCell.isMine) elCell.innerText = currCell.minesAroundCount;
    checkIfWin()
}

function cellMarked(elCell) {
    document.addEventListener('contextmenu', event => event.preventDefault());
    var cellCoord = getCellCoord(elCell.className);
    var currCell = gBoard[cellCoord.i][cellCoord.j];
    if (!currCell.isShown) {
        currCell.isMarked = true;
        elCell.innerHTML = FLAG;
    }
    checkIfWin()
}

function checkIfWin() {
    var currCell;
    var cellCount = gLevel.size * gLevel.size;
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            currCell = gBoard[i][j];
            if (currCell.isMine && currCell.isMarked && !currCell.isShown) cellCount--;
            if (!currCell.isMine && !currCell.isMarked && currCell.isShown) cellCount--;
        }
    }
    if (cellCount === 0) {
        stopTimer();
        document.querySelector('.smiley').innerHTML = WIN_SMILE;
        console.log('win');
    }
}

function mineClicked() {
    livesCounter--;
    livesCount()
    if (livesCounter === 0) {
        stopTimer();
        var currCell;
        var elCell;
        document.querySelector('.smiley').innerHTML = SAD_SMILE;
        for (var i = 0; i < gLevel.size; i++) {
            for (var j = 0; j < gLevel.size; j++) {
                currCell = gBoard[i][j];
                if (currCell.isMine) {
                    currCell.isShown = true;
                    elCell = document.querySelector(`.cell-${i}-${j}`)
                    elCell.innerText = MINE;
                }
            }
        }
    }

}

function levelSelect(size, mines, lives = 2) {
    console.log(gBoard)
    gLevel.size = size;
    gLevel.mines = mines;
    gLevel.lives = lives;
    gBoard = buildBoard(gLevel.size, gLevel.size);
    printMat(gBoard);
    clicksCount = 0;
    livesCounter = lives;
    livesCount();
    stopTimer();
    document.querySelector('.smiley').innerHTML = NORMAL_SMILE;
}

function expandShown(mat, cellI, cellJ) {
    var elCell;
    var currCell;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            currCell = mat[i][j];
            if (j < 0 || j >= mat[i].length) continue;
            if (!mat[i][j].isShown) mat[i][j].isShown = true;
            elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.style.backgroundColor = 'lightblue';
            elCell.innerText = currCell.minesAroundCount;
        }
    }
}

function livesCount() {
    // console.log(livesCounter)
    document.querySelector('.lives span').innerHTML = '';
    for (var i = 0; i < livesCounter; i++) {
        document.querySelector('.lives span').innerHTML += LIVE;
    }

}