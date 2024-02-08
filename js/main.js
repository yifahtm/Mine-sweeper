'use strict'
const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''
var gBoard = []
var gLevel = [
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

}

function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel[0].size; i++) {
        board.push([])
        for (var j = 0; j < gLevel[0].size; j++) {
            board[i][j] = createCell(i, j)
        }
    }
    puttingMines(board)
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


            strHTML += `<td data-i=${i} data-j=${j} onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j})" class="cell ${className} "><span class="hidden">${cellDisplay}</span></td>`

        }
        strHTML += '</tr>'

    }

    const elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML
}

function puttingMines(board) {
    board[0][2].isMine = true
    board[2][3].isMine = true

}

function getMinesNegsCount(cellI, cellJ, board) {
    var MineCount = 0

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine) MineCount++
        }
    }
    console.log(board)

    return MineCount
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            const cellMinesNegsCount = getMinesNegsCount(i, j, board)
            const cell = board[i][j]
            console.log(cellMinesNegsCount)
            if (cellMinesNegsCount) {
                cell.minesAroundCount = cellMinesNegsCount
            } else {
                cell.minesAroundCount = EMPTY
            }
            // console.log (`setMinesNegsCount: cell [${i}][${j}] minesAroundCount: ${cellMinesNegsCount}`)
        }
    }
    console.log(board)
}

function onCellClicked(elCell, cellI, cellJ) {
    console.log(elCell)
    // var elCell = document.querySelector(`.cell-${cellI}-${cellJ}`)
    if (!elCell) {
        return
    }
    if (elCell.classList.contains('clicked')) return
    var elCellSpan = elCell.querySelector('span')
    var cell = gBoard[cellI][cellJ]

    if (elCell.classList.contains('marked')) return
    elCell.classList.add('clicked')
    elCellSpan.classList.remove('hidden')
    cell.isShown = true
    gGame.shownCount++

    checkGameOver(elCell, cellI, cellJ)
    console.log(cell.isShown)
    console.log(gGame.shownCount)

}

function onCellMarked(elCell, cellI, cellJ) {
    console.log(elCell)

    // var elCell = document.querySelector(`.cell-${cellI}-${cellJ}`)
    var cell = gBoard[cellI][cellJ]
    if (!cell.isMarked) {
        elCell.classList.add('marked')
        elCell.innerText = FLAG
        cell.isMarked = true
        gGame.markedDown++
        console.log(cell.isMarked)
        console.log(gGame.markedDown)
    } else {
        elCell.classList.remove('marked')
        cell.isMarked = false
        gGame.markedDown--
        console.log(cell.isMarked)
        console.log(gGame.markedDown)
    }

    // elCell.classList.toggle('marked')
    // if (elCell.classList.contains('marked')) {
    //     elCell.innerText = FLAG
    // } else {
    //     elCell.innerHTML = originalText
    // }
}

function checkGameOver(elCell, cellI, cellJ) {
    var cell = gBoard[cellI][cellJ]
    var expectedCount = (gLevel.size ** 2) - gLevel.mines
    if (cell.isMine) {
        gameOver()
    } else {
        if (gGame.shownCount === 14 && gGame.markedDown === gLevel.mines) {
            victory()
        }
        console.log(gGame.markedDown)
    }
}

function gameOver() {
    gGame.isOn = false
    gGame.isVictory = false
    gGame.shownCount = 0
    gGame.markedDown = 0
    gGame.secsPassed = 0
    showModal()
}

function victory() {
    gGame.isOn = false
    gGame.isVictory = true
    gGame.shownCount = 0
    gGame.markedDown = 0
    gGame.secsPassed = 0
    showModal()
}

function onPlayAgain() {
    onInit()
    hideModal()
}

function showModal() {

    const elModal = document.querySelector('.modal')
    const elModalMsg = elModal.querySelector('.modal .res-message')
    elModal.classList.remove('hide')

    if (gGame.isVictory) elModalMsg.innerText = 'Victorious!'

    if (!gGame.isVictory) elModalMsg.innerText = 'Game Over!'
}

function hideModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hidden')
}

function expandShown(board, elcell, cellI, cellJ) {

}
