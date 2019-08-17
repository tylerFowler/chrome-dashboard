export enum FeedType {
  Top = 'top',
  Hot = 'hot',
  New = 'new',
  Rising = 'rising',
  Controversial = 'controversial',
}

// TODO: the subreddit feeds give colors per-post, those could be incorporated somehow
// "link_flair_text_color", "author_flair_background_color"
// TODO: consider showing downvotes as well
export interface RedditPost {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly upvotes: number;
  readonly createdAt: Date;
  readonly permalink: string;
  readonly commentCount: number;
}
