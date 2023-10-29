import {action, observable} from 'mobx';

import {AvailableFiltersUnit, DiscoveryUnit} from '@udemy/discovery-api';
import {generateTrackingId} from '@udemy/event-tracking';

export type SkillsHubLoadingUnit<T> = Pick<
    DiscoveryUnit<T>,
    'available_filters' | 'items' | 'type' | 'remaining_item_count' | 'tracking_id'
>;

export type SkillsHubAvailableFiltersSubUnit<T> = Omit<AvailableFiltersUnit<T>, 'source_object_id'>;

/**
 *
 * This MobX store manages the subunits meant to be rendered by the  SkillsHubUnit.
 *
 * It allows for a loading state where 'dummy' units are passed in, but no content is available to render yet.
 */
export class SkillsHubUnitStore<T> {
    @observable subUnits: SkillsHubAvailableFiltersSubUnit<T>[] = [];
    items: T[] = [];

    constructor(unit: SkillsHubLoadingUnit<T>) {
        this.items = unit.items;
        if (unit?.available_filters?.units) {
            this.setUnits(unit.available_filters.units);
        }
    }

    @action
    setUnits = (skills: SkillsHubAvailableFiltersSubUnit<T>[]) => {
        skills.forEach((skill, i) => {
            // Attach tracking id to all units
            const trackingId = generateTrackingId();

            if (i === 0) {
                const skillsHubAvailableFiltersUnit = {
                    ...skill,
                    items: this.items,
                    frontendTrackingId: trackingId,
                };
                this.subUnits.push(skillsHubAvailableFiltersUnit);
            } else {
                this.subUnits.push({...skill, items: [], frontendTrackingId: trackingId});
            }
        });
    };
}
