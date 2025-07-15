import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  // * matches all URLs, the ? makes it optional so it will match / as well
  // route('/about', './pages/about.tsx'),
  // Main page route
  // index("./pages/MainPage.tsx"),
  // Test page route
  route("/main", "./pages/MainPage.tsx"),
  route("/test", "./pages/Test.tsx"),
  route("/mcp", "./components/FigmaTest.tsx"),
  // Original app route
  // route("/app", "./pages/AppPage.tsx"),
  // Catch-all for other routes
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
