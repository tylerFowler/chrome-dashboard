import { DNPost } from './reducer';

export const DNApi = 'https://api.designernews.co/api/v2';
export const DNSite = 'https://www.designernews.co';

export type PostId = string;
export type UserId = string;

const getDNLinkForPost = (postId: PostId) => `${DNSite}/stories/${postId}`;

// isCachableRequest is a function that can be used to determine if a request
// is for a DN API endpoint that is safe to be cached.
export const isCachableRequest = (request: Request): boolean => {
  if (!request.url.startsWith(DNApi)) {
    return false;
  }

  const path = request.url.substring(DNApi.length);

  if (/^\/stories\?.*$/.test(path)) {
    return true;
  }

  if (/^\/users\/[^\/]+$/.test(path)) {
    return true;
  }

  return false;
};

interface StoryResponse {
  readonly id: string;
  readonly title: string;
  readonly created_at: string; // or Date?
  readonly links: { user: UserId };
  readonly url: string;
  readonly vote_count: number;
  readonly comment_count: number;
}

interface FetchStoriesResponse {
  readonly stories: ReadonlyArray<StoryResponse>;
}

export async function fetchStoryPage(size: number = 10): Promise<DNPost[]> {
  const response = await fetch(`${DNApi}/stories?limit=${size}`);
  if (!response.ok) {
    throw new Error(await response.text());
  }

  const { stories } = await response.json() as FetchStoriesResponse;
  const userNameMap = await fetchUserDisplayNames(stories.map(s => s.links.user));

  return stories.map(s => ({
    id: s.id,
    title: s.title,
    time: new Date(s.created_at),
    author: userNameMap[s.links.user] || '',
    url: s.url,
    dnLink: getDNLinkForPost(s.id),
    voteCount: s.vote_count,
    commentCount: s.comment_count,
  }));
}

interface FetchUsersResponse {
  readonly users: ReadonlyArray<{
    readonly id: number;
    readonly display_name: string;
  }>;
}

async function fetchUserDisplayNames(userIds: ReadonlyArray<UserId>): Promise<{ [id: string]: string }> {
  const response = await fetch(`${DNApi}/users/${userIds.join(',')}`);
  if (!response.ok) {
    throw new Error(await response.text());
  }

  const { users } = await response.json() as FetchUsersResponse;
  return users.reduce((usersList, user) => ({
    ...usersList,
    [user.id]: user.display_name,
  }), {});
}
