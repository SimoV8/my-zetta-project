module.exports = function(server) {
    var LEDQuery = server.where({type: 'led'});
    var TemperatureSensorQuery = server.where({type: 'temperature-sensor'});
    var LoggerQuery = server.from('logger-server').where({type: 'logger'});

    var argo = server.httpServer.cloud;
    argo.add(ThresholdReource, server);



    server.observe([LoggerQuery, TemperatureSensorQuery], function(logger, tempSensor) {


        var lastUpdate = 0;
        var lastThreshold = threshold;

        tempSensor.streams.temperature.on('data', function(v) {
            //if(!logger.available('enabled'))
            //    return;
            var temperature = v.data;

            var now = new Date().getTime() / 1000;
            if(temperature >= threshold && now - lastUpdate > 3) {
                logger.call('write', 'WARNING: The actual temperature is ' + temperature + ' °C!');
                lastUpdate = now;
            }
            if(temperature < threshold && now - lastUpdate > 10) {
                logger.call('write', 'The temperature is ' + temperature + ' °C!');
                lastUpdate = now;
            }

            if(threshold != lastThreshold) {
                logger.call('write', 'The new threshold is ' + threshold + ' °C!');
                lastThreshold = threshold;
            }

        });

    });

    server.observe([LEDQuery, TemperatureSensorQuery], function (led, tempSensor) {

        tempSensor.streams.temperature.on('data', function(v) {

            var temperature = v.data;
            if(temperature > threshold && led.available('turn-on'))
                led.call('turn-on');
            if(temperature <= threshold && led.available('turn-off'))
                led.call('turn-off');

        });


    });
};

var threshold = 26.0;

var ThresholdReource = function(server) {
    this.server = server;
};

ThresholdReource.prototype.init = function(config) {

    config
        .path('/threshold')
        .get('/', this.getThreshold)
        .consumes('application/json')
        .post('/', this.setThreshold);
};

ThresholdReource.prototype.getThreshold = function (env, next) {
    env.response.body = {threshold: threshold};
    next(env);
};

ThresholdReource.prototype.setThreshold = function(env, next) {
   env.request.getBody(function(err, body) {
       body = JSON.parse(body.toString());
       threshold = body['threshold'];
    });
    next(env);
};