var OP_CALL_PROG = 0;
var OP_CLEAR_SCREEN = 1;
var OP_RETURN_FROM_SUB = 2;
var OP_JMP_TO_ADDR = 3;
var OP_CALL_SUB_AT = 4;
var OP_SKIP_IF_VX_EQ = 5;
var OP_SKIP_IF_VX_NOT_EQ = 6;
var OP_SKIP_IF_VX_VY_EQ = 7;
var OP_SET_VX = 8;
var OP_ADD_TO_VX = 9;
var OP_SET_VX_TO_VY = 10;
var OP_SET_VX_TO_VX_OR_VY = 11;
var OP_SET_VX_TO_VX_AND_VY = 12;
var OP_SET_VX_TO_VX_XOR_VY = 13;
var OP_ADD_VY_TO_VX = 14;
var OP_SUB_VY_FROM_VX = 15;
var OP_SHIFT_RIGHT_VX = 16;
var OP_SET_VX_TO_VY_SUB_VX = 17;
var OP_SHIFT_LEFT_VX = 18;
var OP_SKIP_IF_VX_EQ_VY = 19;
var OP_SET_I = 20;
var OP_JUMP_TO_ADDR_PLUS_V0 = 21;
var OP_SET_VX_TO_RAND = 22;
var OP_WRAP_SPRITE_AROUND_SCREEN = 23;
var OP_SKIP_IF_KEY_VX_PRESSED = 24;
var OP_SKIP_IF_KEY_VX_NOT_PRESSED = 25;
var OP_SET_VX_TO_DELAY = 26;
var OP_WAIT_AND_SAVE_KEY_IN_VX = 27;
var OP_DELAY_TO_VX = 28;
var OP_SOUND_TO_VX = 29;
var OP_ADD_VX_TO_I = 30;
var OP_SET_I_TO_CHAR_SPRITE_IN_VX = 31;
var OP_STORE_DEC_REP_IN_I = 32;
var OP_SAVE_V_REGISTERS_ADD_I = 33;
var OP_RESTORE_V_REGISTERS_FROM_I = 34;

function Chip8CPU(){
  this.mem = new Chip8Mem();
  this.mem.init();

  this.screen = new Chip8Screen();
  this.screen.init();
}

Chip8CPU.prototype.getMem = function() {
  return this.mem;
};

Chip8CPU.prototype.getScreen = function() {
  return this.screen;
};

// OP 1
Chip8CPU.prototype.opClearScreen = function(code) {
  this.screen.init();
};

// OP 2
Chip8CPU.prototype.opReturnFromSub = function(code) {
  this.mem.writePc(this.mem.popStack());
};

// OP 3
Chip8CPU.prototype.opJumpTo = function(code) {
  var address = code & 0x0FFF;
  this.mem.writePc(address);
};

// OP 4
Chip8CPU.prototype.opCallSubAt = function(code) {
  var address = code & 0x0FFF;
  this.mem.pushOnStack(this.mem.readPc());
  this.mem.writePc(address);
};

// OP 5
Chip8CPU.prototype.opSkipIfVXEquals = function(code) {
  var value = code % 0x0100;
  var regNum = (code & 0x0F00) >> 8;
  if (value == this.mem.readV(regNum)){
    this.mem.writePc(this.mem.readPc() + 0x2);
  }
};

// OP 6 opSkipIfVXNotEquals
Chip8CPU.prototype.opSkipIfVXNotEquals = function(code) {
  var value = code % 0x0100;
  var regNum = (code & 0x0F00) >> 8;
  if (value != this.mem.readV(regNum)){
    this.mem.writePc(this.mem.readPc() + 0x2);
  }

};

// OP 7
Chip8CPU.prototype.opSkipIfVXEqualsVY = function(code) {
  var regX = (code & 0x0F00) >> 8;
  var regY = (code & 0x00F0) >> 4;
  if (this.mem.readV(regX) == this.mem.readV(regY)){
    this.mem.writePc(this.mem.readPc() + 0x2);
  }

};

// OP 8
Chip8CPU.prototype.opSetVX = function(code) {
  var value = code % 0x0100;
  var regNum = (code & 0x0F00) >> 8;

  this.mem.writeV(regNum, value);
};

// OP 9
Chip8CPU.prototype.opAddToVX = function(code) {
  var value = code % 0x0100;
  var regNum = (code & 0x0F00) >> 8;

  this.mem.writeV(regNum, this.mem.readV(regNum) + value);
};

