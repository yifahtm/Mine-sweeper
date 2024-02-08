'use strict'
// The Randomality worked after the play again is clicked. but then i did some changes and went back and it didnt work anymore. Then i only had 4-10 minutes left to finish. I'm hoping an earlier version of my work is saved on github. i'm hoping it will make a difference.

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''
var gTimerInterval
var gBoard = []
var gLevels = [
    {
        size: 4,
        mines: 2,
    }
]

var gGame = {
    isOn: false,
    shownCount: 0,
    markedDown: 0,
    secsPassed: 0,
    isVictory: false
}

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedDown = 0
    gGame.secsPassed = 0
    gGame.isVictory = false
    var elMinesInSpan = document.querySelector('.mines-container .mines-in');
    elMinesInSpan.innerText = gLevels[0].mines
}

function onSetLevel(size, mines) {
    console.log(size, mines)
    gLevels[0].size = size
    gLevels[0].mines = mines
    onInit()
}

function buildBoard() {
    const board = []
    for (var i = 0; i < gLevels[0].size; i++) {
        board.push([])
        for (var j = 0; j < gLevels[0].size; j++) {
            board[i][j] = createCell(i, j)
        }
    }
    //puttingMines(board)
    RandomPuttingMines(board)
    setMinesNegsCount(board)
    return board
}

