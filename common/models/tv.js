'use strict';

const wol = require("node-wol");
const HttpError = require('../../server/error.js');

const API = {
	"APP_CLOSER": "ssap://system.launcher/close",
  	"APP_LAUNCHER": "ssap://system.launcher/launch",
  	"APP_STATUS": "ssap://system.launcher/getAppState",
  	"APPS_LIST": "ssap://com.webos.applicationManager/listLaunchPoints",
  	"IN_USE_APP": "ssap://com.webos.applicationManager/getForegroundAppInfo",
  	"MUTE_TV": "ssap://audio/setMute",
  	"SERVICE_LIST": "ssap://api/getServiceList",
  	"TOAST_CREATOR": "ssap://system.notifications/createToast",
  	"TURN_OFF_TV": "ssap://system/turnOff",
  	"SET_VOLUME": "ssap://audio/setVolume",
  	"GET_VOLUME": "ssap://audio/getVolume",
  	"UP_VOLUME": "ssap://audio/volumeUp",
  	"DOWN_VOLUME": "ssap://audio/volumeDown",
  	"SWITCH_INPUT": "ssap://tv/switchInput",
  	"GET_INPUT": "ssap://tv/getExternalInputList",
  	"LAUNCH": "ssap://system.launcher/launch",
  	"ENTER": "ssap://com.webos.service.ime/sendEnterKey",
    "PLAY": "ssap://media.controls/play",
    "PAUSE": "ssap://media.controls/pause",
    "STOP": "ssap://media.controls/stop"
}

