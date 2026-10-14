import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import Landing from "./pages/Landing";

// Rendered at build time into dist/index.html so search engines and link
// previews get the homepage content without running JavaScript.
export function render() {
  return renderToString(
    <StaticRouter location="/">
      <Landing />
    </StaticRouter>,
  );
}
