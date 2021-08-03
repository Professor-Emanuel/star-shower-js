/*import utilities from './utilities'*/

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerWidth;

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

addEventListener('resize', () =>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    initialize();
});

//Objects are going to be stars
class Star{
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color; 
        this.velocity = {
            x: 0,
            y: 3
        }
        this.gravity = 1;
        this.friction = 0.8;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(){
        this.draw();

        //when star hits the bottom of the screen
        if(this.y + this.radius + this.velocity.y > canvas.height){
            this.velocity.y = -this.velocity.y * this.friction;
        } else{
            this.velocity.y += this.gravity;
        }
        this.y += this.velocity.y;
    }
}

//Implementation
let stars
function initialize(){
    stars = [];
    for(let i = 0; i< 1; i++){
        stars.push(new Star(canvas.width/2, 30, 30, 'red'));        
    }
}

//Animation Loop
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fill();

    stars.forEach(star =>{
        star.update();
    });
}

initialize();
animate(); 
