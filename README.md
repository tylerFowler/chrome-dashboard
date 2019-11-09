beat
================

> beat: a reporter's regular routine for covering news sources

Stay on top of your regular news beat with each tab. beat is a new tab replacement for Chrome that show your frequent news sources, plus a quick check of the weather.
![preview](https://user-images.githubusercontent.com/5419372/62814937-94e1b400-bad9-11e9-9e5a-a0baf541d314.png)

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
5. Select the path: `/path/to/beat/public`

## License
See [here](./LICENSE) for more information.