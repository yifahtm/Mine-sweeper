'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min
}


function getRandNum() {
    var randIdx = getRandomInt(0, gNums.length)
    var num = gNums[randIdx]
    gNums.splice(randIdx, 1)[0]
    return num
}


function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}



//////////////////////////////////////////////////////////////////////
// Timers

//my timer-count-down
function timer() {
    var count = 13
    const timer = setInterval(function () {
        count--
        console.log(count)
        var eltimer = document.querySelector('.timer')
        eltimer.innerText = `TIME:${count}.000`
        if (count === 0) {
            clearInterval(timer);
            alert("Time's up!")
        }
        //return count
    }, 1000)
}


// Count-up Timer
function startTimer() {

    if (gTimerInterval) clearInterval(gTimerInterval)

    gTimerInterval = setInterval(() => {
        const timeDiff = Date.now() - startTime

        const seconds = getFormatSeconds(timeDiff)
        const milliSeconds = getFormatMilliSeconds(timeDiff)

        document.querySelector('span.seconds').innerText = seconds
        document.querySelector('span.milli-seconds').innerText = milliSeconds

    }, 10)
}

function getFormatSeconds(timeDiff) {
    const seconds = Math.floor(timeDiff / 1000)
    return (seconds + '').padStart(2, '0')
}

function getFormatMilliSeconds(timeDiff) {
    const milliSeconds = new Date(timeDiff).getMilliseconds()
    return (milliSeconds + '').padStart(3, '0')
}



function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}



///////////////////////////////////////////////////////////////////////
// Game over funcs
function gameOver() {
    console.log('Game Over')
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)
    renderCell(gPacman.location, '💩')
    gGame.foodCount = 60
    gGame.isOn = false
    gGame.isVictory = false

    showModal()
}

function gameWon() {
    console.log(gGame.foodCount)
    console.log('You Won!')
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)
    gGame.foodCount = 60
    gGame.isOn = false
    gGame.isVictory = true
    console.log(gGame.foodCount)
    showModal()
}



/////////////////////////////////////////////////////////////////////
// Restart related stuff

function onInitGame() {
    gGamerPos = { i: 2, j: 9 }
    gBoard = buildBoard()
    gBallsRemaining = 2
    gBallsCollected = 0
    startTimers()
    renderBoard(gBoard)
}


function onRestart() {
    onHideRestart()
    onInitGame()

}

function onShowRestart() {
    var elRestartBtn = document.querySelector('.restart')
    elRestartBtn.style.display = 'inline'
}

function onHideRestart() {
    var elRestartBtn = document.querySelector('.restart')
    elRestartBtn.style.display = 'none'
}


showModal()


function onPlayAgain() {
    onInit()
    hideModal()
}




//////////////////////////////////////////////////////////////////////
//Board stuff

function createBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = getRandNum()
        }
    }
    return board
}




function buildBoard() {
    // DONE: Create the Matrix 10 * 12 
    // DONE: Put FLOOR everywhere and WALL at edges

    const board = []
    const rowsCount = 10
    const colsCount = 12
    for (var i = 0; i < rowsCount; i++) {
        board.push([])
        for (var j = 0; j < colsCount; j++) {
            board[i][j] = { type: FLOOR, gameElement: null }
            if (i === 0 || i === rowsCount - 1 ||
                j === 0 || j === colsCount - 1) {
                board[i][j].type = WALL
            }
        }
    }

    // DONE: Place the gamer and two balls
    console.log(board)
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[5][5].gameElement = BALL
    board[7][2].gameElement = BALL
    board[0][5].type = board[5][0].type = board[9][5].type = board[5][11].type = FLOOR
    board[0][5].gameElement = board[5][0].gameElement = board[9][5].gameElement = board[5][11].gameElement = null
    return board
}




function renderBoard(board) {

    const elBoard = document.querySelector('.board')
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            var cellClass = getClassName({ i, j })
            // console.log('cellClass:', cellClass)

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'

            strHTML += `\t<td class="cell ${cellClass}" onclick="moveTo(${i},${j})" >\n`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG
            }

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    // console.log(strHTML)
    elBoard.innerHTML = strHTML
}



function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location)
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value

}


function onCellClicked(elCell, cellI, cellJ) {
    var currCell = gBoard[cellI][cellJ]
    var elDisplayNum = document.querySelector('.display-num')
    if (currCell === gNumsCopy[0]) {
        // The color in the td does change on click, but the td background color is overriding it for some reason
        elCell.classList.add('clicked')
        gNumsCopy.shift()
        elDisplayNum.innerText = gNumsCopy[0]
        elCell.style.backgroundColor = 'lightsalmon'
        if (gNumsCopy.length === 0) {
            alert('Game Over')

        }
    }
    console.log(gNumsCopy)
    console.log(elCell)
    console.log(cellI, cellJ)
    var elBoard = document.querySelector('tbody.board')
    console.log(elBoard)
}



function resetNums() {
    gNums = []
    for (var i = 1; i <= gBoardSize ** 2; i++) {
        gNums.push(i)
    }

}


/////////////////////////////////////////////////////////////////////
// Empty pos


function placeRandomBall() {
    var cell = getRandomEmptyCell()
    gBoard[cell.i][cell.j].gameElement = BALL
    gBallsRemaining++
    renderCell(cell, BALL_IMG)
    countNeighbouringBalls()
}


function getEmptyPos() {
    const emptyPoss = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell === EMPTY) {
                emptyPoss.push({ i, j })
            }
        }
    }
    if (!emptyPoss.length) return null
    const randIdx = getRandomIntInclusive(0, emptyPoss.length - 1)
    return emptyPoss[randIdx]
}





//Neighbor loop

function countNeighbouringBalls() {
    // function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0
    const cellI = gGamerPos.i
    const cellJ = gGamerPos.j
    var elNeighborSpan = document.querySelector('.neighbor-balls span')

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            if (gBoard[i][j].gameElement === 'BALL') neighborsCount++
            elNeighborSpan.innerText = neighborsCount
        }
    }
    return neighborsCount
}



