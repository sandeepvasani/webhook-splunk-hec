'use strict';

var SplunkLogger = require('splunk-logging').Logger;
var moment = require('moment');

module.exports.logToSplunk = (event, context, callback) => {

    var splunkConfig = {
        token: process.env.SPLUNK_TOKEN,
        url: process.env.SPLUNK_URL
    };
    var errMsg;
    const token = process.env.WEBHOOK_TOKEN;
    const headers = event.headers;
    const auth = headers['Authorization'];

    if (!auth) {
        errMsg = 'No Auth Found on Request';
        return callback(null, {
            statusCode: 401,
            headers: {
                'Content-Type': 'text/plain'
            },
            body: errMsg,
        });
    }

    if (auth !== token) {
        errMsg = 'Webhook Auth Failed';
        return callback(null, {
            statusCode: 401,
            headers: {
                'Content-Type': 'text/plain'
            },
            body: errMsg,
        });
    }

    let Logger = new SplunkLogger(splunkConfig);

    Logger.error = function(err, context) {
        // Handle errors here
        console.log("error", err, "context", context);
    };

    Logger.eventFormatter = function(message) {
        return message;
    }

    var payload = {
        message: JSON.parse(event.body),
        metadata: {
            time: (moment().valueOf()) / 1000,
        }
    }

    Logger.send(payload, function(err, resp, body) {
        if (err) {
            console.error("There was an error sending the data to splunk:", err);
            return callback(null, {
                statusCode: resp.statusCode,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            });
        } else {
            console.log("Logging successful", resp, body);
            return callback(null, {
                statusCode: resp.statusCode,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            });
        }
    });
};