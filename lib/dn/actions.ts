import { action, ActionType } from 'typesafe-actions';
import { DNPost } from './reducer';

export enum Actions {
  FetchPosts = 'DN_FETCH_POSTS',
  FetchPostsFailure = 'DN_FETCH_POSTS_FAILURE',
  ReceivePosts = 'DN_RECV_POSTS',
}

export type DNAction = ActionType<
  | typeof fetchPosts
  | typeof fetchPostsError
  | typeof receivePosts
>;

export const fetchPosts = (pullSize: number) =>
  action(Actions.FetchPosts, { pullSize });

export const fetchPostsError = (error: Error) =>
  action(Actions.FetchPostsFailure, { error });

export const receivePosts = (posts: ReadonlyArray<DNPost>) =>
  action(Actions.ReceivePosts, { posts });
