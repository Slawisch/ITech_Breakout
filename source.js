const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

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

let score = 0;
const countOfBlocks = new Point(10, 5);
let blockSize = new Point(canvas.clientWidth/countOfBlocks.x, canvas.clientHeight/(2.5*countOfBlocks.y));
let rightArrowFlag, leftArrowFlag;
let ball = new Ball(new Point(canvas.clientWidth / 2, canvas.clientHeight - 40), 15, new Point(3, 3));
let racket = new Racket(new Point(canvas.clientWidth / 2, canvas.clientHeight - 10), new Point(120, 20), 10);
let blocks = [];

for(let i = 0; i < countOfBlocks.y; i++){
    blocks[i] = [];
    for(let j = 0; j < countOfBlocks.x; j++){
        blocks[i][j] = true;
    }
}

const interval = setInterval(drawFrame, 50);

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
    for(let i = 0; i < countOfBlocks.y; i++){
        for(let j = 0; j < countOfBlocks.x; j++){
            if(blocks[i][j]){
                ctx.fillStyle = "rgb(159,135,188)";
                ctx.beginPath();
                ctx.rect(
                    j*canvas.clientWidth/countOfBlocks.x, 
                    i*canvas.clientHeight/(2.5*countOfBlocks.y), 
                    canvas.clientWidth/countOfBlocks.x, 
                    canvas.clientHeight/(2.5*countOfBlocks.y));
                ctx.fill();
                ctx.fillStyle = "rgb(7,3,10)";
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function drawText(){
    ctx.font = "20px Arial";
    ctx.fillStyle = "rgb(22,50,46)";
    ctx.fillText("Score: " + score, 10, canvas.offsetHeight/2);
}

function drawFrame()
{
    checkCollisions();
    
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    drawRacket(racket);
    drawBlocks();
    drawBall(ball);
    drawText();

    switch (true) {
        case (ball.pos.x <= ball.radius): 
            ball.velocity.x *= -1; 
            break;
        case (ball.pos.x >= canvas.clientWidth - ball.radius): 
            ball.velocity.x *= -1; 
            break;
    }

    switch (true) {
        case (ball.pos.y <= ball.radius): 
            ball.velocity.y *= -1; 
            break;
        case (ball.pos.y >= canvas.clientHeight - ball.radius):
            ball.velocity.y *= -1;
            break;
        case (ball.pos.y + ball.radius >= racket.pos.y - racket.size.y / 2 &&
            ball.pos.x + ball.radius >= racket.pos.x - racket.size.x / 2 &&
            ball.pos.x - ball.radius <= racket.pos.x + racket.size.x / 2):
            ball.velocity.y = -Math.abs(ball.velocity.y);
            if(leftArrowFlag && ball.velocity.x > -5)
                ball.velocity.x -= 0.91;
            else if(rightArrowFlag && ball.velocity.x < 5)
                ball.velocity.x += 0.91;
            else if(Math.abs(ball.velocity.x) > 1)
                ball.velocity.x -= ball.velocity.x * 0.15;
            break;
        // case (ball.pos.y >=canvas.clientHeight - ball.radius): 
        //     alert("You lose! Score: " + score);
        //     document.location.reload();
        //     clearInterval(interval);
        //     break;
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


function checkCollisions(){
    var blockExist;
    for(let i = 0; i < countOfBlocks.y; i++){
        for(let j = 0; j < countOfBlocks.x; j++){
            if(blocks[i][j]) {
                blockExist = true;
                var collision = false;
                var distX = Math.abs(ball.pos.x - j * blockSize.x - blockSize.x / 2);
                var distY = Math.abs(ball.pos.y - i * blockSize.y - blockSize.y / 2);
                
                console.log(distX + " " + distY + " " + i + " " + j + " " + ball.pos.x + " " + ball.pos.y + " " + (i * blockSize.y + blockSize.y / 2));
                
                if(distX > (blockSize.x/2 + ball.radius)) {continue;}
                if(distY > (blockSize.y/2 + ball.radius)) {continue;}
                
                if(distX <= blockSize.x/2){collision = true;}
                if(distY <= blockSize.y/2){collision = true;}
                
                if(!collision) {
                    var dx = distX - blockSize.x / 2;
                    var dy = distY - blockSize.y / 2;
                    collision = (dx * dx + dy * dy <= (ball.radius * ball.radius));
                }
                
                if(collision){
                    if(ball.pos.x < j*blockSize.x|| ball.pos.x > j*blockSize.x + blockSize.x)
                        ball.velocity.x *= -1;
                    else if(ball.pos.y < i*blockSize.y || (ball.pos.y > i*blockSize.y + blockSize.y)) {
                        ball.velocity.y *= -1;
                    }
                    score += 10;
                    blocks[i][j] = false;
                    return;
                }
            }
        }
    }
    if(!blockExist){
        alert("You won! Score: " + score);
        document.location.reload();
        clearInterval(interval);
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