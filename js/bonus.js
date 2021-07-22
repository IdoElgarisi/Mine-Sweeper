'use strict'
var beginnerBestScore = 0;
var mediumBestScore = 0;
var expertBestScore = 0;
var safeBtnClickCount;

function printScore() {
    gGame.currScore = gGame.shownCount;
    document.querySelector('.score span').innerHTML = gGame.currScore;
    // Beginner
    document.querySelector('.beginnerScore').innerHTML = localStorage.getItem("beg score");
    document.querySelector('.beginnerTime').innerHTML = localStorage.getItem("4timer");
    // Medium
    document.querySelector('.mediumScore').innerHTML = localStorage.getItem("med score");
    document.querySelector('.mediumTime').innerHTML = localStorage.getItem("8timer");
    // Expert
    document.querySelector('.expertScore').innerHTML = localStorage.getItem("exp score");
    document.querySelector('.expertTime').innerHTML = localStorage.getItem("12timer");
}

function bestScore(score, level) {
    if (level === 4) {
        beginnerBestScore = (score > beginnerBestScore) ? score : beginnerBestScore;
        localStorage.setItem("beg score", beginnerBestScore);
    }
    if (level === 8) {
        mediumBestScore = (score > mediumBestScore) ? score : mediumBestScore;
        localStorage.setItem("med score", mediumBestScore);
    }
    if (level === 12) {
        expertBestScore = (score > expertBestScore) ? score : expertBestScore;
        localStorage.setItem("exp score", expertBestScore);
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