'use strict'
// The Randomality worked after the play again is clicked. but then i did some changes and went back and it didnt work anymore. Then i only had 4-10 minutes left to finish. I'm hoping an earlier version of my work is saved on github. i'm hoping it will make a difference.

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''
var gTimerInterval
var gIsFirstClick = true
var gSafeClicks = 3
const gHints = [
    {
        count: 3,
        inUse: false
    },
    {
        count: 3,
        inUse: false
    },
    {
        count: 3,
        inUse: false
    }
]
var gLastClicked = null
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
    markedDownCount: 0,
    secsPassed: 0,
    isVictory: false,
    lives: 3
}

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedDownCount = 0
    gGame.secsPassed = 0
    gGame.isVictory = false
    if (gLevels[0].size === 4) {
        const livesSpan = document.querySelector('.lives')
        gGame.lives = 1
        livesSpan.innerText = gGame.lives
    } else {
        const livesSpan = document.querySelector('.lives')
        gGame.lives = 3
        livesSpan.innerText = gGame.lives
    }
    var elMinesInSpan = document.querySelector('.mines-container .mines-in')
    elMinesInSpan.innerText = gLevels[0].mines
}

function onSetLevel(size, mines) {
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
    // RandomPuttingMines(board)
    // setMinesNegsCount(board)
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
function RandomPuttingMines(board, firstClickI, firstClickJ) {
    var mines = gLevels[0].mines
    while (mines > 0) {
        const randRowIdx = getRandomInt(0, gLevels[0].size)
        const randColIdx = getRandomInt(0, gLevels[0].size)
        if (randRowIdx === firstClickI &&
            randColIdx === firstClickJ
        ) continue
        if (!board[randRowIdx][randColIdx].isMine) {
            var cell = board[randRowIdx][randColIdx]
            cell.isMine = true
            mines--
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

function getMinesLocations(board) {
    const minesLocations = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) {
                minesLocations.push({ i, j })
            }
        }
    }
    return minesLocations
}

function onCellClicked(elCell, cellI, cellJ) {
    gLastClicked = { i: cellI, j: cellJ }
    if (elCell.classList.contains('clicked')) return
    if (elCell.classList.contains('marked')) return

    var elCellSpan = elCell.querySelector('span')
    var cell = gBoard[cellI][cellJ]
    var expectedCount = (gLevels[0].size ** 2) - gLevels[0].mines
    elCell.classList.add('clicked')
    elCellSpan.classList.remove('hidden')
    cell.isShown = true
    gGame.shownCount++
    if (gIsFirstClick) {
        gIsFirstClick = false
        RandomPuttingMines(gBoard, cellI, cellJ)
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        startTimer()
    }
    console.log(gGame.shownCount)
    //Works, only if i do not put the FLAGS on the first and the last moves. If i do, i have to remove the second condition
    if (gGame.shownCount === expectedCount + 1) {
        //  && gGame.markedDownCount === gLevels[0].mines
        clearInterval(gTimerInterval)
    }
    expandShown(gBoard, elCell, cellI, cellJ)
    checkGameOver(cellI, cellJ)
}

function onCellMarked(elCell, cellI, cellJ) {
    gLastClicked = { i: cellI, j: cellJ }
    var elMinesMarkedSpan = document.querySelector('.mines-container .mines-marked')
    const cell = gBoard[cellI][cellJ]
    elCell.classList.toggle('marked')
    if (!cell.isMarked) {
        gGame.markedDownCount++
        cell.isMarked = true
        elCell.innerText = FLAG
        elMinesMarkedSpan.innerText = gGame.markedDownCount
    } else {
        gGame.markedCount--
        cell.isMarked = false
        elCell.innerText = ''
        elMinesMarkedSpan.innerText = gGame.markedDownCount
    }
}

function displayRestOfMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            if (cell.isMine && !cell.isShown) {
                const elCell = getElementByIndx(i, j)
                elCell.style.background = 'red'
                elCell.innerText = MINE
            }
        }
    }
}

