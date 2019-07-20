import { RSSItem } from './interface';

export interface RSSFeedChannel {
  title: string;
  items: RSSItem[];
}

export async function refreshRSSFeed(url: string, maxItems: number = 10): Promise<RSSFeedChannel> {
  const parseError = new Error('Malformed RSS feed');
  const xmlParser = new DOMParser();

  const response = await fetch(url);
  const feedData = xmlParser.parseFromString(await response.text(), 'application/xml');

  if (!feedData.querySelector('channel > title')) {
    throw parseError;
  }

  const title = feedData.querySelector('channel > title').textContent;

  const rssItems: RSSItem[] = [];
  try {
    feedData.querySelectorAll('channel > item')
      .forEach((chanItem, key) => rssItems.push(parseRSSItem(chanItem, key)));
  } catch (itemParseError) {
    console.error(`An error occurred while parsing channel item from "${url}"`, itemParseError);
    throw parseError;
  }

  rssItems.sort((a, b) => a.publishDate.valueOf() - b.publishDate.valueOf());

  return { title, items: rssItems.slice(0, maxItems) };
}

const parseRSSItem = (rssItemNode: Element, key: number): RSSItem => {
  if (!rssItemNode.querySelector('title')) {
    throw new Error('RSS feed items must contain title');
  }

  let publishDate = new Date(0);
  if (rssItemNode.querySelector('pubDate')) {
    publishDate = new Date(rssItemNode.querySelector('pubDate').textContent);
  }

  let guid: number | string = key;
  if (rssItemNode.querySelector('guid')) {
    guid = rssItemNode.querySelector('guid').textContent;
  }

  let author = '';
  if (rssItemNode.querySelector('author')) {
    author = rssItemNode.querySelector('author').textContent;
  }

  return {
    publishDate, author,
    guid: guid.toString(),
    title: rssItemNode.querySelector('title').textContent,
    link: rssItemNode.querySelector('link').textContent,
  };
};
