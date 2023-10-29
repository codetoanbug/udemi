import {Step} from 'instructor/welcome-modal/types';

import udLink from '../../utils/ud-link';

export const ubOnlyInsightsWelcomeModalSteps: Step[] = [
    {
        title: gettext('Check out new Udemy Business insights!'),
        description: gettext(
            'Get a closer look into your Udemy Business performance with new views that focus specifically on your workplace learners.',
        ),
        imageSource: udLink.toStorageStaticAsset(
            'instructor/dashboard/overview-allcourses-ub-revenue-2.png',
        ),
    },
];
