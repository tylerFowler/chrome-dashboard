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
   # @calls : cb(err, )
  ###
  getTopStories: (limit, cb) ->
    $.getJSON "#{@hnUri}/topstories.json", {}
    .done (data) =>
      storyIds = data.slice 0, limit
      @.getStories storyIds, (err, stories) ->
        if err
          return cb err
        else if stories.length is 0
          return cb new Error 'Received zero stories'
        else
          cb null, stories
    .fail (xhr, errMsg, err) ->
      cb err

  ###
   # HackerNews#getRecentStories
   # @desc : retrieves the latest stream of stories from hacker news
   # @param : limit - max number of stories to grab
   # @calls : cb(err, [{ title, url, score, author, commentCount }])
  ###
  getRecentStories: (limit, cb) ->
    $.getJSON "#{@hnUri}/newstories.json", {}
    .done (data) =>
      storyIds = data.slice 0, limit
      @.getStories storyIds, (err, stories) ->
        if err
          cb err
        else if stories.length is 0
          cb new Error 'Received zero stories'
        else
          cb null, stories
    .fail (xhr, errMsg, err) -> cb err

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
      $.getJSON "#{@hnUri}/item/#{id}.json", {}
      .done (story) =>
        console.log "Processing HN article #{id}; index is #{index}"
        processed =
          title: story.title
          url: story.url
          hnurl: @.getHNStoryUrl story.id
          score: story.score
          author: story.by
          commentCount: if story.kids then story.kids.length else 0

        stories.push processed

        cb null, stories if stories.length is ids.length
      .fail (xhr, errMsg, err) ->
        # TODO: this could get end up getting called more than once,
        # not sure what to do about it..
        cb err


  getHNStoryUrl: (storyId) ->
    "https://news.ycombinator.com/item?id=#{storyId}"

module.exports = new HackerNews(
  hnSettings.refresh_interval_ms
)
