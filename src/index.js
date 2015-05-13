
const gpsTimeStart = new Date("1980-01-06T00:00:00.000Z").getTime();

const currentEpoch = Math.floor( (Date.now() - gpsTimeStart) / (1024 * 7 * 86400 * 1e3) );

export default function semParser (file, gpsEpoch = currentEpoch) {

  const lines = file.split(/[\r\n]+/);

  const gpsWeek = parseInt( lines[1].slice(0, 4), 10 ) + gpsEpoch * 1024;
  const toa = parseInt( lines[1].slice(5), 10 );

  const epoch = gpsWeek * 7 * 86400 + toa;

  const orbits = {
    gpsWeek,
    toa,
    epoch,
    satellites: []
  };

  for (let i = 2; i < lines.length - 7; i += 8) {
    orbits.satellites.push( elementParser( lines.slice(i, i + 8) ) );
  }

  if ( parseInt( lines[0].slice(0, 2), 10 ) !== orbits.satellites.length ) {
    throw new Error('Satellite count mismatch!');
  }

  return orbits;
}

const lineRE = /[\dE+-.]+/g;

function semiCirclesToRad(sc) {
  return Math.PI * sc;
}

function elementParser(lines) {
  const sat = {};

  sat.prn = parseInt( lines[0], 10 );
  sat.svn = parseInt( lines[1], 10 );
  sat.ura = parseInt( lines[2], 10 );

  const line3 = lines[3].match(lineRE);
  sat.eccentricity = parseFloat( line3[0] );
  sat.inclination = semiCirclesToRad( parseFloat( line3[1] ) + 0.3 );
  sat.rightAscensionDot = semiCirclesToRad( parseFloat( line3[2] ) );

  const line4 = lines[4].match(lineRE);
  sat.semimajorAxis = Math.pow(parseFloat( line4[0] ), 2);
  sat.rightAscension = semiCirclesToRad( parseFloat( line4[1] ) );
  sat.argumentOfPeriapsis = semiCirclesToRad( parseFloat( line4[2] ) );

  const line5 = lines[5].match(lineRE);
  sat.meanAnomaly = semiCirclesToRad( parseFloat( line5[0] ) );
  sat.clockBias = parseFloat( line5[1] );
  sat.clockDrift = parseFloat( line5[2] );

  sat.health = parseInt( lines[6], 10 );
  sat.config = parseInt( lines[7], 10 );

  return sat;
}
