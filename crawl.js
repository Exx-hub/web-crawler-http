function normalizeURL(urlString) {
  const urlObj = new URL(urlString);

  console.log(urlObj);

  let hostPath = `${urlObj.hostname}${urlObj.pathname}`;

  if (hostPath.endsWith("/")) {
    hostPath = hostPath.slice(0, -1);
  }

  return hostPath;
}

console.log(normalizeURL("https://BLOG.BoOt.dev/path"));

module.exports = { normalizeURL };
