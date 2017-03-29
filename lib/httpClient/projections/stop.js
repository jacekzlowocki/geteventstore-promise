const debug = require('debug')('geteventstore:stopProjection');
const req = require('request-promise');
const Promise = require('bluebird');
const assert = require('assert');
const url = require('url');

const baseErr = 'Stop Projection - ';

module.exports = config => {
    const buildUrl = name => {
        const urlObj = JSON.parse(JSON.stringify(config));
        urlObj.pathname = `/projection/${name}/command/disable`;
        return url.format(urlObj);
    };

    return name => Promise.resolve().then(() => {
        assert(name, `${baseErr}Name not provided`);

        const options = {
            uri: buildUrl(name),
            method: 'POST'
        };

        debug('', 'Options: %j', options);
        return req(options).then(response => {
            debug('', 'Response: %j', response);
            return JSON.parse(response);
        });
    });
};