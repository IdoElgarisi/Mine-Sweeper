'use strict'
var beginnerBestScore = localStorage.getItem("beg score");
var beginnerBestTime = localStorage.getItem("4timer");
var mediumBestScore = localStorage.getItem("med score");
var mediumBestTime = localStorage.getItem("8timer");
var expertBestScore = localStorage.getItem("exp score");
var expertBestTime = localStorage.getItem("12timer");
var safeBtnClickCount;

function printScore() {
    gGame.currScore = gGame.shownCount;
    document.querySelector('.score span').innerHTML = gGame.currScore;
    // Beginner
    document.querySelector('.beginnerScore').innerHTML = beginnerBestScore
    document.querySelector('.beginnerTime').innerHTML = beginnerBestTime;
    // Medium
    document.querySelector('.mediumScore').innerHTML = mediumBestScore;
    document.querySelector('.mediumTime').innerHTML = mediumBestTime;
    // Expert
    document.querySelector('.expertScore').innerHTML = expertBestScore;
    document.querySelector('.expertTime').innerHTML = expertBestTime;
}

function bestScore(score, level) {
    if (level === 4) {
        if (score > beginnerBestScore) {
            beginnerBestScore = score;
            beginnerBestTime=document.querySelector('.stopwatch h2').innerHTML;
            localStorage.setItem("4timer", beginnerBestTime);
            localStorage.setItem("beg score", beginnerBestScore);
        }
        
    }
    if (level === 8) {
        if (score > mediumBestScore) {
            mediumBestScore = score;
            mediumBestTime=document.querySelector('.stopwatch h2').innerHTML;
            localStorage.setItem("med score", mediumBestScore);
            localStorage.setItem("8timer", mediumBestTime);
        }
    }
    if (level === 12) {
        if (score > expertBestScore) {
            expertBestScore = score;
            expertBestTime=document.querySelector('.stopwatch h2').innerHTML;
            localStorage.setItem("exp score", expertBestScore);
            localStorage.setItem("12timer", expertBestTime);
        }
    }
}

function printSafeClicksCount() {
    var str = (safeBtnClickCount < 0) ? 0 : safeBtnClickCount;
    document.querySelector('.safe-btn span').innerText = str;
}

function safeClick() {
    if (safeBtnClickCount > 0) {
        var emptyCell = getEmptyCell();
        var currCell = gBoard[emptyCell.i][emptyCell.j];
        var elCell = document.querySelector(`.cell-${emptyCell.i}-${emptyCell.j}`)
        currCell.isShown = true;
        elCell.style.backgroundColor = 'rgb(83, 166, 218)';
        elCell.innerText = (currCell.isMine) ? MINE : currCell.minesAroundCount;
        setTimeout(() => {
            currCell.isShown = false;
            elCell.innerText = '';
            elCell.style.backgroundColor = 'rgba(241, 229, 112, 0.884)';
        }, 2000);
    }
    safeBtnClickCount--;
    printSafeClicksCount();
}

function getEmptyCell() {
    var emptyCells = getEmptyCells(gBoard);
    var idx = getRandomIntInclusive(0, emptyCells.length - 1);
    var emptyCell = emptyCells[idx];
    return emptyCell;
}
