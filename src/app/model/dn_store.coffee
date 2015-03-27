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
   # @calls : cb(err, [{ title, url, upvotes, author, comment_count }])
  ###
  getTopStories: (limit, cb) ->
    $.getJSON "#{@dnUri}/stories?client_id=#{@clientId}", {}
    .done (data) =>
      @.processStories data.stories.slice(0, limit), limit, (processedStories) ->
        cb null, processedStories
    .fail (xhr, errMsg, err) ->
      cb err

  ###
   # DesignerNews#getRecentStories
   # @desc : retrieves the latest stream of stories from designer news
   # @param : limit - max number of stories to grab
   # @calls : cb(err, [{ title, url, upvotes, author, comment_count }])
  ###
  getRecentStories: (limit, cb) ->
    $.getJSON "#{@dnUri}/stories/recent?client_id=#{@clientId}", {}
    .done (data) =>
      @.processStories data.stories.slice(0, limit), limit, (processedStories) ->
        cb null, processedStories
    .fail (xhr, errMsg, err) ->
      cb err

  ###
   # DesignerNews#processStories
   # @desc : processes raw DN story data into a stripped down api
   # @param : [ { stories } ]
   # @param : limit
   # @calls : cb([{ title, url, upvotes, author, comment_count }])
  ###
  processStories: (stories, limit, cb) ->
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

      cb processedStories if index is limit - 1


module.exports = new DesignerNews(
  dnSettings.client_id,
  dnSettings.client_secret,
  dnSettings.redirect_uri,
  dnSettings.refresh_interval_ms
)
