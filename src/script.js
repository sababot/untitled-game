var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

document.addEventListener("keydown", aim, true);

let g = 0;
let f = 1;
let health = 100;

function doKeyDown(e) {
    if(e.keyCode == 71){
        toggleGravity();
        toggleFriction();
    }
    else if(e.keyCode == 82){
        restart();
    }
}

function Particle(x, y, dx, dy){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = 15;
    this.m = 2.5;
    this.colliding = true;

    this.draw = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        c.fillStyle = "#c842f5";
        c.fill();
        c.stroke();
    }

    this.update = function(){
        if(this.x + this.r > canvas.height || this.x - this.r < 0){
            this.dx = -(this.dx *= f);
        }

        if(this.y + this.r > canvas.width || this.y - this.r < 0){
            this.dy = -(this.dy *= f);
        }

        // gravity
        if(this.y < canvas.height - this.r){
            this.dy += g;
        }

        if (this.y > canvas.height - this.r){
            this.y = canvas.height - this.r;
        }

        if (this.y == canvas.height - this.r && g == 0){
            this.dx *= 0.9;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

function Player(x, y, left, right, up, down, left_up, left_down, right_up, right_down){
    this.x = x;
    this.y = y;
    this.left = left;
    this.right = right;
    this.up = up;
    this.down = down;
    this.left_up = left.up;
    this.left_down = left_down;
    this.right_up = right_up;
    this.right_down = right_down;
    this.r = 15;
    this.m = 2.5;
    this.colliding = true;

    this.draw = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        c.fillStyle = "#ff5961";
        c.fill();

        if (this.left == true){
            c.beginPath();
            c.rect(this.y - 20, this.x - 10, 20, 20);
            c.fillStyle = "#6db3ff";
            c.fill();
        }
        else if (this.right == true){
            c.beginPath();
            c.rect(this.y, this.x - 10, 20, 20);
            c.fillStyle = "#6db3ff";
            c.fill();
        }
        else if (this.up == true){
            c.beginPath();
            c.rect(this.y - 10, this.x - 20, 20, 20);
            c.fillStyle = "#6db3ff";
            c.fill();
        }
        else if (this.down == true){
            c.beginPath();
            c.rect(this.y - 10, this.x, 20, 20);
            c.fillStyle = "#6db3ff";
            c.fill();
        }
        else{
            c.beginPath();
            c.rect(this.y - 10, this.x - 10, 20, 20);
            c.fillStyle = "#6db3ff";
            c.fill();
        }
    }
}

var particleArray = [];

for (var i = 0; i < 5; i++){
    var r = 15;
    var x = Math.random() * (canvas.width - r * 2) + r;
    var y = Math.random() * (canvas.height - r * 2) + r;
    var dx = (Math.random() - 0.5) * 10;
    var dy = (Math.random() - 0.5) * 10;
    particleArray.push(new Particle(x, y, dx, dy));
}

var playerVariable = new Player(canvas.width / 2, canvas.height / 2, false, false, false, false, false, false, false, false);

function aim(e){
    if(e.keyCode == 37){
        playerVariable.left = true;
        playerVariable.right = false;
        playerVariable.up = false;
        playerVariable.down = false;
    }

    else if(e.keyCode == 39){
        playerVariable.right = true;
        playerVariable.left = false;
        playerVariable.up = false;
        playerVariable.down = false;
    }

    else if(e.keyCode == 38){
        playerVariable.up = true;
        playerVariable.right = false;
        playerVariable.left = false;
        playerVariable.down = false;
    }

    else if(e.keyCode == 40){
        playerVariable.down = true;
        playerVariable.right = false;
        playerVariable.up = false;
        playerVariable.left = false;
    }
}

function restart(){
    particleArray = [];
    for (var i = 0; i < 50; i++){
        var r = 15;
        var x = Math.random() * (innerWidth - r * 2) + r;
        var y = Math.random() * (innerHeight - r * 2) + r;
        var dx = (Math.random() - 0.5) * 10;
        var dy = (Math.random() - 0.5) * 10;
        particleArray.push(new Particle(x, y, dx, dy));
    }

    if(g == 0.5){
        toggleGravity();
    }

    if(f == 0.5){
        toggleFriction();
    }
}

var circleIntersect = function(x1, y1, r1, x2, y2, r2) {

    // Calculate the distance between the two circles
    let squareDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    return squareDistance <= ((r1 + r2) * (r1 + r2))
}

function collide(){
    let obj1;
    let obj2;

    // Reset collision state of all objects
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].colliding = false;
    }

    for (let i = 0; i < particleArray.length; i++)
    {
        if ((particleArray[i].x >= ((canvas.width / 2) - 30) && particleArray[i].x <= ((canvas.width / 2) + 30)) && (particleArray[i].y >= ((canvas.height / 2) - 30) && particleArray[i].y <= ((canvas.height / 2) + 30)))
        {
            health -= 20;
        }
    }

    // Start checking for collisions
    for (let i = 0; i < particleArray.length; i++)
    {
        obj1 = particleArray[i];

        for (let j = i + 1; j < particleArray.length; j++)
        {
            obj2 = particleArray[j];

            // Compare object1 with object2
            var dist = circleIntersect(obj1.x, obj1.y, obj1.r, obj2.x, obj2.y, obj2.r);
            if (dist === true){
                obj1.colliding = true;
                obj2.colliding = true;

                let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
                let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                let vRelativeVelocity = {x: obj1.dx - obj2.dx, y: obj1.dy - obj2.dy};
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

                if (speed < 0){
                    break;
                }

                obj1.dx -= (speed * vCollisionNorm.x);
                obj1.dy -= (speed * vCollisionNorm.y);
                obj2.dx += (speed * vCollisionNorm.x);
                obj2.dy += (speed * vCollisionNorm.y);
            }
        }
    }
}

function help(){
    c.font = "20px monospace";
    c.fillStyle = "red";
    c.fillText("health: " + health, 25, 35);
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    collide();
    for (i = 0; i < particleArray.length; i++){
        particleArray[i].update();
    }

    playerVariable.draw();

    help();
}

animate();