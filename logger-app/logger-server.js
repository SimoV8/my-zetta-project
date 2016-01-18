var zetta = require('zetta');
var Logger = require('./logger-device');

zetta()
    .name('logger-server')
    .use(Logger)
    .link('https://v8-zetta.herokuapp.com')
    .link('http://10.42.0.47:1337')
    .listen(1337, function() {
        console.log('log server is running at http://127.0.0.1:1337');
    });