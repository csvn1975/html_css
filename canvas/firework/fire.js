document.addEventListener("DOMContentLoaded",function(){
    var audio = document.getElementById('audio');
    //audio.play();
    
    var canvas = document.createElement("canvas");
    var c = canvas.getContext("2d");
    
    document.body.appendChild(canvas);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    var Reset,Size,Number,Fill;
    
    Reset = document.querySelector("#Reset-Config");
    Size = document.querySelector("#Size");
    Number = document.querySelector("#Number");
    Fill = document.querySelector("#Fill");
    
    const config = {
      size:3,
      number:20,
      fill:.1
    }

    /* color */
    const ColorArray = [
                "#ffffff",
                "#FF0000",
                "#33FF33",
                "#CCFF00",
                "#FF9900",
                "#3399FF",
                "#FF3399",
                "#CC0066",
                "#00FF00"];
              
    const colorCount = ColorArray.length;
    function randomColor(){
      return ColorArray[Math.floor(Math.random() * colorCount)]
    }

  
    document.addEventListener('resize',function(){
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;
    });

    document.addEventListener('click',function(){
      audio.play();
    });

    Size.addEventListener("change",function(){
      config.size = Size.value;
    });

    Number.addEventListener("change",function(){
      config.number = Number.value;
    });

    Fill.addEventListener("change",function(){
      config.fill = "."+Fill.value;
    });

    Reset.addEventListener("click",function(){
      config.size = 3;
      config.number = 20;
      config.fill = .1;
      Size.value = 3;
      Number.value = 20;
      Fill.value = 1;
    });


    /**FireWork**/
    function FireWork(){
      this.radius = config.size;
      this.x = canvas.width / 2;
      this.y = canvas.height;
      this.color = randomColor();
      this.velocity = {
        x: Math.random()*6 - 3,
        y: Math.random()*3 + 3
      }
      this.maxY = Math.random() * canvas.height / 4 + canvas.height/10;
      this.life = true;
    }
    
    FireWork.prototype.draw = function(c){
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      c.fillStyle = this.color;
      c.fill()
      c.closePath();
    }
    FireWork.prototype.maximumY = function(){
      if(this.y <= this.maxY){
        this.life = false; 
        for(let i = 0; i < 10; i++){
          SparkArray.push(new Spark(this.x, this.y, this.radius, this.color));
        }
      }

      if(this.x <= 0 || this.x >= canvas.width){
        this.life = false; 
        for(let i = 0; i < 10; i++){
          SparkArray.push(new Spark(this.x, this.y, this.radius, this.color));
        }
      }
    }
    
    FireWork.prototype.update = function(c){
      this.y -= this.velocity.y;
      this.x += this.velocity.x
      this.maximumY();
      this.draw(c)
    }
    /**end firework**/
    /**Spark**/
    
    function Spark(x, y, radius, color){
      this.x = x;
      this.y = y;
      this.radius = radius/2;
      this.color = color;
      this.velocity = {
        x: Math.random()*3 - 1,
        y: Math.random()*3 - 1
      }
      this.friction = 0.015;
      this.life = 150;
    }
    
    Spark.prototype.draw = function(c){
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      c.fillStyle = this.color;
      c.fill();
      c.closePath();
    }
    Spark.prototype.update = function(c){
      this.velocity.y -= this.friction;
      this.life -= 1;
      this.y -= this.velocity.y;
      this.x += this.velocity.x;
      this.draw(c);
    }
    /**end Spark**/
      
    var FireWorkArray = [];
    var SparkArray = [];

    function init(){
      if(FireWorkArray.length < config.number)
        FireWorkArray.push(new FireWork());
    }
    
    function startFireWork(){
      window.requestAnimationFrame(startFireWork);
      
      c.fillStyle = `rgba(0,0,0,${config.fill})`; 
      c.fillRect(0, 0, canvas.width, canvas.height);
      
      FireWorkArray = FireWorkArray.filter(function(fw){
          fw.update(c);
          return fw.life;
      });
      
      SparkArray = SparkArray.filter((spark)=>{
        if(spark.life > 0) {
           spark.update(c);
           return true
        }
      })
      init();
    };
    
    startFireWork();
    
  });
  
  // Play and loop music
  
  
  