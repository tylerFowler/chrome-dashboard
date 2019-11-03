import { WeatherLocation, Forecast, WeatherLocationType, WeatherConditionType } from './interface';
import { getRelativeFuturePeriod } from './selectors';

export const OpenWeatherApi = 'https://api.openweathermap.org/data/2.5';

// isCacheableRequest determines whether an OpenWeather API request is cacheable,
// and applies to all OpenWeather API calls as they are all cacheable.
export function isCacheableRequest(request: Request): boolean {
  if (request.url.startsWith(OpenWeatherApi)) {
    return true;
  }

  return false;
}

const usingApiKey = (query: URLSearchParams): URLSearchParams => {
  query.set('appid', process.env.OPENWEATHER_API_KEY);
  return query;
};

const usingJSON = (query: URLSearchParams): URLSearchParams => {
  query.set('mode', 'json');
  return query;
};

const usingUnits = (query: URLSearchParams, unit: 'F'|'C'): URLSearchParams => {
  let unitSetting: string;

  switch (unit) {
  case 'C':
    unitSetting = 'metric';
    break;
  case 'F':
  default:
    unitSetting = 'imperial';
  }

  query.set('units', unitSetting);
  return query;
};

const getApiQueryForLocation = (location: WeatherLocation): URLSearchParams => {
  const query = new URLSearchParams();

  switch (location.type) {
  case WeatherLocationType.CityName:
    if (location.countryCode) {
      query.set('q', `${location.value},${location.countryCode}`);
    } else {
      query.set('q', location.value);
    }

    break;
  case WeatherLocationType.ZIPCode:
    if (location.countryCode) {
      query.set('zip', `${location.value},${location.countryCode}`);
    } else {
      query.set('zip', location.value);
    }

    break;
  case WeatherLocationType.Coords:
  case WeatherLocationType.Current:
    query.set('lat', location.value.lat);
    query.set('lon', location.value.lon);

    break;
  }

  return query;
};

// getConditionFromCode translates OpenWeather's condition and icon codes to
// our custom condition type
const getConditionFromCode = (code: number, icon: string): WeatherConditionType => {
  // only 3 digit codes are supported
  if (code.toString().length !== 3) {
    throw new Error(`Only 3 digit weather condition codes are supported, received ${code}`);
  }

  // last character of icon name is 'd' for daytime and 'n' for night
  const isDaytime = icon.charAt(icon.length - 1) === 'd';

  const digit = `${code}`.charAt(0);

  switch (digit) {
  case '2': // thunderstorms
    return 'thunderstorm'; // only one type is supported
  case '3': // drizzle, not differentiated from light rain
    if (code === 314 || code === 302) {
      return 'heavyRain'; // heavy drizzle is interpreted as heavy rain
    } else {
      return isDaytime ? 'partlySunnyRain' : 'partlyMoonyRain';
    }
  case '5': // rain
    if (code === 502 || code === 503 || code === 504 || code === 522) {
      return 'heavyRain';
    } else if (code === 511) { // freezing rain interpreted as snow
      return 'snow';
    } else if (code === 500 || code === 520) { // light rain
      return isDaytime ? 'partlySunnyRain' : 'partlyMoonyRain';
    } else {
      return 'rain';
    }
  case '6': // snow
    if (code === 602 || code === 622) {
      return 'heavySnow';
    } else {
      return 'snow';
    }
  case '7': // atmospheric conditions all shown as wind
    return 'wind';
  case '8': // clouds
    if (code === 800) {
      return isDaytime ? 'clearDay' : 'clearNight';
    }

    if (code <= 803) {
      return isDaytime ? 'partlyCloudyDay' : 'partlyCloudyNight';
    }

    return 'cloudy';
  }

  return 'unknown';
};

interface GetWeatherResponse {
  dt: number;
  name: string;
  sys: { country: string };
  main: { temp: number };
  weather: Array<{ id: string, icon: string }>;
}

interface GetForecastResponse {
  city: { name: string, country: string };
  list: Array<{
    dt: number;
    main: { temp: number },
    weather: Array<{ id: string, icon: string }>,
  }>;
}

export interface CityDetails {
  name: string;
  country?: string;
}

