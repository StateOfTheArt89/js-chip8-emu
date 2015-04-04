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

function Chip8CPU(){

}

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
};
