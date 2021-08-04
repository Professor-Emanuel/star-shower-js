/*FOR SOME REASON THIS import STATEMENT BELOW, DOES NOT WORK*/
/*import utilities from "utilities.js"*/
/*SO I ADDED THE UTILITY FUNCTIONS DIRECTLY IN THE CODE*/
/*PS: I work in VS Code*/

//Utility Functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1
  
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerWidth;

//const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

addEventListener('resize', () =>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

//Objects are going to be stars
function Star(){
        this.x = canvas.width/2;//this.radius + (canvas.width - this.radius * 2) * Math.random();
        this.y = 30;
        this.radius = (Math.random() * 50) + 5;
        this.velocity = {
            x: (Math.random() - 0.5) * 20,
            y: 30
        };
        this.gravity = 0.5;
        this.friction = 0.54;

    this.draw = function(){
        
            ctx.beginPath();
                ctx.arc(this.x, this.y, Math.abs(this.radius), 0, 2 * Math.PI, false);
                /*
                c.shadowColor = '#E3EAEF';
				c.shadowBlur = 20;
				c.shadowOffsetX = 0;
				c.shadowOffsetY = 0;
                */
                ctx.fillStyle = 'red';
                ctx.fill();
            ctx.closePath();
        
    }

    this.update = function(){
        //when star hits the bottom of the screen
        if(this.y + this.radius + this.velocity.y > canvas.height /*-groundHeight*/){
            this.velocity.y = -this.velocity.y * this.friction;
            this.velocity.x *= this.friction;
            this.radius -= 3; 
            /*
            explosion.push(new Explosion(this));
            */

        } else{
            this.velocity.y += this.gravity;
        }   
        this.y += this.velocity.y;

        this.draw();
        /*
        for(let i=0; i<explosions.length; i++){
            explosions[i].update();
        }
        */
    }
}

function MiniStar(){
    //use inheritance to bring common proprieties of Star
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 3;

    this.draw = function() {
        ctx.save();
            ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
                /*
                c.shadowColor = '#E3EAEF';
				c.shadowBlur = (Math.random() * 10) + 10;
				c.shadowOffsetX = 0;
				c.shadowOffsetY = 0;
                */
                ctx.fillStyle = "blue";
                ctx.fill();
            ctx.closePath();
        ctx.restore();
    }
}

//Implementation
var stars = [];
let miniStars = [];

for(let i = 0; i< 1; i++){
    stars.push(new Star());        
}

for(let i = 0; i< 8; i++){
    miniStars.push(new MiniStar());        
}

//Animation Loop
function animate(){
    requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i=0; i<miniStars.length; i++){
        miniStars[i].draw();
    }

    ctx.fillStyle = "#182028";
    ctx.fillRect(0, canvas.height /*- groundHeight*/, canvas.width, canvas.height /*groundHeight*/);

    for(var i=0; i<stars.length; i++){
        stars[i].update();
        if(stars[i].radius <= 0){
            stars.splice(i, 1);
        }
    }
}

animate(); 
