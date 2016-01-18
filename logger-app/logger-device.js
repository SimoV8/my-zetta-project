var Device = require('zetta').Device;
var util = require('util');
var fs = require('fs');

var Logger = module.exports = function(){
    Device.call(this);
};
util.inherits(Logger, Device);

Logger.prototype.init = function(config) {
    this.fileName = 'mylog.log';
    this.logs = [];
    this.length = 10;

    config
        .type('logger')
        .name('my-logger')
        .state('enabled');

    config
        .when('enabled', {allow: ['write', 'set-length', 'disable']})
        .when('disabled', {allow: ['enable']})
        .map('write', this.write, [{type: 'text', name: 'textToWrite'}])
        .map('set-length', this.setLength, [{type: 'int', name: 'length'}])
        .map('enable', this.enable)
        .map('disable', this.disable)
        .monitor('logs')
        .monitor('length');

};

Logger.prototype.enable = function(cb) {
    this.state = 'enabled';
    cb();
};

Logger.prototype.disable = function(cb) {
    this.state = 'disabled';
    cb();
};

Logger.prototype.write = function (textToWrite, cb) {
    var record = new Date().toISOString() + ' - ' + textToWrite + '\n';
    this.logs.push(record);
    while(this.logs.length > this.length)
        this.logs.shift();

    fs.appendFile(this.fileName, record, function(err) {
        cb();
        if (err) throw err;
    });
};

Logger.prototype.setLength = function(length, cb) {
    if(length < 0) {
        cb();
        return;
    }
    this.length = length;
    this.write('new length value is '+length, cb);
};

Logger.prototype.setFileName = function(fileName) {
    this.fileName = fileName;
};
