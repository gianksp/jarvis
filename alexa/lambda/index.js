/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/
'use strict';
const Alexa = require('alexa-sdk');
var https = require('https');
const ip = process.env.IP;
const port = process.env.PORT;
const tv_id = process.env.TV_ID;

const handlers = {
    'Presence': function () {
        this.emit(':tell', "Jarvis is online");
    },
    'TvOff': function () {
        this.emit(':tell', "Turning the tv off");
        https.get({ 
          host: ip, 
          port: port,
          path: `/api/tv/${tv_id}/off`,
          method: 'GET',
          rejectUnauthorized: false,
          requestCert: true,
          agent: false
        }, function(err, rsp) {
            console.log(err);
            console.log(rsp);
        });
    },
    'TvPlay': function () {
        this.emit(':tell', "Playing");
        https.get({ 
          host: ip, 
          port: port,
          path: `/api/tv/${tv_id}/play`,
          method: 'GET',
          rejectUnauthorized: false,
          requestCert: true,
          agent: false
        }, function(err, rsp) {
            console.log(err);
            console.log(rsp);
        });
    },
    'TvStop': function () {
        this.emit(':tell', "Stopping");
        https.get({ 
          host: ip, 
          port: port,
          path: `/api/tv/${tv_id}/stop`,
          method: 'GET',
          rejectUnauthorized: false,
          requestCert: true,
          agent: false
        }, function(err, rsp) {
            console.log(err);
            console.log(rsp);
        });
    },
    'TvPause': function () {
        this.emit(':tell', "Pausing");
        https.get({ 
          host: ip, 
          port: port,
          path: `/api/tv/${tv_id}/pause`,
          method: 'GET',
          rejectUnauthorized: false,
          requestCert: true,
          agent: false
        }, function(err, rsp) {
            console.log(err);
            console.log(rsp);
        });
    },
    'TvOn': function () {
        this.emit(':tell', "Turning the tv on");
        https.get({ 
          host: ip, 
          port: port,
          path: `/api/tv/${tv_id}/on`,
          method: 'GET',
          rejectUnauthorized: false,
          requestCert: true,
          agent: false
        }, function(err, rsp) {
            console.log(err);
            console.log(rsp);
        });
    },
    'TvToast': function () {
        this.emit(':tell', "Sending message via toast");
        https.get({ 
          host: ip, 
          port: port,
          path: `/api/tv/${tv_id}/toast?msg=Hello`,
          method: 'GET',
          rejectUnauthorized: false,
          requestCert: true,
          agent: false
        }, function(err, rsp) {
            console.log(err);
            console.log(rsp);
        });
    },
    'TvSwitchInput': function () {
        const input = this.event.request.intent.slots.input.value;
        console.log("Switch");
        console.log(this.event.request.intent.slots);
        var target;
        switch(input) {
           case "Jarvis":
                target = "HDMI_1";
                break;
            case "PlayStation":
                target = "HDMI_2";
                break;
            case "Chromecast":
                target = "HDMI_3";
                break;
        }
        console.log("Switching input going to "+target);
        this.emit(':tell', `Switching input to ${target}`);
        var path = `/api/tv/${tv_id}/input/${target}`;
        console.log(path);
        https.get({ 
          host: ip, 
          port: port,
          path: path,
          method: 'GET',
          rejectUnauthorized: false,
          requestCert: true,
          agent: false
        }, function(err, rsp) {
            console.log(err);
            console.log(rsp);
        });
    },
    'TvMute': function () {
        this.emit(':tell', "Muting tv");
        https.get({ 
          host: ip, 
          port: port,
          path: `/api/tv/${tv_id}/mute?toggle=true`,
          method: 'GET',
          rejectUnauthorized: false,
          requestCert: true,
          agent: false
        }, function(err, rsp) {
            console.log(err);
            console.log(rsp);
        });
    },
    'TvUnmute': function () {
        this.emit(':tell', "Unmuting tv");
        https.get({ 
          host: ip, 
          port: port,
          path: `/api/tv/${tv_id}/mute?toggle=false`,
          method: 'GET',
          rejectUnauthorized: false,
          requestCert: true,
          agent: false
        }, function(err, rsp) {
            console.log(err);
            console.log(rsp);
        });
    },
    'TvSetVolume': function () {
        const volume = this.event.request.intent.slots.volume.value;
        this.emit(':tell', `Setting volume to ${volume}`);
        https.get({ 
          host: ip, 
          port: port,
          path: `/api/tv/${tv_id}/volume?volume=${volume}`,
          method: 'GET',
          rejectUnauthorized: false,
          requestCert: true,
          agent: false
        }, function(err, rsp) {
            console.log(err);
            console.log(rsp);
        });
    },
    'TvChangeVolume': function () {
        this.emit(':tell', "Changing volume");
        https.get({ 
          host: ip, 
          port: port,
          path: `/api/tv/${tv_id}/volume/down`,
          method: 'GET',
          rejectUnauthorized: false,
          requestCert: true,
          agent: false
        }, function(err, rsp) {
            console.log(err);
            console.log(rsp);
        });
    },
    'TvLaunchApp': function () {
        const app = this.event.request.intent.slots.app.value;
        this.emit(':tell', "Launching app "+app);
        https.get({ 
          host: ip, 
          port: port,
          path: `/api/tv/${tv_id}/launch/${app}`,
          method: 'GET',
          rejectUnauthorized: false,
          requestCert: true,
          agent: false
        }, function(err, rsp) {
            console.log(err);
            console.log(rsp);
        });
    },
    'Unhandled': function () {
        this.emit(':ask', "I could not understand the command", "Please refine my search parameters");
    },
    'SessionEndedRequest': function () {
      console.log('session ended!');
    },
    'LaunchRequest': function () {
      this.emit(':tell', "Launching");
    },
    'IntentRequest': function () {
      this.emit(':tell', "Intenting");
    }
};

exports.handler = function (event, context, callback) {
    console.log(event);
    console.log(context);
    const alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
