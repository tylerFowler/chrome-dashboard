$ = require 'jquery'

forecastioSettings = JSON.parse(localStorage.getItem('settings')).forecastio

class ForecastIO
  constructor: (@apiKey, @refresh, @location, @tonightHour, @tomorrowHour) ->
    @forecastioUri = 'https://api.forecast.io/forecast'
    @cityName = forecastioSettings.city_name

  getValidTimeString: (time) ->
    # match the '.' of the ms and everything after that character
    time.toISOString().replace(/\.(.*)$/, '')

  ###
   # ForecastIO#getForecast
   # @desc : ensures that location is set, then calls requestForecast
   # @param : {time} - Date object, gets current if null
   # @calls : cb(err, { temp, "condition" })
  ###
  getForecast: (time, cb) ->
    queryString = "#{@location.latitude},#{@location.longitude}"
    queryString += ",#{@.getValidTimeString time}" if time

    # Note: we ned to make sure we specify cross domain and add the access
    # control header, otherwise Google will complain about a CORS problem
    $.ajax(
      url: "#{@forecastioUri}/#{@apiKey}/#{queryString}"
      type: 'GET'
      crossDomain: true
      headers: { 'Access-Control-Allow-Origin', '*' }
      dataType: 'json'
      success: (forecastData) ->
        cb null,
          temp: forecastData.currently.apparentTemperature
          condition: forecastData.currently.icon
      error: (xhr, errMsg, err) -> cb err
    )

module.exports = new ForecastIO(
  forecastioSettings.api_key,
  forecastioSettings.forecast_refresh,

  { latitude: forecastioSettings.latitude,
  longitude: forecastioSettings.longitude },

  forecastioSettings.tonight_hour,
  forecastioSettings.tomorrow_hour
)
