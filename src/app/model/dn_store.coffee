$ = require 'jquery'
_ = require 'underscore'

dnSettings = JSON.parse(localStorage.getItem('settings')).dn

class DesignerNews
  constructor: (@clientId, @clientSecret, @redirectUri, @refreshInterval) ->
    @dnUri = 'https://api-news.layervault.com/api/v1'

  ###
   # DesignerNews#getTopStories
   # @desc : retrieves the top stories from designer news
   # @param : limit - max number of stories to grab
   # @param : retryCount [Default: 0]
   # @calls : cb(err, [{ title, url, upvotes, author, comment_count }])
  ###
  getTopStories: (limit, cb, retryCount = 0) ->
    $.ajax(
      dataType: 'json'
      url: "#{@dnUri}/stories?client_id=#{@clientId}"
      timeout: 3000
      success: (data) =>
        @.processStories data.stories.slice(0, limit), (stories) ->
          return cb new Error 'Received zero stories' if stories.length is 0
          cb null, stories
      error: (xhr, msg, err) =>
        return cb err unless msg is 'timeout'

        if retryCount >= 3
          console.log "Retry count is #{retryCount} - return an error"
          cb new Error 'Could not reach DN.\nAre you offline?'
        else
          console.log "Retry count is #{retryCount} - try again"
          @.getTopStories limit, cb, retryCount + 1
    )

  ###
   # DesignerNews#getRecentStories
   # @desc : retrieves the latest stream of stories from designer news
   # @param : limit - max number of stories to grab
   # @param : retryCount [Default: 0]
   # @calls : cb(err, [{ title, url, dnurl, upvotes, author, commentCount }])
  ###
  getRecentStories: (limit, cb, retryCount = 0) ->
    $.ajax(
      dataType: 'json'
      url: "#{@dnUri}/stories/recent?client_id=#{@clientId}"
      timeout: 3000
      success: (data) =>
        @.processStories data.stories.slice(0, limit), (stories) ->
          return cb new Error 'Received zero stories' if stories.length is 0
          cb null, stories
      error: (xhr, msg, err) =>
        return cb err unless msg is 'timeout'

        if retryCount >= 3
          console.log "Retry count is #{retryCount} - return an error"
          cb new Error 'Could not reach DN.\nAre you offline?'
        else
          console.log "Retry count is #{retryCount} - try again"
          @.getRecentStories limit, cb, retryCount + 1
    )

  ###
   # DesignerNews#processStories
   # @desc : processes raw DN story data into a stripped down api
   # @param : [ { stories } ]
   # @param : limit
   # @calls : cb([{ title, url, dnurl, upvotes, author, commentCount }])
  ###
  processStories: (stories, cb) ->
    processedStories = []

    # strip away unnecessary information to give to the client
    _.each stories, (story, index) ->
      processed =
        title: story.title
        url: story.url
        dnurl: story.site_url
        upvotes: story.vote_count
        author: story.user_display_name
        commentCount: story.comments.length

      processedStories.push processed

      cb processedStories if index is stories.length - 1


module.exports = new DesignerNews(
  dnSettings.client_id,
  dnSettings.client_secret,
  dnSettings.redirect_uri,
  dnSettings.refresh_interval_ms
)
