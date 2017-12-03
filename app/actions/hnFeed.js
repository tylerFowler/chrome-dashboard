import { RemoteResource } from 'redux-remote-resource';
import actionTypes from '../constants/feedConstants';

const FEED_NAME = 'HN';
const HN_BASE = 'https://hacker-news.firebaseio.com/v0/';

export function createHNAction(action) {
  if (typeof action === 'Object')
    return Object.assign({}, action, { feed: FEED_NAME });
  else if (typeof action === 'Function')
    return Object.assign({}, action(), { feed: FEED_NAME });
}

export function postsRequested() { createHNAction({ type: actionTypes.REQUEST_POSTS }); }
export function postsLoadError(error) { createHNAction({ type: actionTypes.REQUEST_POSTS_FAILURE, error }); }
export function signalPostsLoaded() { createHNAction({ type: actionTypes.POSTS_LOADED }); }

export function postLoadError(id, error) { createHNAction({ type: actionTypes.POST_REQUEST_FAILURE, id, error }); }
export function loadPost(post) { createHNAction({ type: actionTypes.LOAD_POST, id: post.id, data: post }); }

// TODO: possibly have a setting for using topstories vs newstories vs beststories
// TODO: we need to make 2 calls:
// 1. get the top 15 post ids
// 2. request story details for each one (15 http requests?!)
export function loadHNPosts(numPosts = 15) {
  return {
    [RemoteResource]: {
      uri: `${HN_BASE}/topstories.json`,
      lifecycle: {
        request: postsRequested(),
        failure: (error, dispatch) => dispatch(postLoadError(error)),
        success: (data, dispatch) => {
          if (!Array.isArray) data = [data];
          return Promise.all(
            data
              .slice(0, numPosts)
              .map(id => dispatch(loadHNPost(id)))
          )
            .then(() => dispatch(signalPostsLoaded))
            .catch(err => dispatch(postsLoadError(err)));
        }
      }
    }
  };
}

export function loadHNPost(postid) {
  return {
    [RemoteResource]: {
      uri: `${HN_BASE}/item/${postid}`,
      lifecycle: {
        failure: (error, dispatch) => dispatch(postLoadError(postid, error)),
        success: (data, dispatch) => dispatch(loadPost({
          id: data.id,
          author: data.by,
          title: data.tile,
          upvotes: data.score || 0,
          commentCount: data.descendants,
          postedAt: new Date(data.time) // TODO fix time fmt
        }))
      }
    }
  };
}
