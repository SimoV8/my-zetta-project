var zetta = require('zetta');
var LED = require('./pi-led-device');
var TemperatureSensor = require('./pi-temperature-sensor-device');
var App = require('./pi-app');

zetta()
    .name('raspberry-server')
    .use(LED)
    .use(App)
    .use(TemperatureSensor)
    .link('https://v8-zetta.herokuapp.com')
    .listen(1337, function(){
        console.log('Raspberry Server is running at http://127.0.0.1:1337');
    });