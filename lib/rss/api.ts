import { RSSItem } from './interface';

export interface RSSFeedChannel {
  title: string;
  items: RSSItem[];
}

export async function refreshRSSFeed(url: string): Promise<RSSFeedChannel> {
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
      .forEach(chanItem => rssItems.push(parseRSSItem(chanItem)));
  } catch (itemParseError) {
    console.error(`An error occurred while parsing channel item from "${url}"`, itemParseError);
    throw parseError;
  }

  return { title, items: rssItems };
}

const parseRSSItem = (rssItemNode: Element): RSSItem => {
  if (!rssItemNode.querySelector('title')) {
    throw new Error('RSS feed items must contain title');
  }

  let publishDate = new Date(0);
  if (rssItemNode.querySelector('pubDate')) {
    publishDate = new Date(rssItemNode.querySelector('pubDate').textContent);
  }

  return {
    publishDate,
    title: rssItemNode.querySelector('title').textContent,
    link: rssItemNode.querySelector('link').textContent,
    author: rssItemNode.querySelector('author').textContent,
  };
};
