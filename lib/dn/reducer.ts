// TODO consider adding badges (as tags) to feed items
export interface DNPost {
  readonly id: string;
  readonly title: string;
  readonly time: Date;
  readonly author: string;
  readonly url: string;
  readonly dnLink: string;
  readonly voteCount: number;
  readonly commentCount: number;
}
