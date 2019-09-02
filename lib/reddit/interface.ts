export enum FeedType {
  Top = 'top',
  Hot = 'hot',
  New = 'new',
  Rising = 'rising',
  Controversial = 'controversial',
}

// TODO: consider showing downvotes as well
export interface RedditPost {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly upvotes: number;
  readonly createdAt: Date;
  readonly contentUrl: string;
  readonly permalink: string;
  readonly commentCount: number;
}
