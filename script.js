const boardDiv = document.querySelector('.board')
const block = document.querySelector('.block')
const modal = document.querySelector('.modal')
const startGameModal = document.querySelector('.start-game-modal')
const startGameButton = document.querySelector('#start-game')
const restartGameModal = document.querySelector('.restart-game-modal')
const restartGameButton = document.querySelector('#restart-game')
const themeButton = document.querySelector('#theme')
const mainContainer = document.querySelector('#main')
const speedButtons = document.querySelectorAll('.speedBtn')
const scoreDiv = document.querySelector('#score')
const highScoreDiv = document.querySelector('#highScore')
const timerDiv = document.querySelector('#timer')
const gameOverHighScorePara = document.querySelector('#gameOverHighScore')
const startGameHighScorePara = document.querySelector('#startGameHighScore')
const touchButtons = document.querySelectorAll('.touchBtns')

const mobile = (window.innerWidth <= 450) ? 450 : 0
const tablet = (window.innerWidth <= 1030 && window.innerWidth > 450) ? 1030 : 0

let blockWidthAndHeight = 0
if (mobile !== 0) {
    blockWidthAndHeight = 20
}
else if (tablet !== 0) {
    blockWidthAndHeight = 35
}
else {
    blockWidthAndHeight = 50
}
const rows = Math.floor(boardDiv.clientHeight / blockWidthAndHeight)
const cols = Math.floor(boardDiv.clientWidth / blockWidthAndHeight)
let blocks = []
let paused = false
let speed = 0
let score = 0
let timer = '0:0'
let [min, sec] = timer.split(':').map(Number)
let highScore = Number(localStorage.getItem('highScore')) || 0
let snake = [
    { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) },
]
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
const directionArr = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft']
let direction = directionArr[Math.floor(Math.random() * directionArr.length)]
let theme = localStorage.getItem('theme') || 'Dark'

function countTimer() {
    sec++
    if (sec > 59) {
        sec = 0
        min++
    }
    timer = `${min} : ${sec}`
    timerDiv.textContent = `Timer: ${timer}`
}
let timerInterval = null;

mainContainer.setAttribute('theme', theme)
startGameHighScorePara.textContent = `Your, High Score is ${highScore}`
highScoreDiv.textContent = `High Score: ${highScore}`
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div')
        block.classList.add('block')
        boardDiv.appendChild(block)
        blocks[`${row}-${col}`] = block
    }
}
let snakeRenderInterval = null
function renderIntervalFnc() {
    modal.style.display = 'none'
    snakeRenderInterval = setInterval(() => {
        render()
    }, speed);
}
function clearAll() {
    startGameModal.style.display = 'none'
    restartGameModal.style.display = 'flex'
    modal.style.display = 'flex'
    speed = 0
    restartGameButton.classList.add('button-disabled')
    speedButtons.forEach(b => { b.classList.remove('speedBtnClicked') })
    score = 0
    scoreDiv.textContent = 'Score: 0'
    gameOverHighScorePara.textContent = `Your, High Score is ${highScore}`
    timerDiv.textContent = 'Timer: 0:0'
}
function render() {
    if (paused) return;
    let head = null
    blocks[`${food.x}-${food.y}`].classList.add('food')
    if (direction === 'ArrowRight') {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    }
    else if (direction === 'ArrowLeft') {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    }
    else if (direction === 'ArrowUp') {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }
    else if (direction === 'ArrowDown') {
        head = { x: snake[0].x + 1, y: snake[0].y }
    }
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearAll()
        clearInterval(timerInterval)
        clearInterval(snakeRenderInterval)
        return
    }
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i]
        if (head.x === segment.x && head.y === segment.y) {
            clearAll()
            clearInterval(timerInterval)
            clearInterval(snakeRenderInterval)
            return
        }
    }
    snake.forEach((segment, idx) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove(
            'fill-level-1', 'fill-level-2', 'fill-level-3', 'fill-level-4', 'fill-level-5'
        )
        if (idx === 0) {
            blocks[`${segment.x}-${segment.y}`].classList.remove(
                'head-level-1', 'head-level-2', 'head-level-3', 'head-level-4', 'head-level-5'
            )
        }
    })
    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove('food')
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        snake.forEach((segment, idx) => {
            if (segment.x == food.x && segment.y == food.y) {
                console.log('hello');
                blocks[`${food.x}-${food.y}`].classList.remove('food')
                food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
                blocks[`${food.x}-${food.y}`].classList.add('food')
                return
            }
        })
        score += 5
        scoreDiv.textContent = `Score: ${score}`
        if (highScore < score) {
            highScore = score
            localStorage.setItem('highScore', score.toString())
            highScoreDiv.textContent = `High Score: ${highScore}`
        }
        snake.push(head)
    }

    snake.unshift(head)
    snake.pop()
    snake.forEach((segment, idx) => {
        if (score <= 25) {
            blocks[`${segment.x}-${segment.y}`].classList.add('fill-level-1')
            if (idx === 0) {
                blocks[`${segment.x}-${segment.y}`].classList.remove('fill-level-1')
                blocks[`${segment.x}-${segment.y}`].classList.add('head-level-1')
            }
        }
        else if (score <= 50) {
            blocks[`${segment.x}-${segment.y}`].classList.add('fill-level-2')
            if (idx === 0) {
                blocks[`${segment.x}-${segment.y}`].classList.remove('fill-level-2')
                blocks[`${segment.x}-${segment.y}`].classList.add('head-level-2')
            }
        }
        else if (score <= 100) {
            blocks[`${segment.x}-${segment.y}`].classList.add('fill-level-3')
            if (idx === 0) {
                blocks[`${segment.x}-${segment.y}`].classList.remove('fill-level-3')
                blocks[`${segment.x}-${segment.y}`].classList.add('head-level-3')
            }
        }
<<<<<<< HEAD
        else if (score <= 200) {
=======
        else if (score <= 150) {
>>>>>>> 65b077aab54d2fb8415eb26707e53fd661674b3a
            blocks[`${segment.x}-${segment.y}`].classList.add('fill-level-4')
            if (idx === 0) {
                blocks[`${segment.x}-${segment.y}`].classList.remove('fill-level-4')
                blocks[`${segment.x}-${segment.y}`].classList.add('head-level-4')
            }
        }
        else {
            blocks[`${segment.x}-${segment.y}`].classList.add('fill-level-5')
            if (idx === 0) {
                blocks[`${segment.x}-${segment.y}`].classList.remove('fill-level-5')
                blocks[`${segment.x}-${segment.y}`].classList.add('head-level-5')
            }
        }

    })
}

