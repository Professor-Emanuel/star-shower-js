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

let timer = 0;
let stars = [];
let miniStars = [];
let explosions = [];
var groundHeight = canvas.height * 0.15;
var randomSpawnRate = Math.floor((Math.random() * 25) + 60);
var backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, "#171e26");
backgroundGradient.addColorStop(1, "#3f586b");


//const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

addEventListener('resize', () =>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

//Objects are going to be stars
function Star(){
        this.radius = (Math.random() * 10) + 5;
        this.x = this.radius + (canvas.width - this.radius * 2) * Math.random();
        this.y = -10;
        this.dx = (Math.random() - 0.5) * 20;
        this.dy = 30;
        this.gravity = 0.5;
        this.friction = 0.54;

    this.draw = function(){
        ctx.save();
            ctx.beginPath();
                ctx.arc(this.x, this.y, Math.abs(this.radius), 0, 2 * Math.PI, false);
                ctx.shadowColor = '#E3EAEF';
				ctx.shadowBlur = 20;
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 0;
                ctx.fillStyle = '#E3EAEF';
                ctx.fill();
            ctx.closePath();
        ctx.restore();
        
    }

    this.update = function(){
        //when star hits the bottom of the screen
        if(this.y + this.radius + this.dy >= canvas.height - groundHeight){
            this.dy = -this.dy * this.friction;
            this.dx *= this.friction;
            this.radius -= 3; 
            explosions.push(new Explosion(this));
        } else{
            this.dy += this.gravity;
        }   
        
        //Bounce particles off left and right sides of canvas
        if(this.x + this.radius + this.dx >= canvas.width || this.x - this.radius + this.dx < 0){
            this.dx -= this.dx;
            this.dx *= this.friction;
            explosions.push(new Explosion(this));
        }

        //Move particles by velocity
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
        //Draw particles from explosion
        for(let i=0; i < explosions.length; i++){
            explosions[i].update();
        }
    }
}

//ONLY draw stars on the background!
function MiniStar(){
    //use inheritance to bring common proprieties of Star
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 3;

    this.draw = function() {
        ctx.save();
            ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
                ctx.shadowColor = '#E3EAEF';
				ctx.shadowBlur = (Math.random() * 10) + 10;
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 0;
                ctx.fillStyle = "white";
                ctx.fill();
            ctx.closePath();
        ctx.restore();
    }
}

function Particle(x, y, dx, dy){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = {
        width: 2,
        height: 2
    };
    this.gravity = 0.09;
    this.friction = 0.88;
    this.timeToLive = 3;
    this.opacity = 1;

    this.update = function(){
        if(this.y + this.size.height + this.dy >= canvas.height - groundHeight){
            this.dy = -this.dy * this.friction;
            this.x = this.x * this.friction;
        } else{
            this.dy = this.dy + this.gravity;
        }

        if(this.x + this.size.width + this.dx >= canvas.width || this.x +this.dx < 0){
            this.dx = - this.dx;
            this.dx = this.dx * this.friction;
        };

        this.x = this.x + this.dx;
        this.y = this.y + this.dy;

        this.draw();

        this.timeToLive -= 0.01;
        this.opacity -= 1/ (this.timeToLive / 0.01);
    }

    this.draw = function(){
        ctx.save();
            ctx.fillStyle = "rgba(227, 234, 239," + this.opacity + ")";
            ctx.shadowColor = '#E3EAEF';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0; 
           ctx.fillRect(this.x, this.y, this.size.width, this.size.height);
        ctx.restore();
    }

    this.isAlive = function(){
        return 0 <= this.timeToLive;
    }
}

function Explosion(star){
    this.particles = [];

    this.initialize = function(parentStar){
        for(let i=0; i<8; i++){
            var velocity = {
                x:(Math.random() - 0.5) * 5,
                y:(Math.random() - 0.5) * 15
            };
            this.particles.push(new Particle(parentStar.x, parentStar.y, velocity.x, velocity.y));
        }
    }

    this.initialize(star);

    this.update = function(){
        for(let i=0; i< this.particles.length; i++){
            this.particles[i].update();
            if(this.particles[i].isAlive() == false){
                this.particles.splice(i, 1);
            }
        }
    }
}

//Implementation
for(let i = 0; i< 20; i++){
    miniStars.push(new MiniStar());        
}

//Animation Loop
function animate(){
    requestAnimationFrame(animate);
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i=0; i<miniStars.length; i++){
        miniStars[i].draw();
    }

    ctx.fillStyle = "#182028";
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    for(var i=0; i<stars.length; i++){
        stars[i].update();
        if(stars[i].radius <= 0){
            stars.splice(i, 1);
        }
    }

    for(let i=0; i< explosions.length; i++){
        if(explosions[i].length <= 0){
            explosions.splice(i, 1);
        }
    }

    timer++;
    if(timer % randomSpawnRate == 0){
        stars.push(new Star());
        randomSpawnRate = Math.floor((Math.random() * 10) + 75);
    }
}

animate(); 
