describe('Chip 8 CPU', function() {
  var chip8;

  beforeEach(function() {
    chip8cpu = new Chip8CPU();
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
  });
});
