import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  // * matches all URLs, the ? makes it optional so it will match / as well
  // route('/about', './pages/about.tsx'),
  // Test page route
  route("/test", "./pages/Test.tsx"),
  route("/login", "./pages/Login.tsx"),
  route("/auth/callback", "./pages/AuthCallback.tsx"),
  // Original app route
  // route("/app", "./pages/AppPage.tsx"),
  // Catch-all for other routes
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
