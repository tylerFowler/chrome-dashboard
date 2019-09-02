export enum FeedType {
  TopStories = 'topstories',
  NewStories = 'newstories',
  BestStories = 'beststories',
  ShowStories = 'showstories',
}

export namespace FeedType {
  export function getDisplayString(feed: FeedType) {
    switch (feed) {
    case FeedType.TopStories:
      return 'top';
    case FeedType.NewStories:
      return 'new';
    case FeedType.BestStories:
      return 'best';
    case FeedType.ShowStories:
      return 'show';
    default:
      return feed as string;
    }
  }
}
