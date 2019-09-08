import { action, ActionType } from 'typesafe-actions';
import { RedditPost, FeedType } from './interface';

export enum Actions {
  FetchSub = 'REDDIT_FETCH_SUB',
  ReceiveSub = 'REDDIT_RECV_SUB',
  SubFetchFailure = 'REDDIT_FETCH_SUB_FAILURE',
}

export type RedditAction = ActionType<
  | typeof fetchSubreddit
  | typeof refreshSubreddit
  | typeof fetchSubredditError
>;

export const fetchSubreddit = (sub: string, feedType: FeedType, pullSize: number) =>
  action(Actions.FetchSub, { pullSize }, { sub, feed: feedType });

export const refreshSubreddit = (sub: string, feedType: FeedType, posts: readonly RedditPost[]) =>
  action(Actions.ReceiveSub, { posts }, { sub, feed: feedType });

export const fetchSubredditError = (sub: string, feedType: FeedType, error: Error) =>
  action(Actions.SubFetchFailure, { error }, { sub, feed: feedType });
