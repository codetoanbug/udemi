import {AlertBanner} from '@udemy/react-messaging-components';
import {inject, observer} from 'mobx-react';
import React from 'react';

import '../price.less';

const FreePaidWarning = inject('priceStore')(
    observer(({priceStore}) => {
        if (!priceStore.showFreePaidWarning) {
            return null;
        }

        return (
            <AlertBanner
                udStyle="warning"
                styleName="alert-banner"
                data-purpose="free-paid-warning"
                onAction={priceStore.markFreePaidWarningSeen}
                ctaText={gettext('Dismiss')}
                dismissButtonProps={false}
                title={gettext(
                    'Before updating the price of your course, please be aware that switching the ' +
                        'price of your course between free and paid more than once will result in ' +
                        'restrictions to your promotional announcements.',
                )}
            />
        );
    }),
);

export default FreePaidWarning;
