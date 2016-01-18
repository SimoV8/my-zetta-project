var wpi = require('wiring-pi');
var Device = require('zetta').Device;
var util = require('util');

var pins = {'red':11, 'green':12, 'blue':13};
var range = 255;

var LED = module.exports = function() {
    Device.call(this);
};

util.inherits(LED, Device);

LED.prototype.init = function(config) {
    this.color = '#FFFFFF';
    this.red = 255;
    this.green = 255;
    this.blue = 255;
    // Wpi setup
    wpi.setup('phys'); // Use physical pin numbering
    for (key in pins) {
        wpi.softPwmCreate(pins[key], 0, range);
    }
    // Zetta setup
    config
        .type('led')
        .state('off')
        .name('rgb-led');

    // State machine
    config
        .when('off', { allow: ['turn-on', 'set-color']})
        .when('on', { allow: ['turn-off', 'set-color']})
        .map('turn-off', this.turnOff)
        .map('turn-on', this.turnOn)
        .map('set-color', this.setColor, [{type: 'text', name:'color'}])
        .monitor('color');
};

LED.prototype.turnOff = function(cb) {
    this.state = 'off';
    this.setLedColor(0, 0, 0);
    cb();
};

LED.prototype.turnOn = function(cb) {
    this.state = 'on';
    this.setLedColor(this.red, this.green, this.blue);
    cb();
};

LED.prototype.setColor = function(color, cb) {
    var c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if(c !== null && c.length >= 4) {
        this.color = color;
        this.red = parseInt(c[1], 16);
        this.green = parseInt(c[2], 16);
        this.blue = parseInt(c[3], 16);
        this.turnOn(cb);
    } else {
        cb(); // If the color string is malformed it will be ignored.
    }
};

LED.prototype.setLedColor = function (red, green, blue) {
    wpi.softPwmWrite(pins['red'], red);
    wpi.softPwmWrite(pins['green'], green);
    wpi.softPwmWrite(pins['blue'], blue);
};