import {noticesBackend} from '@udemy/smart-bar';

import preloadedBrowseData from 'browse/lib/preloaded-data';
import RecentlyLoadedCoursesStore from 'browse/lib/recently-loaded-courses-store';
import udPerf from 'utils/ud-performance';
import Raven from 'utils/ud-raven';

import DiscoveryAPI from './backends/discovery-api';
import UnitProcessor from './unit-processor';

function captureAndThrowBrowseError(error) {
    Raven.captureException(error);
    throw new Error(`Previously handled exception: ${error.message}`);
}

/**
 * Provides various backend services needed by the Browse app.
 */
export default class BrowseService {
    /**
     * Constructs a new BrowseService. Accepts an optional configuration object that lets
     * you change the underlying backend APIs:
     *
     * @param {Object} backends - Optional configuration object that lets you change the underlying
     * backend APIs.
     * @param {Object} backends.discoveryApi - an object that implements the Discovery API.
     * Defaults to an instance of DiscoveryAPI
     * @param {Object} backends.noticesApi - an object that implements the Notices API.
     * Defaults to smart-bar/notices-backend
     * @param {Object} globalOverrides - UDData object to feed DiscoveryAPI params
     */
    constructor(backends = {}, globalOverrides = {}) {
        this._backends = {
            discoveryApi: new DiscoveryAPI({}, globalOverrides),
            noticesApi: noticesBackend,
            ...backends,
        };

        this.recentCoursesStore = new RecentlyLoadedCoursesStore();
    }

    /**
     * If the user is completing a wishlist action while logged out, returns a Promise that
     * resolves to the course the user just wishlisted. Otherwise, returns a Promise that resolves
     * to null.
     */
    loadWishlistedCourse() {
        const preloadedWishlistedCourse = preloadedBrowseData('wishlisted_course');
        if (preloadedWishlistedCourse) {
            return Promise.resolve(preloadedWishlistedCourse);
        }
        return Promise.resolve(null);
    }

    loadCourses(pageType, id, options = {}) {
        const {selectedFilters, selectedTopicIds, sortBy, ...passthroughOptions} = options;

        const topicFilter =
            selectedTopicIds && selectedTopicIds.length
                ? {courseLabel: selectedTopicIds.join('|')}
                : {};

        const filterOptions = {
            ...Object.keys(selectedFilters || {}).reduce(
                (prev, key) => ({...prev, [key]: selectedFilters[key].join('|')}),
                {},
            ),
            ...topicFilter,
            sort: sortBy,
        };

        return this._backends.discoveryApi
            .loadCourses(pageType, {pageObjectId: id, ...passthroughOptions, ...filterOptions})
            .then((res) => {
                return res;
            })
            .catch(captureAndThrowBrowseError);
    }

    /**
     * Loads units for a given page type.
     * @param {String} pageType Type of page the units are being loaded for.
     * @param {Object} options
     * @param {Number} options.from Loads units starting from the given unit index. Defaults to 0.
     * @param {Number} options.pageSize How many units to return. Defaults to 3.
     * @param {Number} options.itemCount How many courses to return with each unit. Defaults to 12.
     *
     * @returns {Promise} Resolves to an object with the shape:
     *   results: the list of units. May be empty if there are no units.
     *   has_more: Whether there are more units that can be requested. Additional units can be requested
     *             by incrementing "from" / "to" and calling loadUnits again.
     */
    loadUnits(pageType, options = {}) {
        udPerf.start('_discoveryApi');

        if (!options.from || options.from === 0) {
            this.recentCoursesStore.resetCourses();
        }

        options.excludedCourseIds = this.recentCoursesStore.recentCourseIds;

        return this._backends.discoveryApi
            .loadUnits(pageType, {...options})
            .then((response) => {
                udPerf.end('_discoveryApi');
                this.recentCoursesStore.addUnits(response.results);
                response = UnitProcessor.processResponse(options, response, pageType);

                return response;
            })
            .catch(captureAndThrowBrowseError);
    }

    /**
     * Loads items for a unit.
     * @param unit the unit, as returned by loadUnits, to load for.
     * @param {String} pageType. See loadUnits.
     * @param {Object} options
     * @param {Number} options.lastCourseId If present, loads courses starting immediately after
     *        the given course ID. Otherwise, loads courses starting from the beginning of the list.
     * @param {Number} options.p If present, page number (starting from 1) to load.
     *        Cannot be used with options.lastCourseId.
     * @param {Number} options.pageSize How many items to load per page.
     *
     * @returns {Promise} Resolves to an object with the shape:
     *   items: the list of items. May be empty if there are no items.
     *   remaining_item_count: How many items remain on the server to be fetched for this unit.
     *   pagination (only available if "p" param was passed): {
     *       total_item_count: Total number of items for this unit.
     *       total_page: Total number of pages for this unit.
     *       current_page: Page number for the items that were just returned.
     *   }
     */
    loadItemsForUnit(unit, pageType, options = {}) {
        return this._backends.discoveryApi
            .loadItemsForUnit(unit, pageType, options)
            .catch(captureAndThrowBrowseError);
    }
}
