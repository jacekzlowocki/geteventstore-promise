var debug = require('debug')('geteventstore:writeEvents'),
    createConnection = require('./createConnection'),
    eventFactory = require('../eventFactory'),
    assert = require('assert'),
    q = require('q'),
    _ = require('lodash');

var baseErr = 'Write Events - ';

module.exports = function(config) {
    return function(streamName, events, options) {
        return q.Promise(function(resolve, reject) {
            assert(streamName, baseErr + 'Stream Name not provided');
            assert(events, baseErr + 'Events not provided');
            assert.equal(true, events.constructor === Array, baseErr + 'Events should be an array');
            if (events.length == 0)
                return resolve();

            options = options || {};
            options.expectedVersion = options.expectedVersion || -2;

            var connection = createConnection(config, reject);

            connection.writeEvents(streamName, options.expectedVersion, false, events, config.credentials, function(result) {
                debug('', 'Result: ' + JSON.stringify(result));
                connection.close();
                if (!_.isEmpty(result.error))
                    return reject(baseErr + result.error);

                return resolve(result);
            });
        });
    };
};