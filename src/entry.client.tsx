/**
 * React Router uses a file named src/entry.client.tsx instead.
 * import App from './App.tsx'
 *  createRoot(document.getElementById('root')!).render(
 *    <StrictMode>
 *      <App />
 *     </StrictMode>,
 *   )
 */
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import "./index.css";

hydrateRoot(
  document,
  <StrictMode>
    <HydratedRouter />
  </StrictMode>
);
