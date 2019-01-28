import action, { ActionType } from 'typesafe-actions';
import { DNPost } from './reducer';

export enum Actions {
  FetchPosts = 'DN_FETCH_POSTS',
  FetchPostsFailure = 'DN_FETCH_POSTS_FAILURE',
  ReceivePosts = 'DN_RECV_POSTS',
  StartAutoRefresh = 'DN_START_AUTOREFRESH',
  StopAutoRefresh = 'DN_STOP_AUTOREFRESH',
}

export type DNAction = ActionType<
  | typeof fetchPosts
  | typeof fetchPostsError
  | typeof receivePosts
>;

export const fetchPosts = () => action.action(Actions.FetchPosts);
export const fetchPostsError = (error: Error) =>
  action.action(Actions.FetchPostsFailure, { error });

export const receivePosts = (posts: ReadonlyArray<DNPost>) =>
  action.action(Actions.ReceivePosts, { posts });

export const startAutoRefresh = (intervalMs: number) =>
  action.action(Actions.StartAutoRefresh, { interval: intervalMs });

export const stopAutoRefresh = () => action.action(Actions.StopAutoRefresh);
