function Chip8Mem() {
  this.memory = new Array(4096);
  this.V = new Array(16);
  this.I = 0x00; //index pointer
  this.pc = 0x00; //program counter
  this.stack = new Array(16);
  this.sp = 0; //stack pointer
}

Chip8Mem.prototype.init = function() {
  this.sp = 0x00;

  for (var i=0; i < 4096;i++)
  {
    this.memory[i] = 0x00;
  }
  for (i=0; i < 16;i++)
  {
    this.V[i] = 0x00;
    this.stack[i] = 0x00;
  }

};

Chip8Mem.prototype.readMem = function(address) {
  return this.memory[address];
};

Chip8Mem.prototype.writeMem = function(address, value) {

  if( Object.prototype.toString.call( value ) === '[object Array]' ) {
    for (var i = 0; i < value.length; i++){
      this.memory[address + i] = value[i];
    }
  } else {
    this.memory[address] = value;
  }
};

Chip8Mem.prototype.readV = function(num) {
  return this.V[num];
};

Chip8Mem.prototype.writeV = function(num, value) {
  this.V[num] = value;
};

Chip8Mem.prototype.writePc = function(value) {
  this.pc = value;
};

Chip8Mem.prototype.readPc = function() {
  return this.pc;
};

Chip8Mem.prototype.writeI = function(value) {
  this.I = value;
};

Chip8Mem.prototype.readI = function() {
  return this.I;
};

Chip8Mem.prototype.pushOnStack = function(value) {
  this.stack[this.sp] = value;
  this.sp++;
};

Chip8Mem.prototype.popStack = function(value) {
  this.sp--;
  return this.stack[this.sp];
};
