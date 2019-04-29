import { action, ActionType } from 'typesafe-actions';
import { HNPost } from './reducer';
import { FeedType } from './interface';

export enum Actions {
  FetchPosts = 'HN_FETCH_POSTS',
  FetchPostsFailure = 'HN_FETCH_POSTS_FAILURE',
  ReceivePosts = 'HN_RECV_POSTS',
  StartAutoRefresh = 'HN_START_AUTOREFRESH',
  StopAutoRefresh = 'HN_STOP_AUTOREFRESH',
}

export type HNAction = ActionType<
  | typeof fetchPosts
  | typeof fetchPostsError
  | typeof receivePosts
>;

export const fetchPosts = (feed: FeedType, pullSize: number) =>
  action(Actions.FetchPosts, { feed, pullSize });

export const fetchPostsError = (feed: FeedType, error: Error) =>
  action(Actions.FetchPostsFailure, { feed, error });

export const receivePosts = (feed: FeedType, posts: ReadonlyArray<HNPost>) =>
  action(Actions.ReceivePosts, { feed, posts: posts.filter(p => !!p) });

export const startAutoRefresh = (refreshId: string, intervalMinutes: number, feed: FeedType, pullSize: number) =>
  action(Actions.StartAutoRefresh, {
    refreshId, feed, pullSize,
    interval: intervalMinutes * 60 * 1000,
  });

export const stopAutoRefresh = (refreshId: string) =>
  action(Actions.StopAutoRefresh, { refreshId });
