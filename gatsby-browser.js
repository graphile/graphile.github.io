function checkRedirect(inPath) {
  const path = inPath.replace(/\/+$/, "");
  if (path === "/postgraphile" || path.startsWith("/postgraphile/")) {
    const parts = path.split("/");
    if (!parts[2]) {
      window.location.replace(`https://postgraphile.org`);
    } else {
      if (parts[2] === "introduction") parts.length = 2;
      parts.splice(2, 0, "4");
      window.location.replace(`https://postgraphile.org${parts.join("/")}`);
    }
  }
}

exports.onRouteUpdate = ({ location, prevLocation }) => {
  checkRedirect(location.pathname);
};
