'use strict';

var gpsTimeStart = new Date("1980-01-06T00:00:00.000Z").getTime();

var currentEpoch = Math.floor( (Date.now() - gpsTimeStart) / (1024 * 7*24*3600*1000) );

var semParser = function(file, gpsEpoch) {

  if ( !gpsEpoch ) gpsEpoch = currentEpoch;

  var lines = file.split(/[\r\n]+/);

  var gpsWeek = parseInt( lines[1].slice(0,4) ),
      toa     = parseInt( lines[1].slice(5) );

  gpsWeek += gpsEpoch * 1024;

  var epoch = gpsWeek * 7*24*3600 + toa;

  var orbits = {
    gpsWeek: gpsWeek,
    toa: toa,
    epoch: epoch,
    satellites: []
  };

  for (var i = 2; i < lines.length-7; i += 8) {
    orbits.satellites.push( elementParser( lines.slice(i,i+8) ) );
  }

  if ( parseInt( lines[0].slice(0,2) ) !== orbits.satellites.length ) {
    throw new Error('Satellite count mismatch!')
  }

  return orbits;
}

function elementParser(lines) {
  var sat = {};

  sat.prn = parseInt( lines[0] );
  sat.svn = parseInt( lines[1] );
  sat.ura = parseInt( lines[2] );

  sat.eccentricity = parseFloat( lines[3].slice(0,21) );
  sat.inclination = semiCirclesToRad( parseFloat( lines[3].slice(22,43) ) + 0.3 );
  sat.rightAscensionDot = semiCirclesToRad( parseFloat( lines[3].slice(44,65) ) );

  sat.semimajorAxis = Math.pow( parseFloat( lines[4].slice(0,21) ), 2);
  sat.rightAscension = semiCirclesToRad( parseFloat( lines[4].slice(22,43) ) );
  sat.argumentOfPeriapsis = semiCirclesToRad( parseFloat( lines[4].slice(44,65) ) );

  sat.meanAnomaly = semiCirclesToRad( parseFloat( lines[5].slice(0,21) ) );
  sat.clockBias = parseFloat( lines[5].slice(22,43) );
  sat.clockDrift = parseFloat( lines[5].slice(44,65) );

  sat.health = parseInt( lines[6] );
  sat.config = parseInt( lines[7] );

  return sat;
}

function semiCirclesToRad(sc) {
  return Math.PI * sc;
}

module.exports = semParser;
