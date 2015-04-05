function Chip8Screen(){
  this.gfx = new Array(64);
}

Chip8Screen.prototype.init = function() {
  this.gfx = new Array(64);
  for (var x = 0; x < this.gfx.length; x++) {
    this.gfx[x] = new Array(32);
    for (var y = 0; y < this.gfx[x].length; y++) {
      this.gfx[x][y] = 0x0;
    }
  }
};

Chip8Screen.prototype.readPixel = function(x,y) {
  return this.gfx[x][y];
};

Chip8Screen.prototype.writePixel = function(x,y,value) {
  this.gfx[x][y] = value;
};

Chip8Screen.prototype.drawRowFromByte = function(x,y,value) {
  
}