function restartGame() {
    modal.style.display = 'none'
    snake.forEach((segment, idx) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove(
            'fill-level-1', 'fill-level-2', 'fill-level-3', 'fill-level-4', 'fill-level-5'
        )
        if (idx === 0) {
            blocks[`${segment.x}-${segment.y}`].classList.remove(
                'head-level-1', 'head-level-2', 'head-level-3', 'head-level-4', 'head-level-5'
            )
        }
    })
    blocks[`${food.x}-${food.y}`].classList.remove('food')
    snake = [{ x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }]
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
    blocks[`${food.x}-${food.y}`].classList.add('food')
    direction = directionArr[Math.floor(Math.random() * directionArr.length)]
    timerInterval = setInterval(countTimer, 1000)
    renderIntervalFnc()
}
speedButtons.forEach((e) => {
    e.addEventListener('click', () => {
        speedButtons.forEach(b => { b.classList.remove('speedBtnClicked') })
        const type = e.getAttribute('for')
        e.classList.add('speedBtnClicked')

        if (type == 'slowSpeed') speed = 400
        else if (type == 'mediumSpeed') speed = 200
        else if (type == 'highSpeed') speed = 100
        startGameButton.classList.remove('button-disabled')
        restartGameButton.classList.remove('button-disabled')

    })
})
startGameButton.addEventListener('click', () => {
    if (!speed) return
    renderIntervalFnc()
    timerInterval = setInterval(countTimer, 1000)
})
restartGameButton.addEventListener('click', () => {
    if (!speed) return
    timer = '0:0'
    min = 0
    sec = 0
    restartGame()
})


addEventListener('keydown', e => {
    if (e.key === "Escape") {
        paused = !paused;
        return;
    }
    if (directionArr.includes(e.key)) {
        if ((direction === 'ArrowRight' && e.key === 'ArrowLeft') || (direction === 'ArrowDown' && e.key === 'ArrowUp') || (direction === 'ArrowLeft' && e.key === 'ArrowRight') || (direction === 'ArrowUp' && e.key === 'ArrowDown')) {
            return
        }
        direction = e.key;
    }
})
if (touchButtons.length > 0) {
    touchButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            let type = btn.getAttribute('for')
            if (type === "Escape") {
                paused = !paused;
                return;
            }
            if (directionArr.includes(type)) {
                if ((direction === 'ArrowRight' && type === 'ArrowLeft') || (direction === 'ArrowDown' && type === 'ArrowUp') || (direction === 'ArrowLeft' && type === 'ArrowRight') || (direction === 'ArrowUp' && type === 'ArrowDown')) {
                    return
                }
                direction = type;
            }
        })
    })
}

themeButton.addEventListener('click', () => {
    theme = (theme === 'Light') ? 'Dark' : 'Light';
    localStorage.setItem('theme', theme);
    mainContainer.setAttribute('theme', theme);
    themeButton.textContent = `Theme: ${(theme == 'Light') ? 'Dark' : 'Light'}`
});
