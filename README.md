beat
================

> beat: a reporter's regular routine for covering news sources

beat is a new tab replacement for Chrome that shows the latest stories your frequent news sources at a glance, plus a quick check of the weather.
![preview](./site_assets/preview.png)

## News Sources

-  [Hacker News](https://news.ycombinator.com/) 
   - View the top stories on Hacker News, with the ability to choose between different story streams like the Top stories, or turn on the flood with all New stories.
- [Designer News](https://www.designernews.co/)
- [Subreddits](https://www.reddit.com/)
  - Keep track of any subreddit, with the ability to create a custom theme and choose from different streams like Top or Controversial.

**Not seeing a news source you'd like?**

Create a Github [issue](https://github.com/tylerFowler/beat/issues/new) and let me know!

## Building & Local Usage
1. Install the dependencies
2. Copy the file at `buildConfig.tmpl.json` to `buildConfig.json` and fill in the missing values
    - Note that it's important that this filled out file is **not** committed to Github to protect any secret values or keys it contains, but also note that any built version will leak these values to users who know how to retrieve them and will not be obfuscated in any way
3. run `npm run build-dist`
4. In Chrome, go to [chrome://extensions/](chrome://extensions/) and click "Load unpacked"
    - Ensure that "Developer mode" is turned on in the top right of that page
1. Select the path: `/path/to/beat/public`

### Build Configuration
- `openweatherAPIKey`: An API key for the [OpenWeather](https://openweathermap.org/) service, simply sign up for a developer account there and provide your API key here
  - Because of the fairly aggressive caching strategy used by the extension, it's likely that you can use the free tier and be ok
- `settingsStorage`: The storage method for application data (settings, onboarding progress, etc...), possible values are:
  - `localStorage`: Use the browser's local storage API for storage, used mostly for local development
  - `chromeStorage`: Use Chrome's extension storage API, which will allow other Chrome installations to use synced settings, for personal use this is typically what you want

## License
See [here](./LICENSE) for more information.
