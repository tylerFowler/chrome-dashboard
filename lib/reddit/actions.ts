import { action, ActionType } from 'typesafe-actions';
import { RedditPost } from './reducer';

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

export const fetchSubreddit = (sub: string, pullSize: number) =>
  action(Actions.FetchSub, { sub, pullSize });

export const refreshSubreddit = (sub: string, posts: readonly RedditPost[]) =>
  action(Actions.ReceiveSub, { sub, posts });

export const fetchSubredditError = (sub: string, error: Error) =>
  action(Actions.SubFetchFailure, { sub, error });

// TODO: add autorefresh actions
