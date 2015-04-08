function Chip8Mem() {
  this.memory = new Array(4096);
  this.V = new Array(16);
  this.I = 0x00; //index pointer
  this.pc = 0x200; //program counter
  this.stack = new Array(16);
  this.sp = 0; //stack pointer
}

Chip8Mem.prototype.init = function() {
  this.sp = 0x00;
  this.pc = 0x200;

  for (var i=0; i < 4096;i++)
  {
    this.memory[i] = 0x00;
  }
  for (i=0; i < 16;i++)
  {
    this.V[i] = 0x00;
    this.stack[i] = 0x00;
  }

  var fontsetStart = 0x20;
  this.writeMem(fontsetStart + 0,[0xF0, 0x90, 0x90, 0x90, 0xF0]) // 0
  this.writeMem(fontsetStart + 5,[0x20, 0x60, 0x20, 0x20, 0x70]) // 1
  this.writeMem(fontsetStart + 10,[0xF0, 0x10, 0xF0, 0x80, 0xF0]) // 2
  this.writeMem(fontsetStart + 15,[0xF0, 0x10, 0xF0, 0x10, 0xF0]) // 3
  this.writeMem(fontsetStart + 20,[0x90, 0x90, 0xF0, 0x10, 0x10]) // 4
  this.writeMem(fontsetStart + 25,[0xF0, 0x80, 0xF0, 0x10, 0xF0]) // 5
  this.writeMem(fontsetStart + 30,[0xF0, 0x80, 0xF0, 0x90, 0xF0]) // 6
  this.writeMem(fontsetStart + 35,[0xF0, 0x10, 0x20, 0x40, 0x40]) // 7
  this.writeMem(fontsetStart + 40,[0xF0, 0x90, 0xF0, 0x90, 0xF0]) // 8
  this.writeMem(fontsetStart + 45,[0xF0, 0x90, 0xF0, 0x10, 0xF0]) // 9
  this.writeMem(fontsetStart + 50,[0xF0, 0x90, 0xF0, 0x90, 0x90]) // A
  this.writeMem(fontsetStart + 55,[0xE0, 0x90, 0xE0, 0x90, 0xE0]) // B
  this.writeMem(fontsetStart + 60,[0xF0, 0x80, 0x80, 0x80, 0xF0]) // C
  this.writeMem(fontsetStart + 65,[0xE0, 0x90, 0x90, 0x90, 0xE0]) // D
  this.writeMem(fontsetStart + 70,[0xF0, 0x80, 0xF0, 0x80, 0xF0]) // E
  this.writeMem(fontsetStart + 75,[0xF0, 0x80, 0xF0, 0x80, 0x80]) // F

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

Chip8Mem.prototype.readCurrentOpCode = function(){
  var currentOpCode = this.readMem(this.readPc()) << 8;
  currentOpCode += this.readMem(this.readPc()+1);
  return currentOpCode;
};
