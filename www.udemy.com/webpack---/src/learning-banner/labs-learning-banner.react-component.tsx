import {observer} from 'mobx-react';
import React, {useState, useEffect} from 'react';

import {useUDData} from '@udemy/ud-data';

import {LabInstanceApiResponse} from '../types/labs';
import {sendLabsResumeBannerViewEvent} from './events';
import {LabsLearningBannerStore} from './labs-learning-banner.mobx-store';
import {MultipleLabsLearningBanner} from './multiple-labs-learning-banner.react-component';
import {SingleLabsLearningBanner} from './single-labs-learning-banner.react-component';

export interface InternalLabsLearningBannerProps {
    store?: LabsLearningBannerStore; // for testing purposes
}

const InternalLabsLearningBanner = function (props: InternalLabsLearningBannerProps) {
    const {me} = useUDData();
    const [store] = useState(() => props.store || new LabsLearningBannerStore());

    useEffect(() => {
        async function initialize() {
            await store.refreshAndRetrieveRunningLabs();
            await store.checkDismissed();
            if (!store.isDismissed && store.firstRunningLab) {
                sendLabsResumeBannerViewEvent(store.firstRunningLab as LabInstanceApiResponse);
            }
        }
        if (me.is_authenticated) {
            initialize();
        }
    }, [me.is_authenticated, store]);

    if (!me.is_authenticated) {
        return null;
    }

    return store.shouldRenderMultipleLabsBanner ? (
        <MultipleLabsLearningBanner store={store} />
    ) : (
        <SingleLabsLearningBanner store={store} />
    );
};

InternalLabsLearningBanner.displayName = 'LabsLearningBanner';
export const LabsLearningBanner = observer(InternalLabsLearningBanner);
