chrome-dashboard
================

A (highly opinionated) new tab page extension for Chrome. Currently in development and should be considered very alpha.

![preview](https://user-images.githubusercontent.com/5419372/62814937-94e1b400-bad9-11e9-9e5a-a0baf541d314.png)

## Building & Local Usage
1. Install the dependencies
2. Copy the file at `buildConfig.tmpl.json` to `buildConfig.json` and fill in the missing values
  - Note that it's important that this filled out file is **not** committed to Github to protect any secret values or keys it contains, but also note that any built version will leak these values to users who know how to retrieve them and will not be obfuscated in any way
3. run `npm run build-dist`
4. In Chrome, go to [chrome://extensions/](chrome://extensions/) and click "Load unpacked"
  - Ensure that "Developer mode" is turned on in the top right of that page
5. Select the path: `/path/to/chrome-dashboard/public`
