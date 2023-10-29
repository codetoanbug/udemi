import * as FullstoryBrowser from '@fullstory/browser';

import {EventStatus, Tracker, TrackingEvent, addPublishHook} from '@udemy/event-tracking';
import {UDData} from '@udemy/ud-data';

import {
    CONSUMER_SUBS_SAMPLE_RATE,
    DEFAULT_SAMPLE_RATE,
    ORG_ID,
    UB_ADMIN_SAMPLE_RATE,
    UB_LEARNER_SAMPLE_RATE,
} from './constants';
import {FullstoryInitializedEvent, isEventAllowed} from './events';
import {shouldSampleVisitor, warn} from './lib';

// Export the fullstory browser library
export {FullstoryBrowser};

interface InitilizeOptions {
    /**
     * UDData object providing Config, request, visiting, etc. fields used to initialize Fullstory
     */
    udData: UDData;
    /**
     * Object providing a select set of user attributes
     */
    userData: {
        /**
         * @deprecated This is no longer relevant property
         */
        isUBAdmin?: boolean;
        /**
         * @deprecated This is no longer relevant property
         */
        isUBGroupAdmin?: boolean;
        isConsumerSubsSubscriber?: boolean;
        isProLicenseHolder?: boolean;
        isInstructorPartner?: boolean;
        ubRole?: string;
        isAuthenticated?: boolean;
        signupDate?: Date;
        /**
         * The encrypted ID of the logged-in user. If provided, it will be passed to
         * Fullstory.identify
         */
        encryptedId?: string;
    };
    /**
     * The percentage of visitor session to sample and send to Fullstory (0.0 - 1.0)
     * @default 0.0125
     */
    sampleRate?: number;
    /**
     * Called once Fullstory is initialized
     * @param fullstoryUrl The current Fullstory session URL
     */
    onInitialized?(fullstoryUrl: string): void;
}

class Fullstory {
    /**
     * Initializes a Fullstory session using the current visitor information
     */
    async initialize({
        udData,
        userData,
        sampleRate,
        onInitialized,
    }: InitilizeOptions): Promise<boolean> {
        const {Config: config, request, visiting, userAgnosticTrackingParams} = udData;
        const {
            isUBAdmin,
            isUBGroupAdmin,
            isConsumerSubsSubscriber,
            isProLicenseHolder,
            ubRole,
            isInstructorPartner,
            isAuthenticated,
            signupDate,
        } = userData;

        if (!config.brand.is_external_sources_enabled) {
            warn(
                'Skipping Fullstory initialization: config.brand.is_external_sources_enabled is false',
            );
            return false;
        }

        // If no specific sample rate was passed to this function, use one of our defaults
        if (sampleRate === undefined) {
            if (udData.Config.brand.has_organization) {
                if (isUBAdmin || isUBGroupAdmin) {
                    // One sample rate for UB admins
                    sampleRate = UB_ADMIN_SAMPLE_RATE;
                } else {
                    sampleRate = UB_LEARNER_SAMPLE_RATE;
                }
            } else if (isConsumerSubsSubscriber) {
                // Another for consumer subs subscribers
                sampleRate = CONSUMER_SUBS_SAMPLE_RATE;
            } else {
                // And then the default for both UB and MX learners
                sampleRate = DEFAULT_SAMPLE_RATE;
            }
        }

        if (!shouldSampleVisitor(visiting.visitor_uuid, sampleRate)) {
            warn(
                `Skipping Fullstory initialization: visitor_uuid ${visiting.visitor_uuid} not sampled`,
            );
            return false;
        }

        FullstoryBrowser.init({orgId: ORG_ID}, ({sessionUrl}) => {
            if (userData.encryptedId) {
                FullstoryBrowser.identify(userData.encryptedId);
            }

            // Raise exposure event
            Tracker.publishEvent(new FullstoryInitializedEvent({fullstoryUrl: sessionUrl}));
            onInitialized?.(sessionUrl);
        });

        addPublishHook(
            (event: TrackingEvent, status: EventStatus, failureReason: string | undefined) => {
                if (FullstoryBrowser.isInitialized() && isEventAllowed(event, status)) {
                    FullstoryBrowser.event(event.getType(), {
                        status_str: status.toString(),
                        failureReason_str: failureReason ?? '',
                    });
                }
            },
        );

        const pageVars = {
            appName_str: config.app_name,
            language_str: request.language,
            pageKey_str: userAgnosticTrackingParams.page_key || 'no-page-key',
            priceCountry_str: config.price_country.id,
        };

        FullstoryBrowser.setVars('page', pageVars);

        const userVars = {
            isBot_bool: request.is_bot,
            isConsumerSubsSubscriber_bool: isConsumerSubsSubscriber,
            isUBAdmin_bool: isUBAdmin, // deprecated
            isUBGroupAdmin_bool: isUBGroupAdmin, // deprecated
            ubRole_str: ubRole,
            isProLicenseHolder_bool: isProLicenseHolder,
            isInstructorPartner_bool: isInstructorPartner,
            isAuthenticated_bool: isAuthenticated,
            isFirstTimeVisitor_bool: visiting.is_first_time_visitor,
            isMobile_bool: request.isMobile,
            isPC_bool: request.isPC,
            language_str: request.language,
            signupDate_date: signupDate,
        };

        FullstoryBrowser.setUserVars(userVars);

        return true;
    }
}

export const fullstory = new Fullstory();
