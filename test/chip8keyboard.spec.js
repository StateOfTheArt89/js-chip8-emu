describe('Chip 8 Keyboard', function() {
  var chip8keyboard;

  beforeEach(function() {
    chip8keyboard = new Chip8Keyboard();
  });

  it('stores key position', function() {
    chip8keyboard.keyDown(0xF);
    expect(chip8keyboard.isKeyDown(0xF)).toEqual(true);
  });

  it('stores key position (key up)', function() {
    chip8keyboard.keyDown(0xE);
    chip8keyboard.keyUp(0xE);
    chip8keyboard.keyUp(0xE);
    expect(chip8keyboard.isKeyDown(0xE)).toEqual(false);
  });

  it('saves last key pressed', function() {
    chip8keyboard.keyDown(0xF);
    expect(chip8keyboard.getLastKeyPressed()).toEqual(0xF);
    expect(chip8keyboard.getLastKeyPressed()).toEqual(-1);
  });

});
