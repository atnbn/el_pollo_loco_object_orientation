
let canvas;
let world;
let keyboard = new Keyboard();
THROW_REQUEST_STOP = new Date().getTime();
THROW_REQUEST_START = 0;





function init() {
    canvas = document.getElementById('canvas')
    world = new World(canvas, keyboard)

}

function muteSound(){
    this.world.muteSound();
}


function fullscreen() {
    var el = document.getElementById('canvas');

    if(el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen();
    }
   else {
      el.mozRequestFullScreen();
   }            
}

window.addEventListener("keydown", (e) => {
    
    if(e.keyCode == 40){
        keyboard.DOWN = true;
    }
    if(e.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if(e.keyCode == 38){
        keyboard.UP = true;
    }
    if(e.keyCode == 37){
        keyboard.LEFT = true;
    }

    if(e.keyCode == 32){
        keyboard.SPACE = true;
    }

    if (e.keyCode == 68) {
        keyboard.D = true ;
    }

});

window.addEventListener("keyup", (e) => {
    
    if(e.keyCode == 40){
        keyboard.DOWN = false;
    }
    if(e.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if(e.keyCode == 38){
        keyboard.UP = false;
    }
    if(e.keyCode == 37){
        keyboard.LEFT = false;
    }

    if(e.keyCode == 32){
        keyboard.SPACE = false;
    }
    if (e.keyCode == 68) {
        keyboard.D = false ;
    }

});


function touchDownLeft() {
    keyboard.LEFT = true
}

function touchUpLeft() {
    keyboard.LEFT = false

}

function touchDownRight() {
    keyboard.RIGHT = true;
}

function touchUpRight() {
    keyboard.RIGHT = false;

}

function touchDownJump() {
    keyboard.SPACE = true;
}

function touchUpJump() {
    keyboard.SPACE = false;

}

function touchDownThrow() {
    keyboard.D = true;
}

function touchUpThrow() {
    keyboard.D = false;

}