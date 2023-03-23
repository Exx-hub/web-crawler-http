const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  // check if currentURL is still on baseURL cause you might be linked to a different website
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  // check if page has already been crawled
  const normalizedCurrentURL = normalizeURL(currentURL);

  // if page has already been crawled, increase count
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  // if crawling page first time, initialize count to 1
  pages[normalizedCurrentURL] = 1;

  console.log(`actively crawling ${currentURL}`);

  try {
    const resp = await fetch(currentURL);

    if (resp.status > 399) {
      console.log(`error in fetch with status code: ${resp.status}, on page: ${currentURL}`);
      return pages;
    }

    const contentType = resp.headers.get("content-type");

    if (!contentType.includes("text/html")) {
      console.log(`non html response, content type:  ${contentType}, on page: ${currentURL}`);
      return pages;
    }

    const htmlBody = await resp.text();

    const nextURLs = getURLsFromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (err) {
    console.log(`error in fetch: ${err.message}, on page: ${currentURL}`);
  }

  return pages;
}

function getURLsFromHTML(htmlBody, baseUrl) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const element of linkElements) {
    if (element.href.startsWith("/")) {
      urls.push(`${baseUrl}${element.href}`);
    } else if (element.href.startsWith("http")) {
      urls.push(element.href);
    }
  }

  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);

  let hostPath = `${urlObj.hostname}${urlObj.pathname}`;

  if (hostPath.endsWith("/")) {
    hostPath = hostPath.slice(0, -1);
  }

  return hostPath;
}

module.exports = { normalizeURL, getURLsFromHTML, crawlPage };
