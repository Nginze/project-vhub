import { init } from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

init({
  dsn: "https://d2965316baefb9968dbbcf69140391db@o4507591136313344.ingest.de.sentry.io/4507592088813648",
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  profilesSampleRate: 1.0,
});
