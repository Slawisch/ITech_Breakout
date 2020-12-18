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

class Block{
    constructor(size, rang, live) {
    this.size = size;
    this.rang = rang;
    this.live = live;
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
        switch (i) {
            case 0:
            case 1:
                blocks[i][j] = new Block(blockSize, 3, true);
                break;
            case 2:
            case 3:
                blocks[i][j] = new Block(blockSize, 2, true);
                break;
            default:
                blocks[i][j] = new Block(blockSize, 1, true);
        }
    }
}

const interval = setInterval(drawFrame, 10);

function drawBall(ball4draw){
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,255,250,0.22)";
    ctx.arc(ball4draw.pos.x, ball4draw.pos.y, ball4draw.radius + 4, 0, Math.PI*2, false);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,255,250,0.5)";
    ctx.arc(ball4draw.pos.x, ball4draw.pos.y, ball4draw.radius + 2, 0, Math.PI*2, false);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "rgb(0,255,250)";
    ctx.arc(ball4draw.pos.x, ball4draw.pos.y, ball4draw.radius, 0, Math.PI*2, false);
    ctx.fill();
    ctx.closePath();
}

function drawRacket(racket4draw){
    ctx.beginPath();
    ctx.fillStyle = "rgba(71,168,255    ,0.22)";
    ctx.rect(racket4draw.pos.x - racket4draw.size.x / 2-4, racket4draw.pos.y - racket4draw.size.y / 2-4, racket4draw.size.x+8, racket4draw.size.y+8);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "rgba(71,168,255,0.49)";
    ctx.rect(racket4draw.pos.x - racket4draw.size.x / 2-2, racket4draw.pos.y - racket4draw.size.y / 2-2, racket4draw.size.x+4, racket4draw.size.y+4);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "rgb(71,168,255)";
    ctx.rect(racket4draw.pos.x - racket4draw.size.x / 2, racket4draw.pos.y - racket4draw.size.y / 2, racket4draw.size.x, racket4draw.size.y);
    ctx.fill();
    ctx.closePath();
}

function drawBlocks(){
    for(let i = 0; i < countOfBlocks.y; i++){
        for(let j = 0; j < countOfBlocks.x; j++){
            if(blocks[i][j].live){
                var baseColor, baseColor2, baseColor3;
                switch (blocks[i][j].rang) {
                    case 3: 
                        baseColor = "#ffb3c8";
                        baseColor2 = "rgba(255,124,151,0.44)";
                        baseColor3 = "rgba(255,65,114,0.16)";
                        break;
                    case 2:
                        baseColor = "#ffe990";
                        baseColor2 = "rgba(255,202,105,0.43)";
                        baseColor3 = "rgba(255,217,78,0.18)";
                        break;
                    case 1:
                        baseColor = "#acff96";
                        baseColor2 = "rgba(107,255,88,0.34)";
                        baseColor3 = "rgba(53,255,20,0.13)";
                        break;
                }
                
                ctx.beginPath();
                ctx.fillStyle = baseColor3;
                ctx.rect(
                    j*blockSize.x,
                    i*blockSize.y,
                    blockSize.x,
                    blockSize.y);
                ctx.fill();
                ctx.closePath();
                
                ctx.beginPath();
                ctx.fillStyle = baseColor2;
                ctx.rect(
                    j*blockSize.x + 2,
                    i*blockSize.y + 2,
                    blockSize.x - 4,
                    blockSize.y - 4);
                ctx.fill();
                ctx.closePath();
                
                ctx.beginPath();
                ctx.fillStyle = baseColor;
                ctx.rect(
                    j*blockSize.x + 4,
                    i*blockSize.y + 4,
                    blockSize.x - 8,
                    blockSize.y - 8);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawText(){
    ctx.font = "21px Arial";
    ctx.fillStyle = "rgba(163,216,255,0.59)";
    ctx.fillText("Score: " + score, 8, canvas.offsetHeight/2);
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
        case (ball.pos.y >=canvas.clientHeight - ball.radius): 
            alert("You lose! Score: " + score);
            document.location.reload();
            clearInterval(interval);
            break;
    }

    ball.pos.x += ball.velocity.x;
    ball.pos.y += ball.velocity.y;
    
    if(rightArrowFlag && racket.pos.x + racket.size.x/2 < canvas.clientWidth){
        racket.pos.x += racket.velocity;
    }
    
    if(leftArrowFlag && racket.pos.x - racket.size.x/2 > 0){
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
                    score += 10*blocks[i][j].rang;
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