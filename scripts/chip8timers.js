function Chip8Timers() {
  this.dt = 0x0;
  this.st = 0x0;
  this.dtTime = new Date().getTime();
  this.stTime = new Date().getTime();
}

Chip8Timers.prototype.startTimers = function(){
  return this.dt;
};

Chip8Timers.prototype.readDelayTimerValue = function(){
  var dif = this.dt - ((new Date() - this.dtTime) / 16);
  if (dif > 0){
    return Math.round(dif);
  }
  return 0;
};

Chip8Timers.prototype.readSoundTimerValue = function(){
  var dif = this.st - ((new Date() - this.stTime) / 16);
  if (dif > 0){
    return Math.round(dif);
  }
  return 0;
};

Chip8Timers.prototype.writeDelayTimerValue = function(value){
  this.dtTime = new Date().getTime();
  this.dt = value;
};

Chip8Timers.prototype.writeSoundTimerValue = function(value){
  this.stTime = new Date().getTime();
  this.st = value;
};

Chip8Timers.prototype.init = function(){
  this.dt = 0x0;
  this.st = 0x0;

  var fnc = this.decTimerValues;
};

Chip8Timers.prototype.startTimers = function(){
  var self = this;
  window.setInterval(function(){self.writeDelayTimerValue(40);}, 16);
};
