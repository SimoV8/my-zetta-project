var Device = require('zetta').Device;
var util = require('util');
var fs = require('fs');

var TemperatureSensor = module.exports = function() {
    Device.call(this);
};
util.inherits(TemperatureSensor, Device);


TemperatureSensor.prototype.init = function(config) {
    this.temperature = 0.0;

    // Zetta setup
    config
        .type('temperature-sensor')
        .state('on')
        .name('temperature-sensor');

    // State machine
    config
        .when('on', { allow: ['turn-off']})
        .when('off', { allow: ['turn-on']})
        .map('turn-on', this.turnOn)
        .map('turn-off', this.turnOff)
        .monitor('temperature')
        .stream('temperature-stream', this.streamTemperature);
};

TemperatureSensor.prototype.turnOn = function(cb) {
    this.state = 'on';
    cb();
};

TemperatureSensor.prototype.turnOff = function(cb) {
    this.state = 'off';
    cb();
};

TemperatureSensor.prototype.streamTemperature = function(stream) {
    self = this;
    setInterval(function(){
        var BASE_PATH= '/sys/bus/w1/devices/';
        if(this.state === 'off') {
            this.temperature = 0.0;
            stream.write(self.temperature);
            return;
        }
        fs.readdir(BASE_PATH, function(err, files) {
            if (err) throw err;
            for (file of files) {
                if(stringStartsWith(file, '28-'))  {
                    fs.readFile(BASE_PATH + file + '/w1_slave', 'utf-8', (err, data) => {
                        if (err) throw err;
                        lines = data.split("\n");
                        var temp = /^.*t=(\d+)$/i.exec(lines[1]);
                        self.temperature = parseFloat(temp[1]) / 1000;
                        stream.write(self.temperature);
                    });
                }
            }

        });

    }, 1000);
};

function stringStartsWith (string, prefix) {
    return string.slice(0, prefix.length) == prefix;
}