function checkGameOver(cellI, cellJ) {
    const elRestartBtn = document.querySelector('.restart-btn')
    const livesSpan = document.querySelector('.lives')
    const cell = gBoard[cellI][cellJ]
    var expectedCount = (gLevels[0].size ** 2) - gLevels[0].mines
    if (cell.isMine) {
        gGame.lives--
        elRestartBtn.innerText = '🤕'
        var smileyTimeout = setTimeout(() => { elRestartBtn.innerText = '😋' }, 1000, elRestartBtn)
        livesSpan.innerText = gGame.lives
        if (gGame.lives === 0) {
            clearTimeout(smileyTimeout)
            gameOver()
        }
    } else {
        //Works, only if i do not put the FLAGS on the first and the last moves. If i do, i have to remove the second condition
        if (gGame.shownCount === expectedCount + 1) {
            // && gGame.markedDownCount === gLevels[0].mines
            //&& gGame.markedDown === gLevels[0].mines
            victory()
        }
    }
}

function gameOver() {
    var elRestartBtn = document.querySelector('.restart-btn')
    clearInterval(gTimerInterval)
    gGame.isOn = false
    gGame.isVictory = false
    gGame.shownCount = 0
    gGame.markedDownCount = 0
    gGame.secsPassed = 0
    displayRestOfMines()
    elRestartBtn.innerText = '🤯'
    showModal()
}

function victory() {
    const elRestartBtn = document.querySelector('.restart-btn')
    clearInterval(gTimerInterval)
    gGame.isOn = false
    gGame.isVictory = true
    gGame.shownCount = 0
    gGame.markedDownCount = 0
    gGame.secsPassed = 0
    elRestartBtn.innerText = '😎'
    showModal()
}

function resetgGame() {
    var elLivesSpan = document.querySelector('.lives')
    var elRestartBtn = document.querySelector('.restart-btn')
    gIsFirstClick = true
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    if (gLevels[0].size === 4) {
        const livesSpan = document.querySelector('.lives')
        gGame.lives = 1
    } else {
        gGame.lives = 3
    }
    gSafeClicks = 3
    updateSafeClkCount()
    resetHints()
    resetExterminate()
    elLivesSpan.innerText = gGame.lives
    elRestartBtn.innerText = '😋'
}

function resetHints() {
    for (var i = 0; i < gHints.length; i++) {
        gHints[i].inUse = false
        gHints[i].count = 3
        var elBtn1 = document.querySelector('.btn-1')
        var elBtn2 = document.querySelector('.btn-2')
        var elBtn3 = document.querySelector('.btn-3')
        elBtn1.innerText = '💡'
        elBtn2.innerText = '💡'
        elBtn3.innerText = '💡'
    }
}

function resetExterminate() {
    var elMinesInSpan = document.querySelector('.mines-container .mines-in')
    var elExBtn = document.querySelector('.exterminate-btn')
    elMinesInSpan.innerText = gLevels[0].mines
    elExBtn.innerText = 'Exterminator!'
}

function expandShown(board, elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue

            const cell = gBoard[i][j]
            const elNegCell = getElementByIndx(i, j)
            if (cell.isMine || cell.isMarked || cell.isShown) continue
            if (elCell.innerText === EMPTY) {
                gGame.shownCount++
                cell.isShown = true
                elNegCell.classList.add('clicked')
                elNegCell.classList.remove('hidden')
                elNegCell.innerText = cell.minesAroundCount === 0 ? '' : cell.minesAroundCount
                //currently not recursing
                if (cell.minesAroundCount === 0 && !cell.isMarked) {
                    console.log('Recursing from', i, j, 'to', cellI, cellJ)
                    expandShown(board, elNegCell, i, j)
                }
            }
        }
    }
}



//Not working. I tried yesterday, i tried today, went through past classes where we highlight stuff. I checked, its not selecting the cell properly. Tried recursion. Maybe also related to onCellMarked?
// function expandShown(board, elCell, cellI, cellJ) {
//     //Without Recursion
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= board.length) continue
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (i === cellI && j === cellJ) continue
//             if (j < 0 || j >= board[0].length) continue
//             var currCell = board[i][j]
//             var elNegCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
//             if (currCell.minesAroundCount === 0 && !currCell.isMine && currCell.isMarked && !currCell.isShown) {
//                 elNegCell.classList.remove('hidden')
//                 elNegCell.classList.add('clicked')
//                 currCell.isShown = true
//                 // //With Recursion
//                 // if (currCell.minesAroundCount === 0) {
//                 //     expandShown(board, elNegCell, i, j)
//                 // }
//             }
//         }
//     }
// }

