import { GlobalState } from '../store';

type State = Pick<GlobalState, 'hnFeed'>;

export const getStoryPage = (limit: number, { hnFeed }: State) =>
  Object.entries(hnFeed.posts)
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

export const isLoadingStories = ({ hnFeed }: State) => hnFeed.fetching;
