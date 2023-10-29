import {BreakdownGroup} from '../types';

export function adjustCourseConsumptionDeviceBreakdownOrder(
    breakdownGroups: Array<BreakdownGroup>,
) {
    const objects = Array<BreakdownGroup>();
    const valueLength = breakdownGroups.length;
    let desktopObject = null;
    for (let i = 0; i < valueLength; i++) {
        if (breakdownGroups[i].type && breakdownGroups[i].type.toLowerCase() === 'desktop') {
            desktopObject = breakdownGroups[i];
        } else {
            objects.push(breakdownGroups[i]);
        }
    }
    if (desktopObject !== null) {
        // Make sure that 'Desktop' is always added the last
        // This assumes that we only had one 'desktop' type item
        // for proper operation.
        objects.push(desktopObject);
    }
    return objects;
}