function onSafeClick() {
    const elSafeClkSpan = document.querySelector('.safe-click-count')
    if (gSafeClicks === 0) {
        elSafeClkSpan.innerText = "You Out of Safe-Clicks!"
        return
    }
    var safeCell = findSafeCell()
    if (safeCell) {
        markSafeCell(safeCell)
        gSafeClicks--
        updateSafeClkCount()
    }
}

function findSafeCell() {
    var hiddenCells = getHiddenCells()
    if (hiddenCells.length === 0) return
    var randIdx = getRandomInt(0, hiddenCells.length)
    return hiddenCells[randIdx]
}

function getHiddenMineCells() {
    var mines = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (!cell.isShown && !cell.isMarked && cell.isMine) {
                mines.push({ i, j })
            }
        }
    }
    return mines
}

function markSafeCell(cell) {
    var elCell = getElementByIndx(cell.i, cell.j)
    elCell.classList.add('safe-click-marked')
    setTimeout(() => {
        elCell.classList.remove('safe-click-marked')
    }, 2000)
}

function updateSafeClkCount() {
    const elSafeClkSpan = document.querySelector('.safe-click-count')
    elSafeClkSpan.innerText = gSafeClicks
}

function onExterminate() {
    var mines = getHiddenMineCells()
    var mineCount = gLevels[0].mines
    var elMinesInSpan = document.querySelector('.mines-container .mines-in')
    var elExBtn = document.querySelector('.exterminate-btn')
    if (elMinesInSpan.innerText < gLevels[0].mines) {
        elExBtn.innerText = 'Youv\'e already used this...'
        return
    }
    for (var i = 0; i < 3; i++) {
        var mineIdx = getRandomInt(0, mines.length - 1)
        var cellI = mines[mineIdx].i
        var cellJ = mines[mineIdx].j
        mines.splice(mineIdx, 1)
        mineCount--
        elMinesInSpan.innerText = mineCount
        var elCell = getElementByIndx(cellI, cellJ)
        elCell.style.backgroundColor = 'white'
        elCell.innerText = ''
        //getMinesNegsCount(cellI, cellJ, gBoard)
        setMinesNegsCount(gBoard)
    }
}

function onUseHint(hintNumber) {
    const hint = gHints[hintNumber]
    if (hint.count === 0 || hint.inUse) return
    hint.inUse = true
    hint.count--
    changeHintBtn(hintNumber)
}

function changeHintBtn(hintNumber) {
    var elHintBtn
    if (hintNumber === 0) elHintBtn = document.querySelector('.btn-1')
    if (hintNumber === 1) elHintBtn = document.querySelector('.btn-2')
    if (hintNumber === 2) elHintBtn = document.querySelector('.btn-3')
    elHintBtn.style.backgroundColor = 'hsl(53, 88 %, 81 %)'
    elHintBtn.style.fontSize = '30px'
    var safeCells = getHiddenCells()
    var elCellIdx = getRandomInt(0, safeCells.length - 1)
    var cellI = safeCells[elCellIdx].i
    var cellJ = safeCells[elCellIdx].j
    var elCell = getElementByIndx(cellI, cellJ)
    showCell(elCell)
    setTimeout(() => {
        elHintBtn.style.fontSize = '20px'
        elHintBtn.style.backgroundColor = 'white'
        elHintBtn.innerText = ''
    }, 1000)
}

function showCell(elCell) {
    elCell.classList.add('hint')
    setTimeout(() => elCell.classList.remove('hint'), 1000);
}

//I only managed to undo the whole board at the moment
function onUndo() {
    undo(gLastClicked)
}

function undo(lastClick) {
    if (lastClick) {
        const cell = gBoard[lastClick.i][lastClick.j]
        cell.isShown = false
        if (cell.isMarked) {
            cell.isMarked - false
            gGame.markedDownCount--
        }
        gGame.shownCount--
        renderBoard(gBoard)
    }
}

