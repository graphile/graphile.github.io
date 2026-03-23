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
  if (path === "/graphile-build" || path.startsWith("/graphile-build/")) {
    const parts = path.split("/");
    if (!parts[2]) {
      window.location.replace(`https://build.graphile.org`);
    } else {
      if (parts[2] === "introduction") parts.length = 2;
      parts.splice(2, 0, "4");
      window.location.replace(`https://build.graphile.org${parts.join("/")}`);
    }
  }
}

exports.onRouteUpdate = ({ location, prevLocation }) => {
  checkRedirect(location.pathname);
};
