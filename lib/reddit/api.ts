import { RedditPost, FeedType } from './interface';

export const RedditAPI = 'https://reddit.com/';

export const isCacheableRequest = (request: Request): boolean =>
  request.url.startsWith(RedditAPI);

interface SubRedditFeedResponse {
  id: string;
  title: string;
  author: string;
  ups: number;
  url: string;
  num_comments: number;
  created: number;
}

export async function fetchSubreddit(subreddit: string, feedType: FeedType, pullSize: number): Promise<RedditPost[]> {
  throw new Error('not implemented');
}
