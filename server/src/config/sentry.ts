import * as Sentry from "@sentry/node";
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "https://4adcf8c1f1bcdabf93dc0876f0c938f1@o4507591136313344.ingest.de.sentry.io/4507592041234512",
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
