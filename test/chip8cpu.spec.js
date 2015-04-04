describe('Chip 8 CPU', function() {
  var chip8;

  beforeEach(function() {
    chip8cpu = new Chip8CPU();
    chip8mem = chip8cpu.getMem();
  });

  it('executes op 8: set vx', function() {
    //Set V2 to 0x42
    chip8cpu.opSetVX(0x6242);
    expect(chip8mem.readV(2)).toEqual(0x42);
  });

  it('executes op 9: add value to vx', function() {
    //Set VE to 0x01
    chip8cpu.opSetVX(0x6E01);
    //Add 0x10 to VE
    chip8cpu.opAddToVX(0x7E10);
    expect(chip8mem.readV(0xE)).toEqual(0x11);
  });

  it('executes op 10: set vx value of vy', function() {
    chip8mem.writeV(0xE, 0x42);
    chip8cpu.opSetVXtoVY(0x86E0);
    expect(chip8mem.readV(0x6)).toEqual(0x42);
  });

  it('executes op 11: set vx value of vx or vy', function() {
    chip8mem.writeV(0x1, 0xF0);
    chip8mem.writeV(0x2, 0x0F);
    chip8cpu.opSetVXtoVXorVY(0x8121);
    expect(chip8mem.readV(0x1)).toEqual(0xFF);
  });

  it('executes op 12: set vx value of vx and vy', function() {
    chip8mem.writeV(0x1, 0xF0);
    chip8mem.writeV(0x2, 0x0F);
    chip8cpu.opSetVXtoVXandVY(0x8122);
    expect(chip8mem.readV(0x1)).toEqual(0x00);
  });

  it('executes op 13: set vx value of vx xor vy', function() {
    chip8mem.writeV(0x1, 0xF0);
    chip8mem.writeV(0x2, 0x0F);
    chip8cpu.opSetVXtoVXxorVY(0x8123);
    expect(chip8mem.readV(0x1)).toEqual(0xFF);
  });

  it('executes op 20: set i', function() {
    chip8cpu.opSetI(0xA123);
    expect(chip8mem.readI()).toEqual(0x123);
  });

  it('executes op 30: add vx to i', function() {
    chip8mem.writeV(0x1, 0x42);
    chip8cpu.opAddVXtoI(0xF11E);
    expect(chip8mem.readI()).toEqual(0x42);
  });

  it('executes op 33: save v registers starting at i', function() {
    chip8mem.writeV(0x0, 0x00);
    chip8mem.writeV(0x1, 0x01);
    chip8mem.writeV(0x2, 0x02);
    chip8mem.writeV(0x3, 0x03);
    chip8mem.writeV(0xE, 0x0E);
    chip8mem.writeI(0x2000);
    chip8cpu.opSaveVRegistersToI(0xFE55);
    expect(chip8mem.readMem(0x2000)).toEqual(0x00);
    expect(chip8mem.readMem(0x2001)).toEqual(0x01);
    expect(chip8mem.readMem(0x2002)).toEqual(0x02);
    expect(chip8mem.readMem(0x2003)).toEqual(0x03);
    expect(chip8mem.readMem(0x200E)).toEqual(0x0E);
  });

  it('executes op 34: restore v registers starting at i', function() {
    chip8mem.writeMem(0x1000, 0x00);
    chip8mem.writeMem(0x1001, 0x01);
    chip8mem.writeMem(0x1002, 0x02);
    chip8mem.writeMem(0x1003, 0x03);
    chip8mem.writeMem(0x100E, 0x0E);
    chip8mem.writeI(0x1000);
    chip8cpu.opRestoreVRegistersFromI(0xFE65);
    expect(chip8mem.readV(0x0)).toEqual(0x00);
    expect(chip8mem.readV(0x1)).toEqual(0x01);
    expect(chip8mem.readV(0x2)).toEqual(0x02);
    expect(chip8mem.readV(0x3)).toEqual(0x03);
    expect(chip8mem.readV(0xE)).toEqual(0x0E);
  });

  it('decode OP Codes', function() {
    expect(chip8cpu.decodeOPCode(0x0000)).toEqual(OP_CALL_PROG);
    expect(chip8cpu.decodeOPCode(0x0111)).toEqual(OP_CALL_PROG);
    expect(chip8cpu.decodeOPCode(0x0FFF)).toEqual(OP_CALL_PROG);

    expect(chip8cpu.decodeOPCode(0x00E0)).toEqual(OP_CLEAR_SCREEN);

    expect(chip8cpu.decodeOPCode(0x00EE)).toEqual(OP_RETURN_FROM_SUB);

    expect(chip8cpu.decodeOPCode(0x1000)).toEqual(OP_JMP_TO_ADDR);
    expect(chip8cpu.decodeOPCode(0x1111)).toEqual(OP_JMP_TO_ADDR);
    expect(chip8cpu.decodeOPCode(0x1FFF)).toEqual(OP_JMP_TO_ADDR);

    expect(chip8cpu.decodeOPCode(0x2000)).toEqual(OP_CALL_SUB_AT);
    expect(chip8cpu.decodeOPCode(0x2111)).toEqual(OP_CALL_SUB_AT);
    expect(chip8cpu.decodeOPCode(0x2FFF)).toEqual(OP_CALL_SUB_AT);

    expect(chip8cpu.decodeOPCode(0x3100)).toEqual(OP_SKIP_IF_VX_EQ);
    expect(chip8cpu.decodeOPCode(0x3EFF)).toEqual(OP_SKIP_IF_VX_EQ);

    expect(chip8cpu.decodeOPCode(0x4100)).toEqual(OP_SKIP_IF_VX_NOT_EQ);
    expect(chip8cpu.decodeOPCode(0x4EFF)).toEqual(OP_SKIP_IF_VX_NOT_EQ);

    expect(chip8cpu.decodeOPCode(0x5100)).toEqual(OP_SKIP_IF_VX_VY_EQ);
    expect(chip8cpu.decodeOPCode(0x5EFF)).toEqual(OP_SKIP_IF_VX_VY_EQ);

    expect(chip8cpu.decodeOPCode(0x6000)).toEqual(OP_SET_VX);
    expect(chip8cpu.decodeOPCode(0x6FFF)).toEqual(OP_SET_VX);

    expect(chip8cpu.decodeOPCode(0x7000)).toEqual(OP_ADD_TO_VX);
    expect(chip8cpu.decodeOPCode(0x7FFF)).toEqual(OP_ADD_TO_VX);

    //8XY0	Sets VX to the value of VY.
    expect(chip8cpu.decodeOPCode(0x8010)).toEqual(OP_SET_VX_TO_VY);
    //8XY1	Sets VX to VX or VY.
    expect(chip8cpu.decodeOPCode(0x8011)).toEqual(OP_SET_VX_TO_VX_OR_VY);
    //8XY2	Sets VX to VX and VY.
    expect(chip8cpu.decodeOPCode(0x8012)).toEqual(OP_SET_VX_TO_VX_AND_VY);
    //8XY3	Sets VX to VX xor VY.
    expect(chip8cpu.decodeOPCode(0x8013)).toEqual(OP_SET_VX_TO_VX_XOR_VY);

    //8XY4	Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't.
    expect(chip8cpu.decodeOPCode(0x8014)).toEqual(OP_ADD_VY_TO_VX);
    //8XY5	VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
    expect(chip8cpu.decodeOPCode(0x8015)).toEqual(OP_SUB_VY_FROM_VX);
    //8XY6	Shifts VX right by one. VF is set to the value of the least significant bit of VX before the shift.
    expect(chip8cpu.decodeOPCode(0x8016)).toEqual(OP_SHIFT_RIGHT_VX);
    //8XY7	Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
    expect(chip8cpu.decodeOPCode(0x8017)).toEqual(OP_SET_VX_TO_VY_SUB_VX);
    //8XYE	Shifts VX left by one. VF is set to the value of the most significant bit of VX before the shift.
    expect(chip8cpu.decodeOPCode(0x801E)).toEqual(OP_SHIFT_LEFT_VX);

    //9XY0	Skips the next instruction if VX doesn't equal VY.
    expect(chip8cpu.decodeOPCode(0x9010)).toEqual(OP_SKIP_IF_VX_EQ_VY);

    //ANNN	Sets I to the address NNN.
    expect(chip8cpu.decodeOPCode(0xA000)).toEqual(OP_SET_I);
    expect(chip8cpu.decodeOPCode(0xA100)).toEqual(OP_SET_I);
    expect(chip8cpu.decodeOPCode(0xAFFF)).toEqual(OP_SET_I);
    //BNNN	Jumps to the address NNN plus V0.
    expect(chip8cpu.decodeOPCode(0xB000)).toEqual(OP_JUMP_TO_ADDR_PLUS_V0);
    expect(chip8cpu.decodeOPCode(0xB100)).toEqual(OP_JUMP_TO_ADDR_PLUS_V0);
    expect(chip8cpu.decodeOPCode(0xBFFF)).toEqual(OP_JUMP_TO_ADDR_PLUS_V0);
    //CXNN	Sets VX to a random number, masked by NN.
    expect(chip8cpu.decodeOPCode(0xC000)).toEqual(OP_SET_VX_TO_RAND);
    expect(chip8cpu.decodeOPCode(0xC100)).toEqual(OP_SET_VX_TO_RAND);
    expect(chip8cpu.decodeOPCode(0xCFFF)).toEqual(OP_SET_VX_TO_RAND);

    //DXYN	Sprites stored in memory at location in index register (I), maximum 8bits wide. Wraps around the screen. If when drawn, clears a pixel, register VF is set to 1 otherwise it is zero. All drawing is XOR drawing (i.e. it toggles the screen pixels)
    expect(chip8cpu.decodeOPCode(0xD000)).toEqual(OP_WRAP_SPRITE_AROUND_SCREEN);
    expect(chip8cpu.decodeOPCode(0xDFFF)).toEqual(OP_WRAP_SPRITE_AROUND_SCREEN);
    //EX9E	Skips the next instruction if the key stored in VX is pressed.
    expect(chip8cpu.decodeOPCode(0xE09E)).toEqual(OP_SKIP_IF_KEY_VX_PRESSED);
    //EXA1	Skips the next instruction if the key stored in VX isn't pressed.
    expect(chip8cpu.decodeOPCode(0xE0A1)).toEqual(OP_SKIP_IF_KEY_VX_NOT_PRESSED);

    //FX07	Sets VX to the value of the delay timer.
    expect(chip8cpu.decodeOPCode(0xF007)).toEqual(OP_SET_VX_TO_DELAY);
    //FX0A	A key press is awaited, and then stored in VX.
    expect(chip8cpu.decodeOPCode(0xF00A)).toEqual(OP_WAIT_AND_SAVE_KEY_IN_VX);
    //FX15	Sets the delay timer to VX.
    expect(chip8cpu.decodeOPCode(0xF115)).toEqual(OP_DELAY_TO_VX);
    //FX18	Sets the sound timer to VX.
    expect(chip8cpu.decodeOPCode(0xF118)).toEqual(OP_SOUND_TO_VX);
    //FX1E	Adds VX to I.[3]
    expect(chip8cpu.decodeOPCode(0xF11E)).toEqual(OP_ADD_VX_TO_I);
    //FX29	Sets I to the location of the sprite for the character in VX. Characters 0-F (in hexadecimal) are represented by a 4x5 font.
    expect(chip8cpu.decodeOPCode(0xF129)).toEqual(OP_SET_I_TO_CHAR_SPRITE_IN_VX);
    //FX33	Stores the Binary-coded decimal representation of VX, with the most significant of three digits at the address in I, the middle digit at I plus 1, and the least significant digit at I plus 2. (In other words, take the decimal representation of VX, place the hundreds digit in memory at location in I, the tens digit at location I+1, and the ones digit at location I+2.)
    expect(chip8cpu.decodeOPCode(0xF133)).toEqual(OP_STORE_DEC_REP_IN_I);
    //FX55	Stores V0 to VX in memory starting at address I.[4]
    expect(chip8cpu.decodeOPCode(0xF155)).toEqual(OP_SAVE_V_REGISTERS_ADD_I);
    //FX65	Fills V0 to VX with values from memory starting at address I.[4]
    expect(chip8cpu.decodeOPCode(0xF165)).toEqual(OP_RESTORE_V_REGISTERS_FROM_I);
  });
});
