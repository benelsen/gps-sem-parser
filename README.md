
# gps-sem-parser

## Example

```javascript
  import sem from 'gps-sem-parser';
  const almanac = sem( rawAlmanac );
```
```json
{
  "gpsWeek": 1844,
  "toa": 405504,
  "epoch": 1115656704,
  "satellites": [
    {
      "prn": 1,
      "svn": 63,
      "ura": 0,
      "eccentricity": 0.00419855117797852,
      "inclination": 0.9617664060621093,
      "rightAscensionDot": -8.114623720935037e-9,
      "semimajorAxis": 26559649.327529907,
      "rightAscension": -1.6779199426606246,
      "argumentOfPeriapsis": 0.37559459670255485,
      "meanAnomaly": -2.781213528432701,
      "clockBias": -0.0000057220458984375,
      "clockDrift": 0,
      "health": 0,
      "config": 11
    }
  ]
}
```

## API

### `sem(file, gpsEpoch)`

Parses a string containing a GPS almanac in sem format.
Pass `gpsEpoch` with the number of times the gps week has rolled over.
Set `gpsEpoch` to `null` and `year` to the year in which the almanac was issued to try to automatically resolve the gps epoch. (Defaults to current year)

Return an `Almanac` object.

#### Parameters

| name | type | description |
| ---- | ---- | ----------- |
| `file` | `string` | Almanac in SEM format |
| `gpsEpoch` | `number` | (optional) Number of times the GPS Week index rolled over. |
| `year` | `number` | (optional) Year in which the Almanac was issued (to resolve gps epoch). ) |

### `Almanac`

Object representing a GPS almanac

| name | type | description |
| ---- | ---- | ----------- |
| `gpsWeek` | `number` | GPS Week of the almanac |
| `toa` | `number` | Time of Applicability of the alamanc |
| `epoch` | `number` | Epoch of the almanac (seconds since start of GPS time) |
| `satellites` | `[Satellite]` | Array of satellite element sets |

### `Satellite`

Object representing a satellite element set.
(For details see IS-GPS-200)

| name | type | description |
| ---- | ---- | ----------- |
| `prn` | `number` | Assigned PRN |
| `svn` | `number` | Space Vehicle Number |
| `ura` | `number` | User Range Accuracy |
| `eccentricity` | `number` | Eccentricity at epoch |
| `inclination` | `number` | Inclination at epoch (rad) |
| `rightAscensionDot` | `number` | First derivative of the right ascension (rad/s) |
| `semimajorAxis` | `number` | Semimajor Axis at epoch (m) |
| `rightAscension` | `number` | Right ascension at start of GPS Week (rad) |
| `argumentOfPeriapsis` | `number` | Argument of periapsis (rad) |
| `meanAnomaly` | `number` | Mean Anomaly at epoch (rad) |
| `clockBias` | `number` | Clock bias at epoch (s) |
| `clockDrift` | `number` | Clock drift at epoch (s/s) |
| `health` | `number` | Health of satellite |
| `config` | `number` | Configuration of satellite |
