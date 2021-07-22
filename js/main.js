'use strict'
var gLevel = {
    size: 4,
    mines: 2,
    lives: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    currScore: 0
}

var gBoard;
const MINE = '💣';
const FLAG = '🚩';
const LIVE = '❤';
const NORMAL_SMILE = '😊';
const SAD_SMILE = '😥';
const WIN_SMILE = '😎';
var livesCounter;
var clicksCount;
var gCellCount = (gLevel.size * gLevel.size);
var firstClickI;
var firstClickJ;

function init() {
    clicksCount = 0;
    stopTimer()
    gBoard = buildBoard(gLevel.size, gLevel.size);
    printMat(gBoard);
    livesCounter = gLevel.lives;
    livesCount();
    printScore();
    gGame.shownCount = 0;
    gGame.minesCount = 0;
    gGame.markedCount = 0;
    gGame.currScore = 0;
    gCellCount = gLevel.size * gLevel.size;
    safeBtnClickCount = 3;
    printSafeClicksCount();
    gGame.isOn = true;
    document.querySelector('.smiley h2').innerHTML = NORMAL_SMILE;
}

function cellClicked(elCell) {
    if (gGame.isOn) {
        var cellCoord = getCellCoord(elCell.className);
        var currCell = gBoard[cellCoord.i][cellCoord.j];
        if (currCell.isShown) return;
        clicksCount++;
        if (clicksCount === 1) {
            startTimer();
            firstClickI = cellCoord.i;
            firstClickJ = cellCoord.j;
            elCell.style.backgroundColor = 'lightblue';
            setMines(gBoard);
            gGame.currScore++
            setMinesNegsCount(gBoard);
        }
        if (currCell.isMarked) return;
        if (currCell.isMine && livesCounter <= 1) {
            elCell.innerText = MINE;
            elCell.style.backgroundColor = 'tomato';
            currCell.isShown = true;
            mineClicked(elCell);
        }
        if (currCell.isMine && livesCounter > 1) {
            livesCounter--;
            livesCount();
            elCell.innerText = MINE;
            elCell.style.backgroundColor = 'tomato';
            currCell.isShown = true;
            setTimeout(() => {
                currCell.isShown = false;
                elCell.innerText = '';
                elCell.style.backgroundColor = 'rgba(241, 229, 112, 0.884)';
            }, 750);
        }
        if (currCell.minesAroundCount > 0 && !currCell.isMine) {
            currCell.isShown = true;
            gGame.shownCount++;
            elCell.style.backgroundColor = 'lightblue';
            elCell.innerText = currCell.minesAroundCount;
        }
        if (currCell.minesAroundCount === 0 && !currCell.isMine) {
            expandShown(gBoard, cellCoord.i, cellCoord.j);
            currCell.isShown = true;
        }

        printScore()
        checkIfWin()
    }
}

function setMines(board = gBoard) {
    var randI;
    var randJ;
    for (var i = 0; i < gLevel.mines; i++) {
        randI = getRandomInteger(0, gLevel.size);
        randJ = getRandomInteger(0, gLevel.size);
        if (randI === firstClickI && randJ === firstClickJ) {
            i--;
            randI = getRandomInteger(0, gLevel.size);
            randJ = getRandomInteger(0, gLevel.size);
        } else {
            board[randI][randJ].isMine = true;
        }
    }

}

function setMinesNegsCount(board = gBoard) {
    var cellNegsCount;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            cellNegsCount = countNeighbors(i, j, board);
            board[i][j].minesAroundCount = cellNegsCount;
        }
    }
}

function cellMarked(elCell) {
    if (gGame.isOn) {

        document.addEventListener('contextmenu', event => event.preventDefault());
        var cellCoord = getCellCoord(elCell.className);
        var currCell = gBoard[cellCoord.i][cellCoord.j];
        if (currCell.isShown && currCell.isMine && livesCounter > 0) {
            gGame.markedCount++
            currCell.isMarked = true;
            elCell.innerHTML = FLAG;
        } else if (!currCell.isShown) {
            currCell.isMarked = true;
            elCell.innerHTML = FLAG;
            gGame.markedCount++
        } else if (!currCell.isShown && currCell.isMine) {
            gGame.markedCount++
            currCell.isMarked = true;
            elCell.innerHTML = FLAG;
        }
        checkIfWin()
    }
}

function mineClicked(elCell) {
    livesCounter--;
    livesCount();
    gGame.minesCount++;
    if (livesCounter === 0) {
        var time = stopTimer();
        var currCell;
        var elCell;
        bestScore(gGame.currScore, gLevel.size);
        gGame.isOn = false;
        document.querySelector('.smiley h2').innerHTML = SAD_SMILE;
        localStorage.setItem(`${gLevel.size}timer`, time);
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

function checkIfWin() {
    if (gGame.shownCount === (gCellCount - gLevel.mines) && gGame.markedCount === gLevel.mines) {
        stopTimer();
        bestScore(gGame.currScore, gLevel.size);
        document.querySelector('.smiley h2').innerHTML = WIN_SMILE;
        console.log('win');
    };
}

function levelSelect(size, mines, lives = 2) {
    gLevel.size = size;
    gLevel.mines = mines;
    gLevel.lives = lives;
    gBoard = buildBoard(gLevel.size, gLevel.size);
    gCellCount = (gLevel.size * gLevel.size);
    printMat(gBoard);
    clicksCount = 0;
    gGame.shownCount = 0;
    gGame.minesCount = 0;
    gGame.markedCount = 0;
    gGame.currScore = 0;
    safeBtnClickCount = 3;
    gGame.isOn = true;
    livesCounter = lives;
    printSafeClicksCount();
    livesCount();
    stopTimer();
    document.querySelector('.smiley h2').innerHTML = NORMAL_SMILE;
}

function expandShown(mat, cellI, cellJ) {
    var elCell;
    var currCell;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            currCell = mat[i][j];
            if (!currCell.isShown) {
                currCell.isShown = true;
                gGame.shownCount++;
            }
            elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.style.backgroundColor = 'lightblue';
            elCell.innerText = currCell.minesAroundCount;
        }
    }
}

function livesCount() {
    document.querySelector('.lives span').innerHTML = '';
    for (var i = 0; i < livesCounter; i++) {
        document.querySelector('.lives span').innerHTML += LIVE;
    }
}