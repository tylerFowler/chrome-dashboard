###
 # Public Settings
 # @desc : this a public version of the settings file showing it's structure,
 #         it is not intended to be used, and I can't post mine as it contains
 #         API keys and credentials! Rename this to settings.coffee and
 #         fill in your own information.
 # @author : Tyler Fowler <tylerfowler.1337@gmail.com>
###

settingsKeyName = 'settings'

# Helper function for development
window.resetSettings = ->
  localStorage.clear()
  location.reload()

# don't overwrite settings! These are just defaults
setSettings = ->
  unless localStorage.getItem settingsKeyName
    settings =
      ### Designer News Settings ###
      dn:
        refresh_interval_ms: 15 * 60 * 1000 # can't go over 300 reqs/hour!
        client_id: '<insert yours>'
        client_secret: '<insert yours>'
        redirect_uri: '<insert yours>'
      ### Hacker News Settings ###
      hn:
        refresh_interval_ms: 15 * 60 * 1000

    localStorage.setItem settingsKeyName, JSON.stringify settings

setSettings()
