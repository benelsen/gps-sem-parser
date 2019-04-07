
/**
 * Object representing a GPS almanac
 * @typedef {Object} Almanac
 * @property {number} gpsWeek         GPS Week of the almanac
 * @property {number} toa             Time of Applicability of the alamanc
 * @property {number} epoch           Epoch of the almanac (seconds since start of GPS time)
 * @property {[Satellite]} satellites Array of satellite element sets
 */

/**
 * Object representing a satellite element set.
 * (For details see IS-GPS-200)
 * @typedef {Object} Satellite
 * @property {number} prn                 Assigned PRN
 * @property {number} svn                 Space Vehicle Number
 * @property {number} ura                 User Range Accuracy
 * @property {number} eccentricity        Eccentricity at epoch
 * @property {number} inclination         Inclination at epoch (rad)
 * @property {number} rightAscensionDot   First derivative of the right ascension (rad/s)
 * @property {number} semimajorAxis       Semimajor Axis at epoch (m)
 * @property {number} rightAscension      Right ascension at start of GPS Week (rad)
 * @property {number} argumentOfPeriapsis Argument of periapsis (rad)
 * @property {number} meanAnomaly         Mean Anomaly at epoch (rad)
 * @property {number} clockBias           Clock bias at epoch (s)
 * @property {number} clockDrift          Clock drift at epoch (s/s)
 * @property {number} health              Health of satellite
 * @property {number} config              Configuration of satellite
 */

const gpsTimeStart = new Date('1980-01-06T00:00:00.000Z').getTime();

/**
 * Parses a string containing a GPS almanac in sem format
 * and returns it as an object.
 * @param  {string}  file                    Almanac in SEM format
 * @param  {number}  [gpsEpoch=null]         Number of times the GPS Week index rolled over.
 * @param  {number}  [year=null]             Year in which the Almanac was issued (to resolve gps epoch).
 * @returns {Almanac}
 */
export default function semParser (file, gpsEpoch = null, year = new Date().getUTCFullYear()) {

  const lines = file.split(/[\r\n]+/).map(line => line.trim()).filter(line => line.length > 0);
  const match = /^\s*(\d{1,4})\s+(\d+)\s*/.exec(lines[1])

  const gpsWeekRelative = parseInt( match[1], 10 )

  if (gpsEpoch === null) {

    const gpsWeekStartOfYear = Math.floor((Date.UTC(year, 0, 1) - gpsTimeStart) / (7 * 86400 * 1e3))

    let gpsEpochProposal = 0
    while ((gpsWeekRelative + gpsEpochProposal * 1024) < gpsWeekStartOfYear) {
      gpsEpochProposal++
    }

    gpsEpoch = gpsEpochProposal
  }

  const gpsWeek = gpsWeekRelative + gpsEpoch * 1024;
  const toa = parseInt( match[2], 10 );

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

/**
 * Convert semicircles to radians
 * @private
 * @param  {number} sc semicircles
 * @return {number}    radians
 */
function semiCirclesToRad(sc) {
  return Math.PI * sc;
}

/**
 * Parses the data for a single satellite
 * @private
 * @param  {[string]} lines The lines w/ the data for this satellite
 * @return {Satellite}      Set of elements for the satellite
 */
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
