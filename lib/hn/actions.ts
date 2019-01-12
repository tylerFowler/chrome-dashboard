import action, { ActionType } from 'typesafe-actions';
import { HNPost } from './reducer';

export enum Actions {
  FetchPosts = 'HN_FETCH_POSTS',
  FetchPostsFailure = 'HN_FETCH_POSTS_FAILURE',
  ReceivePosts = 'HN_RECV_POSTS',
}

export type HNAction = ActionType<
  | typeof postsFetched
  | typeof fetchPostsError
  | typeof receivePosts
>;

export const postsFetched = () => action.action(Actions.FetchPosts);
export const fetchPostsError = (error: Error) =>
  action.action(Actions.FetchPostsFailure, { error });

export const receivePosts = (posts: ReadonlyArray<HNPost>) =>
  action.action(Actions.ReceivePosts, { posts });