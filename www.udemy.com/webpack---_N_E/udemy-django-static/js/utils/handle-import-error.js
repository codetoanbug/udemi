import feedbackQueue from "udemy-django-static/js/ui-feedback/feedback-queue";
import { captureException } from "@sentry/nextjs";

export default function handleImportError(e) {
  feedbackQueue.pushFeedback({
    udStyle: "error",
    title: gettext(
      "There was a problem fetching content from our server. " +
        "Please reload this page to fix this problem."
    ),
    body: gettext("This error may be the result of a bad network connection."),
    ctaText: gettext("Reload page"),
    onAction: () => window.location.reload(),
  });

  captureException(e);

  // This is a signal to ignore the re-thrown exception.
  e.message = `Previously handled exception: ${e.message}`;

  // Re-throw the exception to interrupt the request flow.
  throw e;
}
