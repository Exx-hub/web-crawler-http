const { JSDOM } = require("jsdom");

async function crawlPage(currentURL) {
  console.log(`actively crawling ${currentURL}`);

  try {
    const resp = await fetch(currentURL);

    if (resp.status > 399) {
      console.log(`error in fetch with status code: ${resp.status}, on page: ${currentURL}`);
      return;
    }

    const contentType = resp.headers.get("content-type");

    if (!contentType.includes("text/html")) {
      console.log(`non html response, content type:  ${contentType}, on page: ${currentURL}`);
      return;
    }

    console.log(await resp.text());
  } catch (err) {
    console.log(`error in fetch: ${err.message}, on page: ${currentURL}`);
  }
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
