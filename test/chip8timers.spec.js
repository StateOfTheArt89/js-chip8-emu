describe('Chip 8 Timers', function() {
  var chip8timers;

  beforeEach(function() {
    chip8timers = new Chip8Timers();
    chip8timers.init();
  });

  it('initializes timers', function() {
    expect(chip8timers.readDelayTimerValue()).toEqual(0x0);
    expect(chip8timers.readSoundTimerValue()).toEqual(0x0);
  });

  it('write timer values', function() {
    chip8timers.writeDelayTimerValue(0x0D);
    chip8timers.writeSoundTimerValue(0x0E);

    expect(chip8timers.readDelayTimerValue()).toEqual(0x0D);
    expect(chip8timers.readSoundTimerValue()).toEqual(0x0E);
  });

  it('timers count down at 60hz', function() {
    chip8timers.writeDelayTimerValue(100);
    chip8timers.writeSoundTimerValue(100);
    chip8timers.startTimers();

    // sleep 1 second
    ms = new Date().getTime() + 1000;
    while (new Date() < ms){}

    expect(chip8timers.readDelayTimerValue()).toBeGreaterThan(35);
    expect(chip8timers.readSoundTimerValue()).toBeGreaterThan(35);
    expect(chip8timers.readDelayTimerValue()).toBeLessThan(45);
    expect(chip8timers.readSoundTimerValue()).toBeLessThan(45);
  });

});
