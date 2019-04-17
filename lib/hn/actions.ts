import { action, ActionType } from 'typesafe-actions';
import { HNPost } from './reducer';

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

export const fetchPosts = () => action(Actions.FetchPosts);
export const fetchPostsError = (error: Error) =>
  action(Actions.FetchPostsFailure, { error });

export const receivePosts = (posts: ReadonlyArray<HNPost>) =>
  action(Actions.ReceivePosts, { posts: posts.filter(p => !!p) });

export const startAutoRefresh = (intervalMs: number) =>
  action(Actions.StartAutoRefresh, { interval: intervalMs });

export const stopAutoRefresh = () => action(Actions.StopAutoRefresh);
