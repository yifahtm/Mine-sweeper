'use strict'
const MINE = '💣'
const FLAG = '🚩'
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
}

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    gGame.isOn = false
    console.log(gBoard)
}

function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel[0].size; i++) {
        board.push([])
        for (var j = 0; j < gLevel[0].size; j++) {
            board[i][j] = createCell(i, j)
            setMinesNegsCount(i, j)
        }
    }
    puttingBombs(board)

    console.log(board)
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
            const className = `cell cell-${i}-${j}`

            strHTML += `<td data-i=${i} data-j=${j} onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j})" class="cell ${className}"></td>`

        }
        strHTML += '</tr>'
        //oncontextmenu="onCellMarked(this, ${i}, ${j})" 
    }

    const elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML
}

function puttingBombs(board) {


    board[0][2].isMine = true
    board[2][3].isMine = true

}

function setMinesNegsCount(cellI, cellJ) {
    var MineCount = 0

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            if (gBoard[i][j].isMine) MineCount++
        }
    }
    console.log(MineCount)
    return MineCount
}

function onSetLevel(level) {
    gLevel = level
    onInit()
}

// var elCell = document.querySelector(`.cell-${i}-${j}`)

// elCell.innerText = MineCount


function onCellClicked(elCell, cellI, cellJ) {
    var currCell = gBoard[cellI][cellJ]
    elCell.classList.add('clicked')

    elCell.style.backgroundColor = 'lightsalmon'


    var elBoard = document.querySelector('tbody.board')
    console.log(elBoard)
}


function onCellMarked(elCell, cellI, cellJ) {
    console.log(elCell)
}

function checkGameOver() {

}

function expandShown(board, elcell, cellI, cellJ) {

}






function renderCell(location, value) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}
