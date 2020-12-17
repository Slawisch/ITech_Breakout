var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

class Point{
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Ball{
    constructor(startPos, radius, velocity) {
        this.pos = startPos;
        this.radius = radius;
        this.velocity = velocity;
    }
}

class Racket{
    constructor(startPos, size, velocity) {
        this.pos = startPos;
        this.size = size;
        this.velocity = velocity;
    }
}

var countOfBlocks = new Point(10, 5);
var rightArrowFlag, leftArrowFlag;
var ball = new Ball(new Point(canvas.clientWidth/2, canvas.clientHeight - 70), 15, new Point(3,3));
var racket = new Racket(new Point((canvas.clientWidth - 60) / 2 , canvas.clientHeight - 20), new Point(120, 20), 10);
var blocks = [];

for(var i = 0; i < countOfBlocks.y; i++){
    blocks[i] = [];
    for(var j = 0; j < countOfBlocks.x; j++){
        blocks[i][j] = true;
    }
}


var interval = setInterval(drawFrame, 10);

function drawBall(ball4draw){
    ctx.fillStyle = "rgb(32,198,170)";
    ctx.beginPath();
    ctx.arc(ball4draw.pos.x, ball4draw.pos.y, ball4draw.radius, 0, Math.PI*2, false);
    ctx.fill();
    ctx.closePath();
}

function drawRacket(racket4draw){
    ctx.fillStyle = "rgb(0,125,231)";
    ctx.beginPath();
    ctx.rect(racket4draw.pos.x - racket4draw.size.x / 2, racket4draw.pos.y - racket4draw.size.y / 2, racket4draw.size.x, racket4draw.size.y);
    ctx.fill();
    ctx.closePath();
}

function drawBlocks(){
    for(var i = 0; i < countOfBlocks.y; i++){
        for(var j = 0; j < countOfBlocks.x; j++){
            if(blocks[i][j]){
                ctx.fillStyle = "rgb(159,135,188)";
                ctx.beginPath();
                ctx.rect(j*canvas.clientWidth/countOfBlocks.x, i*canvas.clientHeight/(2.5*countOfBlocks.y), canvas.clientWidth/countOfBlocks.x, canvas.clientHeight/(2.5*countOfBlocks.y));
                ctx.fill();
                ctx.fillStyle = "rgb(7,3,10)";
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function checkCollisions(){
    for(var i = 0; i < countOfBlocks.y; i++){
        for(var j = 0; j < countOfBlocks.x; j++){
            if(blocks[i][j])
            if(ball.pos.x > j*canvas.clientWidth/countOfBlocks.x && ball.pos.x < j*canvas.clientWidth/countOfBlocks.x+canvas.clientWidth/countOfBlocks.x && ball.pos.y > i*canvas.clientHeight/(2.5*countOfBlocks.y) && ball.pos.y < i*canvas.clientHeight/(2.5*countOfBlocks.y)+canvas.clientHeight/(2.5*countOfBlocks.y)) {
                ball.velocity.y *= -1;
                blocks[i][j] = false;
            }
        }
    }
}

function drawFrame()
{
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    drawBall(ball);
    drawRacket(racket);
    drawBlocks();
    checkCollisions();

    switch (true) {
        case (ball.pos.x <= ball.radius): 
            ball.velocity.x *= -1; 
            break;
        case (ball.pos.x >= canvas.clientWidth - ball.radius): 
            ball.velocity.x *= -1; 
            break;
        // case (ball.pos.x + ball.radius >= racket.pos.x - racket.size.x / 2 &&
        //     ball.pos.y + ball.radius >= racket.pos.y - racket.size.y):
        //     ball.velocity.x *= -1;
        //     break;
        // case (ball.pos.x - ball.radius <= racket.pos.x + racket.size.x / 2 &&
        //     ball.pos.y + ball.radius >= racket.pos.y - racket.size.y):
        //     ball.velocity.x *= -1;
        //     break;
    }

    switch (true) {
        case (ball.pos.y <= ball.radius): 
            ball.velocity.y *= -1; 
            break;
        case (ball.pos.y + ball.radius >= racket.pos.y - racket.size.y / 2 &&
            ball.pos.x >= racket.pos.x - racket.size.x / 2 &&
            ball.pos.x <= racket.pos.x + racket.size.x / 2):
            ball.velocity.y = -Math.abs(ball.velocity.y); 
            break;
        case (ball.pos.y >=canvas.clientHeight - ball.radius): 
            alert("You lose!");
            document.location.reload();
            clearInterval(interval);
            break;
    }

    ball.pos.x += ball.velocity.x;
    ball.pos.y += ball.velocity.y;
    
    if(rightArrowFlag){
        racket.pos.x += racket.velocity;
    }
    
    if(leftArrowFlag){
        racket.pos.x -= racket.velocity;
    }
}

document.addEventListener("keydown", (e) => {
    switch (e.key){
        case "ArrowRight":
            rightArrowFlag = true;
            break;
        case "ArrowLeft":
            leftArrowFlag = true;
            break;
    }
});

document.addEventListener("keyup", (e) => {
    switch (e.key){
        case "ArrowRight":
            rightArrowFlag = false;
            break;
        case "ArrowLeft":
            leftArrowFlag = false;
            break;
    }
});