import { GlobalState } from '../store';

type State = Pick<GlobalState, 'dnFeed'>;

export const getStoryPage = (limit: number, { dnFeed }: State) =>
  Object.entries(dnFeed.posts)
    .slice(0, limit)
    .map(([, post]) => post)
    .sort((p1, p2) => {
      if (p1.time < p2.time) {
        return -1;
      }

      if (p1.time > p2.time) {
        return 1;
      }

      return 0;
    });

export const isLoadingStories = ({ dnFeed }: State) => dnFeed.fetching;
