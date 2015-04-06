describe('Chip 8 Screen', function() {

  beforeEach(function() {
    chip8screen = new Chip8Screen();
    chip8screen.init();
  });

  it('initializes screen memory', function() {
    chip8screen.init();
    for (var x = 0; x < 64; x++){
      for (var y = 0; y < 32; y++){
        expect(chip8screen.readPixel(x,y)).toEqual(0x0);
      }
    }
  });

  it('writes pixel into screen memory', function() {
    chip8screen.writePixel(3,3,0x1);
    expect(chip8screen.readPixel(3,3)).toEqual(0x1);
  });

  it('writes row from byte into screen memory', function() {
    chip8screen.drawRowFromByte(0,3,0xAA); // o o o o
    expect(chip8screen.readPixel(0,3)).toEqual(0x1);
    expect(chip8screen.readPixel(1,3)).toEqual(0x0);
    expect(chip8screen.readPixel(2,3)).toEqual(0x1);
    expect(chip8screen.readPixel(8,3)).toEqual(0x0);
  });

  it('writes row from byte into screen memory (return true if overdraw)', function() {
    expect(chip8screen.drawRowFromByte(0,3,0xAA)).toEqual(false);
    expect(chip8screen.drawRowFromByte(0,3,0xAA)).toEqual(true);
  });

});
