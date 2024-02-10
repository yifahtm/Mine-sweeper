'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min
}

function getElementByIndx(i, j) {
    const className = `cell-${i}-${j}`
    const callSelector = '.' + className
    const elCell = document.querySelector(callSelector)
    return elCell
}

function onDarkMode() {
    const body = document.body
    const elDarkText = document.querySelector('.dark-btn')
    const elVideo = document.querySelector('.background-video')
    body.classList.toggle('dark-mode')
    elDarkText.innerText = body.classList.contains('dark-mode') ? '☀ Switch to Light Mode' : '🌙 Switch to Dark Mode'
    if (body.classList.contains('dark-mode')) {
        elVideo.style.display = 'none'
    } else {
        elVideo.style.display = 'block'
    }
}

function getHiddenCells() {
    var hiddenCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (!cell.isShown && !cell.isMarked && !cell.isMine) hiddenCells.push({ i, j })
        }
    }
    return hiddenCells
}

function onPlayAgain() {
    clearInterval(gTimerInterval)
    gGame.isOn = false
    gGame.isVictory = false
    resetgGame()
    gBoard = buildBoard()
    RandomPuttingMines(gBoard)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    hideModal()
}

function onRestart() {
    clearInterval(gTimerInterval)
    gGame.isOn = false
    gGame.isVictory = false
    resetgGame()
    gBoard = buildBoard()
    RandomPuttingMines(gBoard)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    //onInit()
    // gGame.isOn = true
}

function showModal() {
    const elModal = document.querySelector('.modal')
    const elModalMsg = elModal.querySelector('.res-message')
    elModal.classList.remove('hide')
    if (gTimerInterval) clearInterval(gTimerInterval)
    if (!gGame.isVictory) elModalMsg.innerText = 'Victorious!'
    if (!gGame.isVictory) elModalMsg.innerText = 'Game Over!'
}

function hideModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hide')
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