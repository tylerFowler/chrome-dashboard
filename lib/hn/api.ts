import { HNPost } from './reducer';
import { PageType } from './interface';

export const HNApi = 'https://hacker-news.firebaseio.com/v0';
export const HNSite = 'https://news.ycombinator.com';

export type PostId = number;

const getHNLinkForPost = (postId: PostId) => `${HNSite}/item?id=${postId}`;

// TODO this doesn't work as it seems to break auth redirection, may not be able
// to do this until the API officially supports it
export const getUpvoteLinkForPost = (postId: PostId) =>
  `${HNSite}/vote?id=${postId}&how=up&goto=item%3Fid%3D${postId}`;

export async function fetchStoryPage(type: PageType = PageType.NewStories, size: number = 10): Promise<PostId[]> {
  const response = await fetch(`${HNApi}/${type}.json`, { mode: 'cors' });
  if (!response.ok) {
    throw new Error(await response.text());
  }

  const ids = await response.json() as PostId[];
  return ids.slice(0, size);
}

interface FetchStoryResponse {
  readonly id: number;
  readonly deleted: boolean;
  readonly type: 'job'|'story'|'comment'|'poll'|'pollopt';
  readonly by: string;
  readonly time: number;
  readonly text: string;
  readonly dead: boolean;
  readonly parent?: PostId;
  readonly poll?: string;
  readonly kids: PostId[];
  readonly url: string;
  readonly score?: number;
  readonly title: string;
  readonly parts?: PostId[];
  readonly descendants?: number;
}

export async function fetchStory(id: PostId): Promise<Readonly<HNPost>> {
  const response = await fetch(`${HNApi}/item/${id}.json`);
  if (!response.ok) {
    throw new Error(await response.text());
  }

  const story = await response.json() as FetchStoryResponse;

  // TODO need to handle this and possibly attempt to load another story
  if (!story) {
    return null;
  }

  return {
    id: story.id,
    title: story.title,
    time: story.time,
    author: story.by,
    url: story.url,
    score: story.score,
    commentCount: story.descendants || 0,
    hnLink: getHNLinkForPost(story.id),
  } as HNPost;
}
