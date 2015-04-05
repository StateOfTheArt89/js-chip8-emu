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

  it('writes pixel into memory', function() {
    chip8screen.writePixel(3,3,0x1);
    expect(chip8screen.readPixel(3,3)).toEqual(0x1);
  });

});