// OP 10
Chip8CPU.prototype.opSetVXtoVY = function(code) {
  var regX = (code & 0x0F00) >> 8;
  var regY = (code & 0x00F0) >> 4;
  var value = this.mem.readV(regY);

  this.mem.writeV(regX, value);
};

// OP 11
Chip8CPU.prototype.opSetVXtoVXorVY = function(code) {
  var regX = (code & 0x0F00) >> 8;
  var regY = (code & 0x00F0) >> 4;
  var valueX = this.mem.readV(regX);
  var valueY = this.mem.readV(regY);

  this.mem.writeV(regX, valueX | valueY);
};

// OP 12
Chip8CPU.prototype.opSetVXtoVXandVY = function(code) {
  var regX = (code & 0x0F00) >> 8;
  var regY = (code & 0x00F0) >> 4;
  var valueX = this.mem.readV(regX);
  var valueY = this.mem.readV(regY);

  this.mem.writeV(regX, valueX & valueY);
};

// OP 13
Chip8CPU.prototype.opSetVXtoVXxorVY = function(code) {
  var regX = (code & 0x0F00) >> 8;
  var regY = (code & 0x00F0) >> 4;
  var valueX = this.mem.readV(regX);
  var valueY = this.mem.readV(regY);

  this.mem.writeV(regX, valueX ^ valueY);
};

// OP 14
Chip8CPU.prototype.opAddVYtoVX = function(code) {
  var regX = (code & 0x0F00) >> 8;
  var regY = (code & 0x00F0) >> 4;
  var valueX = this.mem.readV(regX);
  var valueY = this.mem.readV(regY);

  this.mem.writeV(regX, (valueX + valueY) % 0x0100);
  if (valueX + valueY >= 0x0100){
    this.mem.writeV(0xF,0x1);
  }
};

// OP 15
Chip8CPU.prototype.opSubVYfromVX = function(code) {
  var regX = (code & 0x0F00) >> 8;
  var regY = (code & 0x00F0) >> 4;
  var valueX = this.mem.readV(regX);
  var valueY = this.mem.readV(regY);

  this.mem.writeV(regX, (valueX - valueY) % 0x0100);
  if (valueX > valueY){
    this.mem.writeV(0xF,0x1);
  }
};

// OP 16
Chip8CPU.prototype.opShiftVXRight = function(code) {
  var regX = (code & 0x0F00) >> 8;
  var valueX = this.mem.readV(regX);

  this.mem.writeV(0xF, valueX & 0x01);
  this.mem.writeV(regX, valueX >> 1);
};

// OP 17
Chip8CPU.prototype.opSubVXfromVY = function(code) {
  var regX = (code & 0x0F00) >> 8;
  var regY = (code & 0x00F0) >> 4;
  var valueX = this.mem.readV(regX);
  var valueY = this.mem.readV(regY);

  this.mem.writeV(regX, (valueY - valueX) % 0x0100);
  if (valueY > valueX){
    this.mem.writeV(0xF,0x1);
  }
};

// OP 18
Chip8CPU.prototype.opShiftVXLeft = function(code) {
  var regX = (code & 0x0F00) >> 8;
  var valueX = this.mem.readV(regX);

  this.mem.writeV(0xF, (valueX & 0x80) >> 7);
  this.mem.writeV(regX, (valueX << 1) % 0x100);
};

// OP 19
Chip8CPU.prototype.opSkipIfVXnotEqualsVY = function(code) {
  var regX = (code & 0x0F00) >> 8;
  var regY = (code & 0x00F0) >> 4;
  var valueX = this.mem.readV(regX);
  var valueY = this.mem.readV(regY);

  if (valueX == valueY){
    this.mem.writePc(this.mem.readPc()+2);
  }
};

// OP 20
Chip8CPU.prototype.opSetI = function(code) {
  var value = code - 0xA000;
  this.mem.writeI(value);
};

// OP 21
Chip8CPU.prototype.opSetJumpToAddrPlusV0 = function(code) {
  var value = code & 0x0FFF;
  this.mem.writePc(this.mem.readV(0) + value);
};

// OP 23
Chip8CPU.prototype.opDrawSpriteAt = function(code) {
  var regX = (code & 0x0F00) >> 8;
  var regY = (code & 0x00F0) >> 4;
  var rowNum = code & 0x000F;
  var valueX = this.mem.readV(regX);
  var valueY = this.mem.readV(regY);

  for (var i = 0; i < rowNum; i++){
    var row = this.mem.readMem(this.mem.readI() + i);
    if (this.screen.drawRowFromByte(valueX,valueY+i,row)){
      this.mem.writeV(0xF,0x1);
    }
  }
};

