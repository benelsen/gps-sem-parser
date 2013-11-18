(function() {
  'use strict';

  var semParser = function(file) {

    var lines = file.split('\r\n');

    var orbits = {
      gpsWeek: parseInt( lines[1].slice(0,4) ),
      toa: parseInt( lines[1].slice(5) ),
      satellites: []
    };

    for (var i = 3; i < lines.length; i += 9) {
      orbits.satellites.push( elementParser( lines.slice(i,i+9) ) );
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
    sat.config = parseInt( lines[7] ).toString(2);

    return sat;
  }

  function semiCirclesToRad(sc) {
    return Math.PI * sc;
  }

  module.exports = semParser;
})();
