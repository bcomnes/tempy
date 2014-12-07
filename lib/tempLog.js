var Firebase = require('firebase');
var fs = require('fs');
var local = {};

if (fs.existsSync('../local.json')) {
  local = require('../local.json')
};

console.log('tempLog called');

var temps = [];
var current;
var structure;
var thermostat;

function firstChild(obj) {
  return obj[Object.keys(obj)[0]];
}

var dataRef = new Firebase('wss://developer-api.nest.com');
dataRef.authWithCustomToken(process.env.TOKEN || local.token, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
});

dataRef.on('value', function(snapshot) {
  var data = snapshot.val();

  structure = firstChild(data.structures);
  thermostat = data.devices.thermostats[structure.thermostats[0]];
  thermostat.device_id = structure.thermostats[0];
  var scale = thermostat.temperature_scale.toLowerCase();
  var temp = thermostat['ambient_temperature_' + scale];
  temps.push(temp);
  current = temp
})

module.exports = function tempInject(req, res, next) {
  req.temps = temps;
  req.current = current;
  next();
}
