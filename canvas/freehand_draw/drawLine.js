document.addEventListener('DOMContentLoaded', function(){
    
    var canvas = document.querySelector('canvas');
    var btnClear = document.querySelector('#clear');
    var btnSave = document.querySelector('#save');
    var isMousePress = false;

    canvas.width = (screen.width / 2) - 100;
    canvas.height = 600;
    ctx = canvas.getContext('2d');

    /* get mouse-position */
    function getMousePossition(event){
        let mouseX = undefined
        let mouseY = undefined

        if (event.offsetX) {
            mouseX = event.offsetX;
            mouseY = event.offsetY;
        } else {
            mouseX = event.pageX - event.target.offsetLeft;
            mouseY = event.pageY - event.target.offsetTop;
        }  
        return [mouseX, mouseY]
    }

    function DrawLine(ctx, width, height){
        this.ctx = ctx;
        this.width = width;
        this.height = height; 
        this.ctx.strokeStyle = "white";
    }

    Object.defineProperty(DrawLine.prototype, 'penColor', {
        get: function() {
            return this.ctx.strokeStyle;
        },
        
        set: function(value) {
            this.ctx.strokeStyle = value;
        }
      });
      
    DrawLine.prototype.line = function(point){
        this.ctx.lineTo(point[0], point[1]); 
        this.ctx.stroke();
    }

    DrawLine.prototype.start = function(point){
        this.ctx.beginPath();
        this.ctx.moveTo(point[0], point[1]);
    }

    DrawLine.prototype.init = function(){
        this.ctx.fillStyle = "coral";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    var draw = new DrawLine(ctx, canvas.width, canvas.height);
    draw.init();

    canvas.addEventListener('mousemove', function(event){
        if (isMousePress){
            let mousePosistion = getMousePossition(event);
            draw.penColor =  "green";
            draw.line(mousePosistion); 
        }
    });   
    
    canvas.addEventListener('mousedown', function(event) {
        isMousePress = true;
        let mousePosistion = getMousePossition(event);
        draw.start(mousePosistion);
    });

    canvas.addEventListener('mouseup', function(event){
        isMousePress = false;
    });

    btnSave.addEventListener('click', function (ev) {
        btnSave.href = canvas.toDataURL();
        btnSave.download = "mypainting.png";
    }, false);
        
    btnClear.addEventListener('click', function() {
        draw.init();       
    });
  
});

   