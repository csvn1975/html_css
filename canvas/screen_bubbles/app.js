document.addEventListener("DOMContentLoaded",function(){

  var canvas = document.querySelector("canvas");
  var c = canvas.getContext("2d");
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  var mouse = {
    x: undefined,
    y: undefined
  }
  const arrayColor = [
    '#FF6138',
    '#00ADB5',
    '#FFF4E0',
    '#F8B500',
    '#FC3C3C',
    '#A8EAC0'
  ];

  const maxRadius = 25; 
  const minRadius = 5;

  document.addEventListener('resize',function(){
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;
     init();
  });

  document.addEventListener("mousemove",event=>{
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });
  
  function createX(){
    return randomMax(canvas.width);
  }

  function createY(){
    return randomMax(canvas.height);
  }

  function randomMax(maxValue) {
      return Math.floor(Math.random() * maxValue);
  }

  function randomColor(){
    return arrayColor[randomMax(arrayColor.length)];
  }

  function Circle(x, y, radius, color){ 
    this.x = x; // truc x
    this.y = y; // truc y
    this.radius = radius;  // ban kinh
    this.color = color; // mau
    
    // van toc
    this.velocity = {
      x: Math.random() * 4 - 2,
      y: Math.random() * 4 - 2
    }

    Object.defineProperty(this, 'opacity', {
        get: function() {
          return opacity;
        },
        set: function(value) {
          opacity = value;
        }
      });

  }

  
  Circle.prototype.draw = function(){    
    c.save()
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    c.fillStyle = this.color;

    c.shadowColor = this.color;
    c.shadowBlur = 5;
    c.fill();
    c.closePath();
    this.getText();
  }


  Circle.prototype.getText = function () {
    c.beginPath();
    c.font = "35px source sans pro";
    c.fillStyle = "red";
    c.textAlign = "center";
    c.shadowColor = "white";
    c.fillText("Nguyen Le", mouse.x, mouse.y);
    c.fill();
    c.closePath();
    c.restore();
  }


  
  Circle.prototype.update = function(){
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    
    if(mouse.x - this.x < 75 && mouse.x - this.x >-75 && mouse.y - this.y < 75 && mouse.y - this.y >-75 ){
       if(this.radius < maxRadius) this.radius +=5;
    } else {
      if(this.radius > minRadius){
        this.radius -=2;
        this.x += this.velocity.x * 4;
        this.y += this.velocity.y * 4;
      }
    }

    c.globalAlpha = Math.random() + 0.1;
    
    this.collision();
    this.draw();
  }
  
  Circle.prototype.collision = function(){
    if(this.x >= canvas.width || this.x <= 0)
      this.velocity.x = -this.velocity.x;
    if(this.y >= canvas.height || this.y <= 0)
      this.velocity.y = -this.velocity.y;
  }
  
  let arrayCircles;

  function init(){
    arrayCircles = [];
    for ( let i = 0; i < 400; i++){
      arrayCircles.push(new Circle(createX(),createY(),5, randomColor()));
    }
    arrayCircles[0].opacity = 1;
  }
  
  function animate(){
    window.requestAnimationFrame(animate);
    
    c.clearRect(0,0, canvas.width, canvas.height);

    arrayCircles.forEach(circle=>{
      circle.update();
    });
  }
  
  init();
  animate();
});