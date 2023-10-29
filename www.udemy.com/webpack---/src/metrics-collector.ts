import {createPerformanceObservers} from './create-performance-observers';
import {getDeviceInformation} from './get-device-information';
import {getNavigationTiming} from './get-navigation-timing';
import {TimeOnPage} from './time-on-page';

interface CollectedPerformanceData {
    marks: Array<Partial<PerformanceMark>>;
    measures: Array<Partial<PerformanceMeasure>>;
    resources: Record<string, {count: number; duration: number; transferSize: number}>;
    isFirstTimeVisitor?: boolean | null;
    isPageCached?: boolean | null;
    timeOnSite?: number;
    timeOnSiteAbsolute?: number;
    osName?: string | null;
    deviceType?: string | null;
}

interface MetricsCollectorArgs {
    forcePerformanceObserverInitialization?: boolean;
    isFirstTimeVisitor?: boolean | null;
    isPageCached?: boolean | null;
    osName?: string | null;
    deviceType?: string | null;
}

/**
 * Class that tracks summary performance metrics
 */
// eslint-disable-next-line import/prefer-default-export
export class MetricsCollector {
    finalizeMetrics = null;
    isDisconnected = false;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    disconnectObservers = () => {};
    collectedPerformanceData: CollectedPerformanceData;
    timeOnPage: TimeOnPage;
    observationTimeout: ReturnType<typeof setTimeout> | null = null;
    constructor({
        forcePerformanceObserverInitialization = false,
        isPageCached = null,
        isFirstTimeVisitor = null,
        osName = null,
        deviceType = null,
    }: MetricsCollectorArgs = {}) {
        // Create private log audit trail
        window.udPerformance = (window.udPerformance as Window['udPerformance']) || {};
        window.udPerformance._logs = [];

        // Create "core" navigationTiming data
        this.collectedPerformanceData = {
            marks: [],
            measures: [],
            resources: {},
        };

        // Gather various information about user
        this.collectedPerformanceData.isFirstTimeVisitor = isFirstTimeVisitor;
        this.collectedPerformanceData.osName = osName;
        this.collectedPerformanceData.deviceType = deviceType;
        this.collectedPerformanceData.isPageCached = isPageCached;

        // Gather various information about user device
        getDeviceInformation((metric: string, data: unknown) => {
            Object.assign(this.collectedPerformanceData, {[metric]: data});
        });

        // Tracking User Time Spent on Page
        this.timeOnPage = new TimeOnPage();
        this.timeOnPage.initialize();

        // Is the document currently visible?
        const isDocumentVisible = document.visibilityState === 'visible';

        // If document is hidden, don't collect performance observer data because it can be unreliable
        // Additionally, if page visibility ever changes, immediately halt performance observers to avoid
        // weird outlier data
        if (isDocumentVisible || (forcePerformanceObserverInitialization as boolean) === true) {
            // Initialize performance observers
            this.disconnectObservers = this.initializeObservers();

            // We are only going to limit collection to 30 seconds max to keep data comparative
            this.observationTimeout = setTimeout(this.safeDisconnectObservers, 30000);

            window.document.addEventListener('visibilitychange', this.safeDisconnectObservers);
        }
    }

    /**
     * Creates "private" log entry for production audit (data is OK to be public)
     * @param {string} msg
     */
    logEvent = (msg: string) => {
        /* istanbul ignore next */
        window.udPerformance?._logs?.push(msg);
    };

    /**
     * Safely disconnect observers and ensure executed only once
     */
    safeDisconnectObservers = () => {
        this.disconnectObservers();
        window.clearTimeout(this.observationTimeout as ReturnType<typeof setTimeout>);
        window.document.removeEventListener('visibilitychange', this.safeDisconnectObservers);
        this.isDisconnected = true;
    };

    /**
     * Initializes variety of performance observers to collect metrics
     *
     * @returns None
     */
    initializeObservers() {
        // Collect metrics from a variety of performance observers
        return createPerformanceObservers(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (entryType: string, {name, startTime, duration}: any) => {
                if (entryType === 'mark') {
                    this.collectedPerformanceData.marks.push({name, startTime});
                    this.logEvent(`${entryType}:${name}:${startTime}`);
                }
                if (entryType === 'measure') {
                    this.collectedPerformanceData.measures.push({name, startTime, duration});
                    this.logEvent(`${entryType}:${name}:${startTime}:${duration}`);
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (type: string | number, {count, duration, transferSize}: any) => {
                Object.assign(this.collectedPerformanceData.resources, {
                    [type]: {count, duration, transferSize},
                });
                this.logEvent(`${type}:${count}:${duration}:${transferSize}`);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (type: string | number, data: any) => {
                Object.assign(this.collectedPerformanceData, {[type]: data});
                this.logEvent(`${type}:${data}`);
            },
        );
    }

    /**
     * Returns metrics summary object ready to send to analytics service.  See `.docs/METRICS.md` for full details of
     * returned summary object.
     *
     * @returns {object} - Performance summary object
     */
    getSummary() {
        if (this.observationTimeout) {
            clearTimeout(this.observationTimeout);
            this.observationTimeout = null;
        }

        this.safeDisconnectObservers(); // Finalizes performance observer metrics
        this.timeOnPage.stopTracking(); // Finalizes time on page metrics

        // Create performance summary object
        const collectedPerformanceData = {
            ...this.collectedPerformanceData,
            ...getNavigationTiming(),
            timeOnSite: this.timeOnPage.getActiveTimeOnPage(),
            timeOnSiteAbsolute: this.timeOnPage.getTotalTimeOnPage(),
        };

        // Convert map of resources to array for serialization
        const serializedPerformanceResources = Object.keys(collectedPerformanceData.resources).map(
            (k) => {
                return {
                    name: k,
                    ...collectedPerformanceData.resources[k],
                };
            },
        );
        // We are changing the type of resources here so we need to do unknown conversion
        collectedPerformanceData.resources =
            serializedPerformanceResources as unknown as CollectedPerformanceData['resources'];

        return collectedPerformanceData;
    }
}
