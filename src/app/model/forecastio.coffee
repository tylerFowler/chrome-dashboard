$ = require 'jquery'

forecastioSettings = JSON.parse(localStorage.getItem('settings')).forecastio

class ForecastIO
  constructor: (@apiKey, @forecastRefresh, @tonightHour, @tomorrowHour) ->
    @forecastioUri = 'https://api.forecast.io/forecast'
    @curLocaiton = undefined
    @cityName = forecastioSettings.city_name

  ###
   # ForecastIO#setLocation
   # @desc : gets the current location and sets it to an instance variable
   # @calls : cb()
  ###
  setLocation: (cb) ->
    # we don't need to check for navigator.geolocation because we're in Chrome
    navigator.geolocation.getCurrentPosition (position) =>
      coords =
        latitude: position.coords.latitude
        longitude: position.coords.longitude

      @curLocation = coords
      cb() if cb

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
    if @curLocation
      @.requestForecast time, cb
    else
      @.setLocation => @.requestForecast time, cb

  ###
   # ForecastIO#requestForecast
   # @desc : gets the forecast for the specified time
   # @param : {time} - Date object, gets current if null
   # @calls : cb(err, { temp, "condition" })
  ###
  requestForecast: (time, cb) ->
    queryString = "#{@curLocation.latitude},#{@curLocation.longitude}"
    queryString += ",#{@.getValidTimeString time}" if time

    # Note: make sure the '?callback=?' is on the end or else we'll get
    # a cross origin request error (JSONP)
    $.getJSON "#{@forecastioUri}/#{@apiKey}/#{queryString}?callback=?", {}
    .done (forecastData) ->
      forecast =
        temp: forecastData.currently.apparentTemperature
        condition: forecastData.currently.icon

      cb null, forecast
    .fail (xhr, errMsg, err) ->
      cb err

module.exports = new ForecastIO(
  forecastioSettings.api_key,
  forecastioSettings.forecast_refresh,
  forecastioSettings.tonight_hour,
  forecastioSettings.tomorrow_hour
)