function createCell(cellI, cellJ) {
    return {
        i: cellI,
        j: cellJ,
        minesAroundCount: 4,
        isShown: false,
        isMine: false,
        isMarked: false
    }
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            var cellDisplay
            const className = `cell cell-${i}-${j}`
            if (cell.isMine) {
                cellDisplay = MINE
            } else {
                cellDisplay = cell.minesAroundCount
            }
            strHTML += `<td data-i=${i} data-j=${j} onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j})" class="${className} "><span class="hidden">${cellDisplay}</span></td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML
}

//hard coaded
function puttingMines(board) {
    board[0][2].isMine = true
    board[2][3].isMine = true
}

//Randomly set mines
function RandomPuttingMines(board) {
    while (gLevels[0].mines > 0) {
        const randRowIdx = getRandomInt(0, gLevels[0].size)
        const randColIdx = getRandomInt(0, gLevels[0].size)
        if (!board[randRowIdx][randColIdx].isMine) {
            var cell = board[randRowIdx][randColIdx]
            cell.isMine = true
            gLevels[0].mines--
        }
    }
}

function getMinesNegsCount(cellI, cellJ, board) {
    var mineCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine) mineCount++
        }
    }
    return mineCount
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            const cellMinesNegsCount = getMinesNegsCount(i, j, board)
            const cell = board[i][j]
            if (cellMinesNegsCount) {
                cell.minesAroundCount = cellMinesNegsCount
            } else {
                cell.minesAroundCount = EMPTY
            }
        }
    }
}

function onCellClicked(elCell, cellI, cellJ) {
    console.log(elCell)
    // var elCell = document.querySelector(`.cell-${cellI}-${cellJ}`)
    if (elCell.classList.contains('clicked')) return
    if (elCell.classList.contains('marked')) return
    var elCellSpan = elCell.querySelector('span')
    var cell = gBoard[cellI][cellJ]
    var expectedCount = (gLevels[0].size ** 2) - gLevels[0].mines
    elCell.classList.add('clicked')
    elCellSpan.classList.remove('hidden')
    cell.isShown = true
    gGame.shownCount++
    if (gGame.shownCount === 1) startTimer()
    //Works, only if i do not put the FLAGS on the first and the last moves. If i do, i have to remove the second condition
    if (gGame.shownCount === expectedCount && gGame.markedDown === gLevels[0].mines) {
        // && gGame.markedDown === gLevels[0].mines
        clearInterval(gTimerInterval)
    }
    expandShown(gBoard, elCell, cellI, cellJ)
    checkGameOver(cellI, cellJ)
}

function startTimer() {

    if (gTimerInterval) clearInterval(gTimerInterval)
    var startTime = Date.now()
    gTimerInterval = setInterval(() => {
        const timeDiff = Date.now() - startTime

        const minutes = getFormatMinutes(timeDiff)
        const seconds = getFormatSeconds(timeDiff)
        const milliSeconds = getFormatMilliSeconds(timeDiff)

        document.querySelector('span.minutes').innerText = minutes
        document.querySelector('span.seconds').innerText = seconds
        document.querySelector('span.milli-seconds').innerText = milliSeconds
    }, 10)
}

function getFormatMinutes(timeDiff) {
    const minutes = Math.floor(timeDiff / 60000)
    return (minutes + '').padStart(2, '0')
}

function getFormatSeconds(timeDiff) {
    const seconds = Math.floor((timeDiff % 60000) / 1000)
    return (seconds + '').padStart(2, '0')
}

function getFormatMilliSeconds(timeDiff) {
    const milliSeconds = new Date(timeDiff).getMilliseconds()
    return (milliSeconds + '').padStart(3, '0')
}

function onCellMarked(elCell, cellI, cellJ) {
    var elMinesMarkedSpan = document.querySelector('.mines-container .mines-marked')
    // var elCell = document.querySelector(`.cell-${cellI}-${cellJ}`)
    var cell = gBoard[cellI][cellJ]
    if (!cell.isMarked) {
        elCell.classList.add('marked')
        elCell.innerText = FLAG
        cell.isMarked = true
        gGame.markedDown++
        elMinesMarkedSpan.innerText = gGame.markedDown
    } else {
        elCell.classList.remove('marked')
        cell.isMarked = false
        gGame.markedDown--
        elMinesMarkedSpan.innerText = gGame.markedDown
    }
    //Marking and Unmarking works, but erases all content that was there before and FLAG remains

    // elCell.classList.toggle('marked')
    // if (elCell.classList.contains('marked')) {
    //     elCell.innerText = FLAG
    // } else {
    //     elCell.innerHTML = originalText
    // }
}

function checkGameOver(cellI, cellJ) {
    var cell = gBoard[cellI][cellJ]
    var expectedCount = (gLevels[0].size ** 2) - gLevels[0].mines
    if (cell.isMine) {
        gameOver()
    } else {
        //Works, only if i do not put the FLAGS on the first and the last moves. If i do, i have to remove the second condition
        if (gGame.shownCount === expectedCount && gGame.markedDown === gLevels[0].mines) {
            //&& gGame.markedDown === gLevels[0].mines
            victory()
        }
    }
}

function gameOver() {
    clearInterval(gTimerInterval)
    gGame.isOn = false
    gGame.isVictory = false
    gGame.shownCount = 0
    gGame.markedDown = 0
    gGame.secsPassed = 0
    showModal()
}

function victory() {
    clearInterval(gTimerInterval)
    gGame.isOn = false
    gGame.isVictory = true
    gGame.shownCount = 0
    gGame.markedDown = 0
    gGame.secsPassed = 0
    showModal()
}

function onPlayAgain() {
    clearInterval(gTimerInterval)
    gGame.isOn = false
    gGame.isVictory = false
    gGame.shownCount = 0
    gGame.markedDown = 0
    gGame.secsPassed = 0
    gBoard = buildBoard()
    RandomPuttingMines(gBoard)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    gGame.isOn = true
    hideModal()
}

function onRestart() {
    clearInterval(gTimerInterval)
    gGame.isOn = false
    gGame.isVictory = false
    gGame.shownCount = 0
    gGame.markedDown = 0
    gGame.secsPassed = 0
    renderBoard(gBoard)
    onInit()
}

function showModal() {
    const elModal = document.querySelector('.modal')
    const elModalMsg = elModal.querySelector('.res-message')
    elModal.classList.remove('hide')
    if (gTimerInterval) clearInterval(gTimerInterval)
    if (gGame.isVictory) elModalMsg.innerText = 'Victorious!'
    if (!gGame.isVictory) elModalMsg.innerText = 'Game Over!'
}

function hideModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hide')
}

//Not working. I tried yesterday, i tried today, went through past classes where we highlight stuff. I checked, its not selecting the cell properly. Tried recursion. Maybe also related to onCellMarked?
function expandShown(board, elCell, cellI, cellJ) {
    //Without Recursion
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            var elNegCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            if (currCell.minesAroundCount === 0 && !currCell.isMine && currCell.isMarked && !currCell.isShown) {
                elNegCell.classList.remove('hidden')
                elNegCell.classList.add('clicked')
                currCell.isShown = true
                // //With Recursion
                // if (currCell.minesAroundCount === 0) {
                //     expandShown(board, elNegCell, i, j)
                // }
            }
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min
}
