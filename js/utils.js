'use strict'
function buildBoard(rows = 4, cols = 4) {
    var board = [];
    for (var i = 0; i < rows; i++) {
        board.push([]);
        for (var j = 0; j < cols; j++) {
            board[i].push(
                {
                    minesAroundCount: 0,
                    isShown: false,
                    isMine: false,
                    isMarked: false
                });
        }
    }
    return board;
}

function printMat(mat) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var className = 'cell cell-' + i + '-' + j;
            strHTML += '<td class="' + className +
                '" onclick="cellClicked(this)" oncontextmenu="cellMarked(this)" > ' + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board');
    elContainer.innerHTML = strHTML;
}

function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j].isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}

function getCellCoord(strCellId) {
    var parts = strCellId.split('-')
    var coord = { i: +parts[1], j: +parts[2] };
    return coord;
}

// get empty cells
function getEmptyCells(board) {
    
    var emptyCells = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isShown || board[i][j].isMarked ) continue;
            if (board[i][j].isMine ) continue;
            emptyCells.push({ i, j });
        }
    }
    return emptyCells;
}


function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var time1 = Date.now();
var myTime;
function startTimer() {
    time1 = Date.now();
    myTime = setInterval(timeCycle, 1);
}

function timeCycle() {
    var time2 = Date.now();
    var msTimeDiff = time2 - time1;
    var timeDiffStr = new Date(msTimeDiff).toISOString().slice(17, -1);
    document.querySelector('.stopwatch h2').innerHTML = timeDiffStr;

}

function stopTimer() {
    clearInterval(myTime);
    var finishTime = document.querySelector('.stopwatch h2').innerHTML;
    return finishTime;
    // alert('Done at: ' + finishTime);
}