const initialState = {
  loadingPosts: false,
  loadError: null,
  itemCap: 15,
  siteUrl: 'https://news.ycombinator.com',
  items: [ // Test itms
    {
      id: 1,
      author: 'you',
      title: 'Some big article',
      upvotes: 200,
      commentCount: 15,
      postedAt: new Date()
    }
  ]
};

export default function newsFeed(state = initialState, action) {
  const { type } = action;

  switch (type) {
  default:
    return state;
  }
}
