import {Tracker, ClientEvent} from '@udemy/event-tracking';

// import {TrackingContext} from '@udemy/event-tracking/src/tracker/tracker';
import {MetricsCollector} from './metrics-collector';

export interface PerformanceMark {
    name: string;
    startTime: number;
}

export interface PerformanceMeasure {
    name: string;
    startTime: number;
    duration: number;
}

export interface PerformanceEventPage {
    entryKey?: string;
    entryTrackingId?: string;
}

export interface TimingResource {
    name: string;
    count: number;
    duration: number;
    transferSize: number;
}

export interface PerformanceSummary {
    cls?: number;
    clsFinal?: number;
    decodedBodySize?: number;
    deviceMemory?: number;
    deviceType?: string;
    dnsLookupTime?: number;
    domCompleteDuration?: number;
    domInteractive?: number;
    downlink?: number;
    ect?: string;
    encodedBodySize?: number;
    fcp?: number;
    fetchTime?: number;
    fid?: number;
    fidStart?: number;
    fp?: number;
    hardwareConcurrency?: number;
    headerSize?: number;
    isCacheHit?: boolean;
    isPageCached?: boolean;
    isLowEndDevice?: boolean;
    isLowEndExperience?: boolean;
    isFirstTimeVisitor?: boolean;
    lcp?: number;
    lcpFinal?: number;
    loadEventStart?: number;
    marks?: PerformanceMark[];
    measures?: PerformanceMeasure[];
    navigationType?: string;
    osName?: string;
    page?: PerformanceEventPage;
    redirectCount?: number;
    redirectDuration?: number;
    resources?: TimingResource[];
    rtt?: number;
    saveData?: boolean;
    serviceWorkerStatus?: string;
    storageQuota?: number;
    storageUsage?: number;
    tbt?: number;
    tbt5S?: number;
    tbt10S?: number;
    tbtFinal?: number;
    requestDuration?: number;
    responseDuration?: number;
    tcpConnectTime?: number;
    tcpSecureConnectTime?: number;
    timeOnSite?: number;
    timeOnSiteAbsolute?: number;
    transferSize?: number;
    ttfb?: number;
    workerTime?: number;
}

/**
 * Define the Performance Summary event
 */
export class PerformanceSummaryEvent extends ClientEvent implements PerformanceSummary {
    // clientHeader?: ClientHeader;
    lcp?: number; // TODO: figure out how to implement TS interface for all class properties.
    page?: PerformanceEventPage;
    source?: string;
    constructor({performanceSummary}: {performanceSummary: PerformanceSummary}) {
        super('PerformanceSummaryEvent');
        Object.assign(this, performanceSummary);

        const firstPageKey = Tracker.firstPageKey || '';
        this.page = {
            entryKey: firstPageKey,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processContext(context: any) {
        super.processContext(context);

        // Save `source` of event
        this.source = context.sourceServiceName;

        // Prefer `firstPageKey` first to support SPA applications
        const firstPageKey = Tracker.firstPageKey;
        if (this.clientHeader && firstPageKey) {
            this.clientHeader.page.key = firstPageKey;
        }
    }
}

/**
 * When page unloads, sends web analytics to backend service.
 *
 * @param {object} collector - metrics collector that contains performance data to send to beacon server
 * @returns None
 */
export const registerWithTracker = (collector: MetricsCollector) => {
    Tracker.addCloseListener(() => {
        const performanceSummary = collector.getSummary() as unknown as PerformanceSummary;
        Tracker.publishEvent(new PerformanceSummaryEvent({performanceSummary}));
    }, true);
};
