import { WeatherLocation, Forecast, WeatherLocationType, WeatherConditionType } from './interface';

export const OpenWeatherApi = 'https://api.openweathermap.org/data/2.5';

// isCacheableRequest determines whether an OpenWeather API request is cacheable,
// and applies to all OpenWeather API calls as they are all cacheable.
export function isCacheableRequest(request: Request): boolean {
  if (request.url.startsWith(OpenWeatherApi)) {
    return true;
  }

  return false;
}

const usingApiKey = (query: URLSearchParams, apiKey: string): URLSearchParams => {
  query.set('appid', apiKey);
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

export async function fetchCurrentWeather(
  location: WeatherLocation, apiKey: string, unit: 'F'|'C',
): Promise<ForecastInfo> {
  const query = usingUnits(usingJSON(usingApiKey(getApiQueryForLocation(location), apiKey)), unit);
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

export async function fetchFutureWeather(
  location: WeatherLocation, apiKey: string, unit: 'F'|'C',
): Promise<ForecastInfo> {
  const query = usingUnits(usingJSON(usingApiKey(getApiQueryForLocation(location), apiKey)), unit);
  const response = await fetch(`${OpenWeatherApi}/forecast?${query.toString()}`);

  const data: GetForecastResponse = await response.json();

  if (!data.list || data.list.length === 0) {
    throw new Error('No forecast data received');
  }

  // the forecast time period wanted for the forecast, currently 6 hours from now
  // TODO: this is too primitive, we'll want the 7pm temp for "tonight" and the 12pm temp for "tomorrow" - or averages?
  const targetedForecastTime = new Date();
  targetedForecastTime.setUTCHours(targetedForecastTime.getUTCHours() + 6);

  // sort the forecast list by the time (ascending) and select the first time
  // that is after or equal to our target time
  const forecast = data.list
    .sort((a, b) => a.dt - b.dt)
    .find(fc => (fc.dt * 1000) >= targetedForecastTime.valueOf());

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

export async function fetchForecasts(location: WeatherLocation, apiKey: string, unit: 'F'|'C'): Promise<{
  current: Forecast,
  future: Forecast,
  city?: CityDetails,
}> {
  const [ current, future ] = await Promise.all([
    fetchCurrentWeather(location, apiKey, unit), fetchFutureWeather(location, apiKey, unit),
  ]);

  return { current, future, city: current.city || future.city };
}
