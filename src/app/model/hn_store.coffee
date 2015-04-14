$ = require 'jquery'
_ = require 'underscore'

hnSettings = JSON.parse(localStorage.getItem 'settings').hn

class HackerNews
  constructor: (@refreshInterval) ->
    @hnUri = 'https://hacker-news.firebaseio.com/v0'

  ###
   # HackerNews#getTopStories
   # @desc : retrieves the top stories from Hacker News
   # @param : limit - max number of stories to grab
   # @param : retryCount [Default: 0]
   # @calls : cb(err, )
  ###
  getTopStories: (limit, cb, retryCount = 0) ->
    $.ajax(
      dataType: 'json'
      url: "#{@hnUri}/topstories.json"
      timeout: 3000
      success: (data) =>
        storyIds = data.slice 0, limit
        @.getStories storyIds, (err, stories) ->
          if err
            return cb err
          else if stories.length is 0
            return cb new Error 'Received zero stories'
          else
            cb null, stories
      error: (xhr, msg, err) =>
        errMsg = 'Could not reach HN.\nAre you offline?'
        return cb new Error errMsg unless msg is 'timeout'

        if retryCount >= 3
          console.log "Retry count is #{retryCount} - return an error"
          cb new Error errMsg
        else
          console.log "Retry count is #{retryCount} - try again"
          @.getTopStories limit, cb, retryCount + 1
    )

  ###
   # HackerNews#getRecentStories
   # @desc : retrieves the latest stream of stories from hacker news
   # @param : limit - max number of stories to grab
   # @param : retryCount [Default: 0]
   # @calls : cb(err, [{ title, url, score, author, commentCount }])
  ###
  getRecentStories: (limit, cb, retryCount = 0) ->
    $.ajax(
      dataType: 'json'
      url: "#{@hnUri}/newstories.json"
      timeout: 3000
      success: (data) =>
        storyIds = data.slice 0, limit
        @.getStories storyIds, (err, stories) ->
          if err
            return cb err
          else if stories.length is 0
            return cb new Error 'Received zero stories'
          else
            cb null, stories
      error: (xhr, msg, err) =>
        errMsg = 'Could not reach HN.\nAre you offline?'
        return cb new Error errMsg unless msg is 'timeout'

        if retryCount >= 3
          console.log "Retry count is #{retryCount} - return an error"
          cb new Error errMsg
        else
          console.log "Retry count is #{retryCount} - try again"
          @.getRecentStories limit, cb, retryCount + 1
    )

  ###
   # HackerNews#getStories
   # @desc : gets the story content for given story ids
   # @param : [ids]
   # @calls : cb(err, [{ title, url, score, author, commentCount }])
  ###
  getStories: (ids, cb) ->
    stories = []
    ajaxErr = null

    _.each ids, (id, index) =>
      $.ajax(
        dataType: 'json'
        url: "#{@hnUri}/item/#{id}.json"
        success: (story) =>
          hnurl = @.getHNStoryUrl story.id

          processed =
            title: story.title
            url: if story.url then story.url else hnurl
            hnurl: hnurl
            score: story.score
            author: story.by
            commentCount: if story.kids then story.kids.length else 0

          stories.push processed

          cb null, stories if stories.length is ids.length
        error: (xhr, msg, err) -> cb err
      )



  getHNStoryUrl: (storyId) ->
    "https://news.ycombinator.com/item?id=#{storyId}"

module.exports = new HackerNews(
  hnSettings.refresh_interval_ms
)
