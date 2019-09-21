import { RedditPost, FeedType } from './interface';

export const RedditAPI = 'https://www.reddit.com';

// TODO: add version, bake in as part of build step (replacement)
const userAgent = 'chrome:dash';

export const isCacheableRequest = (request: Request): boolean =>
  request.url.startsWith(RedditAPI);

interface SubRedditRawFeed {
  id: string;
  title: string;
  author: string;
  ups: number;
  url: string;
  permalink: string;
  num_comments: number;
  created: number;
}

interface SubRedditFeedResponse {
  data: {
    children: Array<{ data: SubRedditRawFeed }>;
  };
}

export async function fetchSubreddit(
  subreddit: string, feedType: FeedType, pullSize: number = 15,
): Promise<RedditPost[]> {
  const response = await fetch(`${RedditAPI}/${subreddit}/${feedType}/.json?limit=${pullSize}`, {
    headers: { 'User-Agent': userAgent },
  });

  if (!response.ok) {
    switch (response.status) {
    case 404:
      throw new Error(`Subreddit ${subreddit} not found`);
    case 429:
      throw new Error('Too many refreshes, try again in a few moments');
    case 503:
      throw new Error('The Reddit servers are busy, try again later');
    default:
      throw new Error(await response.text());
    }
  }

  const feedResp: SubRedditFeedResponse = await response.json();

  return feedResp.data.children.map(({ data }) => ({
    id: data.id,
    title: data.title,
    author: data.author,
    upvotes: data.ups,
    createdAt: new Date(data.created),
    contentUrl: data.url,
    permalink: `${RedditAPI}${data.permalink}`,
    commentCount: data.num_comments,
  } as RedditPost));
}
