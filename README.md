# chrome-dashboard
A (highly opinionated) new tab page extension for Chrome. Built with ReactJS.

![chrome dashboard preview](https://dl.dropboxusercontent.com/u/20796913/chromedash_preview.gif)

### Description:
This is a project I started as something that I found I wanted to use on a daily basis. It is currently in development, but I use it on a daily basis and improve it as I go along. It began as a way to save myself some time as I found that throughout the day I would _always_ have 2 tabs open all day long - Designer News and Hacker News. I wanted a way to quicky consume the latest content from both these sources and began designing this project. As I went along I found I also wanted to replace my bookmarks bar, this turned into the bookmark cards in the center of the page and are intended to be replaced. At some point there will be a system in the interface to do so but for feel free to fork and customize however you see fit. Eventually will be available on the Chrome store but it is slowly worked on in my spare time (which is scarce these days), feel free to fork and provide your own API keys (found in `public_settings.coffee`).

### Features (* - in development)
- Designer News & Hacker News feeds
  - Are easily replaceable with other types of news feeds
- Weather card
  - Should be intelligent about knowing what type of weather the user might want, i.e. if it's 3pm I'll want to know what the temperature tonight will be, and later in the night I'll want to know what the weather will be tomorrow.
- A (customizable) collection of bookmark cards for quick access
- A developer panel (underneath the Hacker News feed currently):
  - Should have some bookmarks of it's own (again easily customized) for common dev tasks
  - A Github feed with a notifications stream*
  - The user's contributions graph*
  - A list of the user's most commonly accessed repositories*


# State Shape
```js
{
  hnFeed: {
    loadingPosts: <Boolean>,
    loadError: <Error>,
    itemCap: <Number>,
    siteUrl: <URL>,
    items: [
      {
        id: <Number>,
        author: <String>,
        title: <String>,
        upvotes: <Number>,
        commentCount: <Number>,
        postedAt: <Date>
      },
      ...
    ]
  },
  dnFeed: {},
  clock: {
    time: {
      hour: <Number>,
      minute: <Number>,
      modifier: <String>(AM/PM),
    },
    date: {
      month: <String>,
      day: <Number>,
      year: <Number>
    },
  },
  weather: {
    zip: <Number>,
    cityDisplayName: <String>,
    condition: <String>, // corresponds to 'sunny' or 'rainy' or 'cloudy'
    temp: <Number>,
    tempType: <Farenheit|Celsius>,
    upcomingWeather: {
      descriptor: <Tonight|Tomorrow>,
      condition: <String>,
      temp: <Number>
    }
  },
  links: {
    topLeft: {
      url: <String>,
      icon: <imgUrl>,
      color: <Hex>
    },
    bottomLeft: { ... },
    topRight: { ... },
    bottomRight: { ... }
  }
}
```
