###
 # Public Settings
 # @desc : this a public version of the settings file showing it's structure,
 #         it is not intended to be used, and I can't post mine as it contains
 #         API keys and credentials! Rename this to settings.coffee and
 #         fill in your own information.
 # @author : Tyler Fowler <tylerfowler.1337@gmail.com>
###

settingsKeyName = 'settings'

# don't overwrite settings! These are just defaults
unless localStorage.getItem settingsKeyName
  settings =
    ### Designer News Settings ###
    dn:
      refresh_interval_ms: 5000 # can't go over 300 reqs/hour!
      only_top_stories: true # just streams the latest if false
      client_id: '<insert yours>'
      client_secret: '<insert yours>'
      redirect_uri: '<insert yours>'

  localStorage.setItem settingsKeyName, JSON.stringify settings
