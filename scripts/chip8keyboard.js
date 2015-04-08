function Chip8Keyboard(){
  this.lastKeyPressed = -1;
  this.keysDown = new Array(16);
  for (var i = 0; i < 16; i++){
    this.keysDown[i] = false;
  }
}

Chip8Keyboard.prototype.keyDown = function(key){
  this.lastKeyPressed = key;
  this.keysDown[key] = true;
}

Chip8Keyboard.prototype.keyUp = function(key){
  this.keysDown[key] = false;
}

Chip8Keyboard.prototype.isKeyDown = function(key){
  return this.keysDown[key];
}

Chip8Keyboard.prototype.getLastKeyPressed = function(key){
  var result = this.lastKeyPressed;
  this.lastKeyPressed = -1;
  return result;
}
