$ = require 'jquery'
_ = require 'underscore'

hnSettings = JSON.parse(localstorage.getItem 'settings').hn

class HackerNews
  constructor: (@refresh_interval) ->
    @hnUri = 'https://hacker-news.firebaseio.com/v0/'

  ###
   # HackerNews#getTopStories
   # @desc : retrieves the top stories from Hacker News
   # @param : limit - max number of stories to grab
   # @calls : cb(err, )
  ###
  getTopStories: (limit, cb) ->
    $.getJSON "#{@hnUri}/topstories", {}
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
    $.getJSON "#{@hnUri}/newstories", {}
    .done (data) =>
      storyIds = data.slice 0, limit
      @.getStories storyIds, (err, stories) ->
        if err
          cb err
        else if stories.length is 0
          cb new Error 'Received zero stories'
        else
          cb null, stories
    .fail (xhr, errMsg, err) ->
      cb err

  ###
   # HackerNews#getStories
   # @desc : gets the story content for given story ids
   # @param : [ids]
   # @calls : cb(err, [{ title, url, score, author, commentCount }])
  ###
  getStories: (ids, cb) ->
    stories = []

    _.each ids, (id, index) ->
      $.getJSON "#{@hnUri}/item/#{id}", {}
      .done (story) ->
        processed =
          title: story.title
          url: story.url
          score: story.score
          author: story.by
          commentCount: story.kids.length

        stories.push processed

        cb stories if index is ids.length - 1
      .fail (xhr, errMsg, err) ->
        # TODO: this could get end up getting called more than once,
        # not sure what to do about it..
        cb err

module.exports = new HackerNews(
  hnSettings.refresh_interval_ms
)
