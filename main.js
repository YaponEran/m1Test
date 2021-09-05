const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const width = canvas.width = 800
const height = canvas.height = 600
canvas.style.background = 'black'

const centerX = width / 2
const centerY = height / 2

let brick = {
    x: 0,
    y: 0,
    width: 80,
    height: 20,
    color: 'blue',
    gap: 2,
    row: 14,
    column: 10
}

let ball = {
    x: 400,
    y: 500,
    radius: 10,
    color: 'orange',
    speedX: 3,
    speedY: 3
}

let padel = {
    width: 100,
    height: 15,
    x: 400,
    y: 500,
    color: 'white',
    distFromEdge: 60
}

document.body.addEventListener('mousemove', (e)=>{
    let rect = canvas.getBoundingClientRect()
    let root = document.documentElement
    let mouseX = e.clientX - rect.left - root.scrollLeft
    padel.x = mouseX - padel.width / 2
})

let bricks = new Array(brick.column * brick.row)

function drawBricks(){
    for(let row = 0; row < brick.row; row++){

        for(let i = 0; i < brick.column; i++){

            let arrayIndex = brick.column * row + i

            if(bricks[arrayIndex]){
                context.fillStyle = brick.color
                context.fillRect(brick.width * i, brick.height * row , brick.width - brick.gap, brick.height - brick.gap)
            }
        }
    }
}

function brickReset(){
    for(let i = 0; i < brick.column * brick.row; i++){
        bricks[i] = true
    }
}

brickReset()

function drawBall(){
    context.beginPath()
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false)
    context.fillStyle = ball.color
    context.fill()
}

function drawPadel(){
    context.fillStyle = padel.color
    context.fillRect(padel.x, canvas.height - padel.distFromEdge, padel.width, padel.height)
}

function resetBall(){
    ball.x = centerX
    ball.y = centerY
}

// animation logic

function ballMove(){
      // Ball animation logic
      ball.x += ball.speedX
      ball.y += ball.speedY
  
      if(ball.x + ball.radius > width){
          ball.speedX *= -1
      }else if(ball.x < 0 + ball.radius){
          ball.speedX *= -1
      }
  
      if(ball.y + ball.radius > height){
          // ball.speedY *= -1
          resetBall()
      }else if(ball.y < 0 + ball.radius){
          ball.speedY *= -1
      }
}

// ball brick collides
function ballBrickCollide(){

    let ballCol = Math.floor(ball.x / brick.width)
    let ballRow = Math.floor(ball.y / brick.height)

    let rowColToArrayIndex = ballCol + brick.column * ballRow

    if(rowColToArrayIndex >= 0 && rowColToArrayIndex < brick.column * brick.row){
       if(bricks[rowColToArrayIndex]){
            bricks[rowColToArrayIndex] = false
            ball.speedY *= -1
       }
    }

}

// padle ball collides
function ballpaddleCollide(){
    let paddleTopEdgeY = canvas.height - padel.distFromEdge
    let paddleBottomEdgeY = paddleTopEdgeY + padel.height
    let paddleLeftEdgeX = padel.x
    let paddleRightEdheX = padel.x + padel.width

    if(ball.y > paddleTopEdgeY && ball.y < paddleBottomEdgeY && ball.x > paddleLeftEdgeX && ball.x < paddleRightEdheX){
        ball.speedY *= -1

        let centerOfPaddleX = padel.x + padel.width / 2
        let ballDistanceFromPadelCenterX = ball.x - centerOfPaddleX
 
        ball.speedX = ballDistanceFromPadelCenterX * 0.35
    }
}

function animateAll(){

    ballMove()
    ballBrickCollide()
    ballpaddleCollide()

}

function render(){
    context.clearRect(0, 0, width, height)

    drawBall()
    drawPadel()
    drawBricks()
    animateAll()
    requestAnimationFrame(render)
}

render()