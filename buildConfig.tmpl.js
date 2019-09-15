export default {
  // This project uses the OpenWeather API as its source of forecasts, an API key
  // can be obtained from https://openweathermap.org/api by signing up for an account.
  // It's likely that, if being used for personal use only, the free tier will be enough
  // as the extension caches forecast data for ~5 minutes before making another API request.
  openweatherAPIKey: "<OPENWEATHER_API_KEY>",

  // Determines the storage mechanism that can be used for settings persistence. By
  // default the value is "localStorage". The possible values are
  // - localStorage: the browser's local storage API will be used to store settings
  settingsStorage: "localStorage",
};
