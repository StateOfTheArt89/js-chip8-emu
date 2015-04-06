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

Chip8Screen.prototype.drawRowFromByte = function(xStart,y,value) {
  var overdrawn = false;
  for (var i = 0; i < 8; i++) {
    var bitMask = 0x80 >> i;
    var pixelValue = (value & bitMask) >> (7 - i);

    var currentPixelValue = this.readPixel(xStart + i, y);
    if (currentPixelValue == 0x1 && pixelValue == 0x1){
      overdrawn = true;
    }
    this.writePixel(xStart + i, y, currentPixelValue ^ pixelValue);
  }

  return overdrawn;
};
