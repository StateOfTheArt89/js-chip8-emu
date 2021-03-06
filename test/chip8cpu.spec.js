describe('Chip 8 CPU', function() {
  var chip8;
  var chip8mem;
  var chip8screen;
  var chip8timers;
  var chip8keyboard;

  beforeEach(function() {
    chip8cpu = new Chip8CPU();
    chip8mem = chip8cpu.getMem();
    chip8screen = chip8cpu.getScreen();
    chip8timers = chip8cpu.getTimers();
    chip8keyboard = chip8cpu.getKeyboard();
  });

  it('returns op function from op code', function() {
    expect(chip8cpu.getOpFunction(0x00E0)).toEqual(chip8cpu.opClearScreen);
    expect(chip8cpu.getOpFunction(0x7E10)).toEqual(chip8cpu.opAddToVX);
  });

  it('executes next operation', function() {
    chip8mem.writePc(0x200);
    chip8mem.writeMem(0x200, 0x60);
    chip8mem.writeMem(0x201, 0x42); // Set V0 to 0x42
    chip8mem.writeMem(0x202, 0x70);
    chip8mem.writeMem(0x203, 0x01); // Add 1 to V0 0x7201
    chip8mem.writeMem(0x204, 0x70);
    chip8mem.writeMem(0x205, 0x01); // Add 1 to V0 0x7201
    chip8cpu.executeNext();
    chip8cpu.executeNext();
    chip8cpu.executeNext();

    expect(chip8mem.readV(0x0)).toEqual(0x44);
  });

  it('executes op 1: clear screen', function() {
    chip8cpu.opClearScreen(0x00E0);
    expect(chip8screen.readPixel(0,0)).toEqual(0x0);
    expect(chip8screen.readPixel(5,5)).toEqual(0x0);
  });

  it('executes op 2: return from subroutine', function() {
    chip8mem.pushOnStack(0x123);
    chip8cpu.opReturnFromSub(0x00EE);
    expect(chip8mem.readPc()).toEqual(0x123);
  });

  it('executes op 3: jump to address nnn', function() {
    chip8mem.writePc(0x200);
    chip8cpu.opJumpTo(0x1333);
    expect(chip8mem.readPc()).toEqual(0x333);
  });

   it('executes op 4: call routine add address nnn', function() {
     chip8mem.writePc(0x300);
     chip8cpu.opCallSubAt(0x1FED);
     expect(chip8mem.readPc()).toEqual(0xFED);
     expect(chip8mem.popStack()).toEqual(0x300);
   });

  it('executes op 5: skip if vx equals nn', function() {
    chip8mem.writePc(0x200);
    chip8mem.writeV(0x5,0x11);
    chip8cpu.opSkipIfVXEquals(0x3511);
    expect(chip8mem.readPc()).toEqual(0x202);
    //negative test
    chip8mem.writePc(0x200);
    chip8mem.writeV(0x5,0x11);
    chip8cpu.opSkipIfVXEquals(0x3512);
    expect(chip8mem.readPc()).toEqual(0x200);
  });

  it('executes op 6: skip if vx not equals nn', function() {
    chip8mem.writePc(0x200);
    chip8mem.writeV(0x6,0x11);
    chip8cpu.opSkipIfVXNotEquals(0x4612);
    expect(chip8mem.readPc()).toEqual(0x202);
    //negative test
    chip8mem.writePc(0x200);
    chip8mem.writeV(0x6,0x11);
    chip8cpu.opSkipIfVXNotEquals(0x4611);
    expect(chip8mem.readPc()).toEqual(0x200);
  });

  it('executes op 7: skip if vx equals vy', function() {
    chip8mem.writePc(0x200);
    chip8mem.writeV(0x1, 0x01);
    chip8mem.writeV(0x2, 0x01);
    chip8cpu.opSkipIfVXEqualsVY(0x5120);
    expect(chip8mem.readPc()).toEqual(0x202);
    //negative test
    chip8mem.writePc(0x200);
    chip8mem.writeV(0x1, 0x01);
    chip8mem.writeV(0x2, 0x02);
    chip8cpu.opSkipIfVXEqualsVY(0x5120);
    expect(chip8mem.readPc()).toEqual(0x200);
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

  it('executes op 14: add vy to vx', function() {
    chip8mem.writeV(0x1, 2);
    chip8mem.writeV(0x2, 2);
    chip8cpu.opAddVYtoVX(0x8124);
    expect(chip8mem.readV(0x1)).toEqual(4);
  });

  it('executes op 14: add vy to vx (overflow)', function() {
    chip8mem.writeV(0x1, 0xFF);
    chip8mem.writeV(0x2, 0x01);
    chip8cpu.opAddVYtoVX(0x8124);
    expect(chip8mem.readV(0x1)).toEqual(0x00);
    expect(chip8mem.readV(0xF)).toEqual(0x01);
  });

  it('executes op 15: sub vy from vx', function() {
    chip8mem.writeV(0x1, 0xFF);
    chip8mem.writeV(0x2, 0x01);
    chip8cpu.opSubVYfromVX(0x8125);
    expect(chip8mem.readV(0x1)).toEqual(0xFE);
    expect(chip8mem.readV(0xF)).toEqual(0x1);
  });

  it('executes op 16: shift vx right by one', function() {
    chip8mem.writeV(0x1, 0x02);
    chip8cpu.opShiftVXRight(0x8126);
    expect(chip8mem.readV(0x1)).toEqual(0x01);
    expect(chip8mem.readV(0xF)).toEqual(0x00);
  });

  it('executes op 16: shift vx right by one (overflow)', function() {
    chip8mem.writeV(0x1, 0xFF);
    chip8cpu.opShiftVXRight(0x8126);
    expect(chip8mem.readV(0x1)).toEqual(0x7F);
    expect(chip8mem.readV(0xF)).toEqual(0x01);
  });

  it('executes op 17: sub vy from vx', function() {
    chip8mem.writeV(0x1, 0x0F);
    chip8mem.writeV(0x2, 0xFF);
    chip8cpu.opSubVXfromVY(0x8127);
    expect(chip8mem.readV(0x1)).toEqual(0xF0);
    expect(chip8mem.readV(0xF)).toEqual(0x01);
  });

  it('executes op 18: shift vx left by one', function() {
    chip8mem.writeV(0x1, 0x01);
    chip8cpu.opShiftVXLeft(0x812E);
    expect(chip8mem.readV(0x1)).toEqual(0x02);
    expect(chip8mem.readV(0xF)).toEqual(0x00);
  });

  it('executes op 18: shift vx left by one (overflow)', function() {
    chip8mem.writeV(0x1, 0xFF);
    chip8cpu.opShiftVXLeft(0x812E);
    expect(chip8mem.readV(0x1)).toEqual(0xFE);
    expect(chip8mem.readV(0xF)).toEqual(0x01);
  });

  it('executes op 19: skip next inst if vx not equals vy', function() {
    chip8mem.writePc(0x10);
    chip8mem.writeV(0x1, 0xFF);
    chip8mem.writeV(0x2, 0xFF);
    chip8cpu.opSkipIfVXnotEqualsVY(0x9120);
    expect(chip8mem.readPc()).toEqual(0x12);
  });

  it('executes op 20: set i', function() {
    chip8cpu.opSetI(0xA123);
    expect(chip8mem.readI()).toEqual(0x123);
  });

  it('executes op 21: jump to location nnn + V0', function() {
    chip8mem.writeV(0, 0x023);
    chip8cpu.opSetJumpToAddrPlusV0(0xB100);
    expect(chip8mem.readPc()).toEqual(0x123);
  });

  it('executes op 22: set vx to random nn', function() {
    chip8mem.writeV(0x1,-1);
    chip8cpu.opSetVXToRandom(0xC1FF);
    expect(chip8mem.readV(0x1)).toBeGreaterThan(-1);
  });

  it('executes op 23: draw sprite at x y', function() {
    chip8mem.writeI(0x0100);
    chip8mem.writeMem(0x0100, 0xFF); // oooooooo
    chip8mem.writeMem(0x0101, 0x81); // o      o
    chip8mem.writeMem(0x0102, 0xFF); // oooooooo
    //draw sprite at index at (0,0) with 3 rows
    chip8cpu.opDrawSpriteAt(0xD003);
    expect(chip8screen.readPixel(0,0)).toEqual(0x1);
    expect(chip8screen.readPixel(7,0)).toEqual(0x1);
    expect(chip8screen.readPixel(0,1)).toEqual(0x1);
    expect(chip8screen.readPixel(1,1)).toEqual(0x0);
    expect(chip8screen.readPixel(2,1)).toEqual(0x0);
    expect(chip8screen.readPixel(0,2)).toEqual(0x1);
    expect(chip8screen.readPixel(7,2)).toEqual(0x1);
    expect(chip8screen.readPixel(8,2)).toEqual(0x0);
  });

  it('executes op 23: draw sprite at x y (set vf flag)', function() {
    chip8mem.writeV(0xF,0x00);
    chip8mem.writeI(0x0200);
    chip8mem.writeMem(0x0200, 0xFF); // oooooooo
    chip8screen.writePixel(3,0,0x1);
    //draw sprite at index at (0,0) with 1 rows
    chip8cpu.opDrawSpriteAt(0xD001);
    expect(chip8mem.readV(0xF)).toEqual(0x01);
  });

  it('executes op 23: draw sprite at x y (drawing acts as xor)', function() {
    chip8mem.writeI(0x0100);
    chip8mem.writeMem(0x0100, 0xFF); // oooooooo
    chip8mem.writeMem(0x0101, 0x81); // o      o
    chip8mem.writeMem(0x0102, 0xFF); // oooooooo
    //draw sprite at index at (0,0) with 3 rows
    chip8cpu.opDrawSpriteAt(0xD003);
    chip8cpu.opDrawSpriteAt(0xD003);
    expect(chip8screen.readPixel(0,0)).toEqual(0x0);
    expect(chip8screen.readPixel(7,0)).toEqual(0x0);
    expect(chip8screen.readPixel(0,1)).toEqual(0x0);
    expect(chip8screen.readPixel(1,1)).toEqual(0x0);
    expect(chip8screen.readPixel(2,1)).toEqual(0x0);
    expect(chip8screen.readPixel(0,2)).toEqual(0x0);
    expect(chip8screen.readPixel(7,2)).toEqual(0x0);
    expect(chip8screen.readPixel(8,2)).toEqual(0x0);
  });

  it('executes op 24: skip next if key vx is pressed', function() {
    chip8mem.writePc(0x200);
    chip8mem.writeV(0x1,0x1);
    chip8keyboard.keyDown(0x1);
    chip8cpu.opSkipIfKeyVXPressed(0xE19E);
    expect(chip8mem.readPc()).toEqual(0x202);
  });

  it('executes op 25: skip next if key vx is not pressed', function() {
    chip8mem.writePc(0x200);
    chip8mem.writeV(0x1,0x1);
    chip8keyboard.keyDown(0x1);
    chip8cpu.opSkipIfKeyVXNotPressed(0xE1A1);
    expect(chip8mem.readPc()).toEqual(0x200);

    chip8mem.writePc(0x200);
    chip8mem.writeV(0x1,0x1);
    chip8keyboard.keyUp(0x1);
    chip8cpu.opSkipIfKeyVXNotPressed(0xE1A1);
    expect(chip8mem.readPc()).toEqual(0x202);
  });

  it('executes op 26: set vx to delay timer', function() {
    chip8timers.writeDelayTimerValue(0x11);
    chip8cpu.opSetVXToDelayTimer(0xF107);
    expect(chip8mem.readV(0x1)).toEqual(0x11);
  });

  it('executes op 27: wait for key press (store in vx)', function() {
    chip8mem.writePc(0x204);
    chip8cpu.opWaitForKeyPress(0xF10A);
    chip8cpu.opWaitForKeyPress(0xF10A);
    expect(chip8mem.readPc()).toEqual(0x200);
    chip8keyboard.keyDown(0x1);
    chip8cpu.opWaitForKeyPress(0xF10A);
    expect(chip8mem.readPc()).toEqual(0x200);
  });

  it('executes op 28: set delay timer to vx', function() {
    chip8mem.writeV(0x1, 0x42);
    chip8cpu.opSetDelayTimerToVX(0xF115);
    expect(chip8timers.readDelayTimerValue()).toEqual(0x42);
  });

  it('executes op 29: set sound timer to vx', function() {
    chip8mem.writeV(0x1, 0x42);
    chip8cpu.opSetSoundTimerToVX(0xF118);
    expect(chip8timers.readSoundTimerValue()).toEqual(0x42);
  });

  it('executes op 30: add vx to i', function() {
    chip8mem.writeV(0x1, 0x42);
    chip8cpu.opAddVXtoI(0xF11E);
    expect(chip8mem.readI()).toEqual(0x42);
  });

  it('executes op 31: set i to the location of char in vx', function() {
    chip8mem.writeV(0x1, 0x00);
    chip8cpu.opSetIToCharSpriteVX(0xF129);
    expect(chip8mem.readI()).toEqual(0x20);
  });

  //fx33 Stores the Binary-coded decimal representation of VX, with the most significant of three digits at the address in I, the middle digit at I plus 1, and the least significant digit at I plus 2. (In other words, take the decimal representation of VX, place the hundreds digit in memory at location in I, the tens digit at location I+1, and the ones digit at location I+2.)
  it('executes op 32: set i decimal represention of vx', function() {
    chip8mem.writeV(0x1, 0xFF);
    chip8mem.writeI(0x200);
    chip8cpu.opSetIDecimalVX(0xF133);
    expect(chip8mem.readMem(0x200)).toEqual(2);
    expect(chip8mem.readMem(0x201)).toEqual(5);
    expect(chip8mem.readMem(0x202)).toEqual(5);
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
