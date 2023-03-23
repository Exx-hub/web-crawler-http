const { JSDOM } = require("jsdom");

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

module.exports = { normalizeURL, getURLsFromHTML };