module.exports = function(Tv) {

	// Hide methods
	Tv.disableRemoteMethod("updateAll", true);
	Tv.disableRemoteMethod("updateAttributes", false);
	Tv.disableRemoteMethod("findOne", true);
	Tv.disableRemoteMethod("replaceById", true);
	Tv.disableRemoteMethod("confirm", true);
	Tv.disableRemoteMethod("count", true);
	Tv.disableRemoteMethod("exists", true);
	Tv.disableRemoteMethod("resetPassword", true);
	Tv.disableRemoteMethodByName('createChangeStream');
	Tv.disableRemoteMethodByName("replaceOrCreate", true);
	Tv.disableRemoteMethodByName("upsertWithWhere", true);

    Tv.on = function(id, cb) {
    	console.log("Turning TV on command");
    	Tv.findById(id, function(err, device) {
    		if (device) {
				wol.wake(device.macAddress, function(error) {
				    if (error) {
				    	cb(new HttpError(500, 'INTERNAL_ERROR'))
				    } else {
				    	cb(null, "SUCCESS");
				    }
			    });
    		} else {
				cb(new HttpError(404, 'DEVICE_NOT_FOUND'));
    		}
    	});
    }

    Tv.off = function(id, cb) {
		request(id, API.TURN_OFF_TV, {}).then(function(response) {
    		cb(null, response);
    	}, function(err) {
    		cb(err);
    	});
    }

    Tv.play = function(id, cb) {
    request(id, API.PLAY, {}).then(function(response) {
        cb(null, response);
      }, function(err) {
        cb(err);
      });
    }

    Tv.pause = function(id, cb) {
    request(id, API.PAUSE, {}).then(function(response) {
        cb(null, response);
      }, function(err) {
        cb(err);
      });
    }

    Tv.stop = function(id, cb) {
    request(id, API.STOP, {}).then(function(response) {
        cb(null, response);
      }, function(err) {
        cb(err);
      });
    }

    Tv.toast = function(id, msg, cb) {
		subscribe(id, API.TOAST_CREATOR, {"message": msg}).then(function(response) {
    		cb(null, response);
    	}, function(err) {
    		cb(err);
    	});
    }

    Tv.enter = function(id, cb) {
    	request(id, API.ENTER, {}).then(function(response) {
    		cb(null, response);
    	}, function(err) {
    		cb(err);
    	});
    }

    Tv.switchInput = function(id, input, cb) {
		request(id, API.SWITCH_INPUT, {"inputId": input}).then(function(response) {
    		cb(null, response);
    	}, function(err) {
    		cb(err);
    	});
    }

    Tv.launchApp = function(id, app, cb) {
    	Tv.on(id, function(err, device) {
    		if (err) {
    			cb(err, null);
    		} else {
		    	request(id, API.APP_LAUNCHER, {"id": app.toLowerCase()}).then(function(response) {
		    		cb(null, response);
		    	}, function(err) {
		    		cb(err);
		    	});
		    }
    	})
    }

    Tv.mute = function(id, toggle, cb) {
    	subscribe(id, API.MUTE_TV, {"mute": toggle}).then(function(response) {
    		cb(null, response);
    	}, function(err) {
    		cb(err);
    	});
    }

    Tv.getInputList = function(id, cb) {
    	request(id, API.GET_INPUT, {}).then(function(response) {
    		cb(null, response);
    	}, function(err) {
    		cb(err);
    	});
    }

    Tv.getServiceList = function(id, cb) {
    	request(id, API.SERVICE_LIST, {}).then(function(response) {
    		cb(null, response);
    	}, function(err) {
    		cb(err);
    	});
    }

    Tv.setVolume = function(id, volume, cb) {
    	request(id, API.SET_VOLUME, {"volume": volume}).then(function(response) {
    		cb(null, response);
    	}, function(err) {
    		cb(err);
    	});
    }

    Tv.upVolume = function(id, cb) {
    	request(id, API.UP_VOLUME, {}).then(function(response) {
    		cb(null, response);
    	}, function(err) {
    		cb(err);
    	});
    }

    Tv.downVolume = function(id, cb) {
    	request(id, API.DOWN_VOLUME, {}).then(function(response) {
    		cb(null, response);
    	}, function(err) {
    		cb(err);
    	});
    }

    Tv.remoteMethod('on', {
    	description: 'Turn TV on by specifying the {{id}} of the device',
    	accepts: {arg: 'id', type: 'string'},
  		returns: {arg: 'success', type: 'string'},
  		http: {path: '/:id/on/', verb: 'get'}
    });

    Tv.remoteMethod('off', {
    	description: 'Turn TV off by specifying the {{id}} of the device',
    	accepts: {arg: 'id', type: 'string'},
  		returns: {arg: 'success', type: 'string'},
  		http: {path: '/:id/off/', verb: 'get'}
    });

    Tv.remoteMethod('mute', {
    	description: 'Mute TV by specifying the {{id}} of the device',
    	accepts: [{arg: 'id', type: 'string'}, {arg: 'toggle', type: 'boolean', source: 'query'}],
  		http: {path: '/:id/mute/', verb: 'get'}
    });

    Tv.remoteMethod('toast', {
    	description: 'Display a message via scren toast in the device for the specified {{id}}',
    	accepts: [{arg: 'id', type: 'string'}, {arg: 'msg', type: 'string', source: 'query'}],
  		returns: {arg: 'success', type: 'string'},
  		http: {path: '/:id/toast', verb: 'get'}
    });

    Tv.remoteMethod('setVolume', {
    	description: 'Set the volume in the device for the specified {{id}}',
    	accepts: [{arg: 'id', type: 'string'}, {arg: 'volume', type: 'integer', source: 'query'}],
  		returns: {arg: 'success', type: 'string'},
  		http: {path: '/:id/volume', verb: 'get'}
    });

    Tv.remoteMethod('upVolume', {
    	description: 'Up the volume in the device for the specified {{id}}',
    	accepts: [{arg: 'id', type: 'string'}],
  		returns: {arg: 'success', type: 'string'},
  		http: {path: '/:id/volume/up', verb: 'get'}
    });

    Tv.remoteMethod('downVolume', {
    	description: 'Down the volume in the device for the specified {{id}}',
    	accepts: [{arg: 'id', type: 'string'}],
  		returns: {arg: 'success', type: 'string'},
  		http: {path: '/:id/volume/down', verb: 'get'}
    });

    // AV_1, COMP_1, HDMI_1, HDMI_2, HDMI_3
    Tv.remoteMethod('switchInput', {
    	description: 'Switch input in the device for the specified {{id}}',
    	accepts: [{arg: 'id', type: 'string'}, {arg: 'input', type: 'string'}],
  		returns: {arg: 'success', type: 'string'},
  		http: {path: '/:id/input/:input', verb: 'get'}
    });

    Tv.remoteMethod('launchApp', {
    	description: 'Launch app in the device for the specified {{id}}',
    	accepts: [{arg: 'id', type: 'string'}, {arg: 'app', type: 'string'}],
  		returns: {arg: 'success', type: 'string'},
  		http: {path: '/:id/launch/:app', verb: 'get'}
    });

    Tv.remoteMethod('getInputList', {
    	description: 'Launch app in the device for the specified {{id}}',
    	accepts: {arg: 'id', type: 'string'},
  		returns: {arg: 'success', type: 'string'},
  		http: {path: '/:id/input', verb: 'get'}
    });

    Tv.remoteMethod('getServiceList', {
    	description: 'Get service list from device for the specified {{id}}',
    	accepts: {arg: 'id', type: 'string'},
  		returns: {arg: 'services', type: 'array'},
  		http: {path: '/:id/services', verb: 'get'}
    });

    Tv.remoteMethod('enter', {
    	description: 'Press ENTER command on device for the specified {{id}}',
    	accepts: {arg: 'id', type: 'string'},
  		returns: {arg: 'success', type: 'string'},
  		http: {path: '/:id/enter', verb: 'get'}
    });

    Tv.remoteMethod('play', {
      description: 'Play',
      accepts: {arg: 'id', type: 'string'},
      returns: {arg: 'success', type: 'string'},
      http: {path: '/:id/play', verb: 'get'}
    });

    Tv.remoteMethod('stop', {
      description: 'Stop',
      accepts: {arg: 'id', type: 'string'},
      returns: {arg: 'services', type: 'string'},
      http: {path: '/:id/stop', verb: 'get'}
    });

    Tv.remoteMethod('pause', {
      description: 'Pause',
      accepts: {arg: 'id', type: 'string'},
      returns: {arg: 'success', type: 'string'},
      http: {path: '/:id/pause', verb: 'get'}
    });

  	function connect(id) {
  		return new Promise(function(resolve, reject) {
	    	Tv.findById(id, function(err, device) {
	    		if (device) {
	    			var ip = device.ip;
	    		    var connection =  require("lgtv2")({
				      url: `ws://${ip}:3000`,
				      reconnect: false
				    });
				   	resolve(connection);
	    		} else {
	    			reject(new HttpError(404, 'DEVICE_NOT_FOUND'));
	    		}
	    	});
  		});
  	};

  	function request(id, command, payload) {
  		return new Promise(function(resolve, reject) {
	  		console.log(`Running request command ${command} with payload ${JSON.stringify(payload)}`);
	    	connect(id).then(function(connection){
			    connection.on("connect", function() {
			      connection.request(command, payload, function(err, res) {
			        if(res.returnValue == true)
			          connection.disconnect();
			      	resolve(res);
			      });
			    }).on("error", function(err) {
			        console.error(`Error while running request command ${command}:`, err);
              connection.disconnect();
              reject(new HttpError(500, err));
			    });
	    	}, function(error) {
	    		reject(error);
	    	});
  		});
  	};

  	function subscribe(id, command, payload) {
  		return new Promise(function(resolve, reject) {
  			console.log(`Running subscribe command ${command} with payload ${JSON.stringify(payload)}`);
	    	connect(id).then(function(connection){
			    connection.on("connect", function() {
			      connection.subscribe(command, payload, function(err, res) {
			        if(res.returnValue == true)
			          connection.disconnect();
			      	resolve(true);
			      });
			    }).on("error", function(err) {
			        console.error(`Error while running subscribe command ${command}:`, err);
              connection.disconnect();
			        reject(new HttpError(500, err));
			    });
	    	}, function(error) {
	    		reject(error);
	    	});
  		});
  	};
  
};
