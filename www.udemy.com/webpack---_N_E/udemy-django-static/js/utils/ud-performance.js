import serverOrClient from "udemy-django-static/js/utils/server-or-client";
import { shimUDPerformance } from "@udemy/performance-rum-client";

/**
 * We need to call before exporting the performance object because shimUDPerformance assigns a new object to
 * window.UD.performance. If we don't call it before exporting, then the object we export will not be the same and the
 * places that import this file will not be able to access the performance object.
 */
shimUDPerformance();
export default serverOrClient.global.UD.performance;