interface ForecastInfo extends Forecast { city?: CityDetails; }

export async function fetchCurrentWeather(location: WeatherLocation, unit: 'F'|'C'): Promise<ForecastInfo> {
  const query = usingUnits(usingJSON(usingApiKey(getApiQueryForLocation(location))), unit);
  const response = await fetch(`${OpenWeatherApi}/weather?${query.toString()}`);

  const data: GetWeatherResponse = await response.json();

  if (!data.weather || data.weather.length === 0) {
    throw new Error('Received no weather data');
  }

  const [ weather ] = data.weather;

  return {
    city: { name: data.name, country: data.sys.country },
    condition: getConditionFromCode(parseInt(weather.id, 10), weather.icon),
    temperature: parseInt(data.main.temp.toFixed(), 10),
  };
}

// getTargetForecastTime calculates the the next ideal datetime for a given period,
// if the future period is "tomorrow" it will give noon the next day and if
// "tonight" it will give 8pm the same day. All times are in the local timezone.
const getTargetForecastTime = (futurePeriod: 'Tomorrow'|'Tonight') => {
  const targetedForecastTime = new Date();
  targetedForecastTime.setMinutes(0);
  targetedForecastTime.setSeconds(0);

  if (futurePeriod === 'Tomorrow') { // for "tomorrow" get closest time to noon
    targetedForecastTime.setDate(targetedForecastTime.getDate() + 1);
    targetedForecastTime.setHours(12);
  } else if (futurePeriod === 'Tonight') { // for "tonight" get closest time to 8pm
    targetedForecastTime.setHours(12 + 8);
  }

  return targetedForecastTime;
};

export async function fetchFutureWeather(location: WeatherLocation, unit: 'F'|'C'): Promise<ForecastInfo> {
  const query = usingUnits(usingJSON(usingApiKey(getApiQueryForLocation(location))), unit);
  const response = await fetch(`${OpenWeatherApi}/forecast?${query.toString()}`);

  const data: GetForecastResponse = await response.json();

  if (!data.list || data.list.length === 0) {
    throw new Error('No forecast data received');
  }

  // the forecast time period wanted for the forecast
  // TODO: also, figure out why this is requested twice, probably due to settings loading
  //       – it might be a good idea to defer all other sagas until the settings
  //         are loaded from storage
  const targetedForecastTime = getTargetForecastTime(getRelativeFuturePeriod());

  // get the datapoint closest to the target time by hour, if that leaves
  // nothing use the first datapoint (this shouldn't happen)
  // TODO: add tests
  const forecastsByProximity = data.list
    .map(p => ({ ...p, dt: new Date(p.dt * 1000) }))
    .filter(({ dt }) => dt.getDay() === targetedForecastTime.getDay())
    .map(p => [ p, Math.abs(targetedForecastTime.getHours() - p.dt.getHours()) ] as [ typeof p, number ])
    .sort(([, hourDistA ], [, hourDistB ]) => hourDistA - hourDistB)
    .map(([ p ]) => p);

  const forecast = forecastsByProximity[0] || data.list[0];

  if (!forecast.weather || forecast.weather.length === 0) {
    throw new Error('Found no forecast information for input');
  }

  const [ weather ] = forecast.weather;

  return {
    city: { name: data.city.name, country: data.city.country },
    condition: getConditionFromCode(parseInt(weather.id, 10), weather.icon),
    temperature: parseInt(forecast.main.temp.toFixed(), 10),
  };
}

export async function fetchForecasts(location: WeatherLocation, unit: 'F'|'C'): Promise<{
  current: Forecast,
  future: Forecast,
  city?: CityDetails,
}> {
  if (WeatherLocation.isCoords(location)) {
    if (!location.value.lat || !location.value.lon) {
      throw new Error('Must specify location coordinates');
    }
  } else if (!location.value) {
    throw new Error('Must specify a location');
  }

  const [ current, future ] = await Promise.all([
    fetchCurrentWeather(location, unit), fetchFutureWeather(location, unit),
  ]);

  const cityData = current.city || future.city;

  // don't leak embedded city data
  delete current.city;
  delete future.city;

  return { current, future, city: cityData };
}
