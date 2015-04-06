describe('Chip 8 Memory', function() {
  var chip8;

  beforeEach(function() {
    chip8mem = new Chip8Mem();
    chip8mem.init();
  });

  it('initializes memory', function() {
    expect(chip8mem.readMem(0)).toEqual(0x00);
    expect(chip8mem.readMem(4090)).toEqual(0x00);
  });

  it('initializes registers', function() {
    expect(chip8mem.readPc()).toEqual(0x200);
    expect(chip8mem.readI()).toEqual(0x00);
  });

  it('saves values in memory (write/read)', function() {
    chip8mem.writeMem(200, 0xFF);
    expect(chip8mem.readMem(200)).toEqual(0xFF);
  });

  it('saves values in V registers (write/read)', function() {
    chip8mem.writeV(0, 0xEF);
    expect(chip8mem.readV(0)).toEqual(0xEF);
  });

  it('saves values in pc and I registers (write/read)', function() {
    chip8mem.writeI(0xEC);
    expect(chip8mem.readI()).toEqual(0xEC);
    chip8mem.writePc(0xEC);
    expect(chip8mem.readPc()).toEqual(0xEC);
  });

  it('pushes and pops values from stack', function() {
    chip8mem.pushOnStack(0x01);
    chip8mem.pushOnStack(0x02);
    chip8mem.pushOnStack(0x03);
    expect(chip8mem.popStack()).toEqual(0x03);
    expect(chip8mem.popStack()).toEqual(0x02);
    expect(chip8mem.popStack()).toEqual(0x01);
  });

  it('write array into memory', function() {
    var romData = [0x01,0x02,0x03];
    chip8mem.writeMem(0x200, romData);
    expect(chip8mem.readMem(0x200)).toEqual(0x01);
    expect(chip8mem.readMem(0x201)).toEqual(0x02);
    expect(chip8mem.readMem(0x202)).toEqual(0x03);
  });


});