// OP 30
Chip8CPU.prototype.opAddVXtoI = function(code) {
  var regX = (code & 0x0F00) >> 8;
  this.mem.writeI(this.mem.readI() + this.mem.readV(regX));
};

// OP 33
Chip8CPU.prototype.opSaveVRegistersToI = function(code) {
  var regX = (code & 0x0F00) >> 8;
  var startAddress = this.mem.readI();

  for (var i = 0; i <= regX; i++){
    var value = this.mem.readV(i);
    this.mem.writeMem(startAddress + i, value);
  }
};

// OP 34
Chip8CPU.prototype.opRestoreVRegistersFromI = function(code) {
  var regX = (code & 0x0F00) >> 8;
  var startAddress = this.mem.readI();

  for (var i = 0; i <= regX; i++){
    var value = this.mem.readMem(startAddress + i);
    this.mem.writeV(i, value);
  }
};

Chip8CPU.prototype.decodeOPCode = function(code) {
  if (code == 0x00E0){
    return OP_CLEAR_SCREEN;
  }
  if (code == 0x00EE){
    return OP_RETURN_FROM_SUB;
  }
  if (code >= 0x0000 && code <= 0x0FFF){
    return OP_CALL_PROG;
  }
  if (code >= 0x1000 && code <= 0x1FFF){
    return OP_JMP_TO_ADDR;
  }
  if (code >= 0x2000 && code <= 0x2FFF){
    return OP_CALL_SUB_AT;
  }
  if (code >= 0x3000 && code <= 0x3FFF){
    return OP_SKIP_IF_VX_EQ;
  }
  if (code >= 0x4000 && code <= 0x4FFF){
    return OP_SKIP_IF_VX_NOT_EQ;
  }
  if (code >= 0x5000 && code <= 0x5FFF){
    return OP_SKIP_IF_VX_VY_EQ;
  }
  if (code >= 0x6000 && code <= 0x6FFF){
    return OP_SET_VX;
  }
  if (code >= 0x7000 && code <= 0x7FFF){
    return OP_ADD_TO_VX;
  }
  if (code >= 0x8000 && code <= 0x8FFF){
    var code_ending = code % 0x0010;
    switch(code_ending) {
    case 0x000:
        return OP_SET_VX_TO_VY;
    case 0x001:
        return OP_SET_VX_TO_VX_OR_VY;
    case 0x002:
        return OP_SET_VX_TO_VX_AND_VY;
    case 0x003:
        return OP_SET_VX_TO_VX_XOR_VY;
    case 0x004:
        return OP_ADD_VY_TO_VX;
    case 0x005:
        return OP_SUB_VY_FROM_VX;
    case 0x006:
        return OP_SHIFT_RIGHT_VX;
    case 0x007:
        return OP_SET_VX_TO_VY_SUB_VX;
    case 0x00E:
        return OP_SHIFT_LEFT_VX;
    }
  }
  if (code >= 0x9000 && code <= 0x9FFF){
    return OP_SKIP_IF_VX_EQ_VY;
  }
  if (code >= 0xA000 && code <= 0xAFFF){
    return OP_SET_I;
  }
  if (code >= 0xB000 && code <= 0xBFFF){
    return OP_JUMP_TO_ADDR_PLUS_V0;
  }
  if (code >= 0xC000 && code <= 0xCFFF){
    return OP_SET_VX_TO_RAND;
  }
  if (code >= 0xD000 && code <= 0xDFFF){
    return OP_WRAP_SPRITE_AROUND_SCREEN;
  }
  if (code >= 0xE000 && code <= 0xEFFF){
    if (code % 0x0100 == 0x9E) {
      return OP_SKIP_IF_KEY_VX_PRESSED;
    } else {
      return OP_SKIP_IF_KEY_VX_NOT_PRESSED;
    }
  }
  if (code >= 0xF000 && code <= 0xFFFF){
    switch(code % 0x0100) {
    case 0x007:
        return OP_SET_VX_TO_DELAY;
    case 0x00A:
        return OP_WAIT_AND_SAVE_KEY_IN_VX;
    case 0x015:
        return OP_DELAY_TO_VX;
    case 0x018:
        return OP_SOUND_TO_VX;
    case 0x01E:
        return OP_ADD_VX_TO_I;
    case 0x029:
        return OP_SET_I_TO_CHAR_SPRITE_IN_VX;
    case 0x033:
        return OP_STORE_DEC_REP_IN_I;
    case 0x055:
        return OP_SAVE_V_REGISTERS_ADD_I;
    case 0x065:
        return OP_RESTORE_V_REGISTERS_FROM_I;
    }
  }
};
