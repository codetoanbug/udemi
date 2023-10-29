import {LocalizedHtml} from '@udemy/i18n';
import {AlertBanner} from '@udemy/react-messaging-components';
import {inject} from 'mobx-react';
import React from 'react';

import '../price.less';

const PremiumInstructorWarning = inject('priceStore')(({priceStore}) => {
    if (priceStore.course.owner_is_premium_instructor) {
        return null;
    }
    let title, body;
    if (priceStore.course.is_owner) {
        title = (
            <LocalizedHtml
                className="ud-text-with-links"
                html={gettext(
                    'Please complete the premium instructor application ' +
                        '<a class="link">here</a> in order to set a price for your course.',
                )}
                interpolate={{
                    link: <a href="/instructor/user/edit-instructor-info/" />,
                }}
            />
        );
        body = gettext(
            'You can set your course price as soon as your linked payment method is approved.',
        );
    } else {
        title = gettext(
            'The course owner needs to complete our premium instructor ' +
                'application in order to update your course price.',
        );
    }
    return (
        <AlertBanner
            udStyle="warning"
            styleName="alert-banner"
            data-purpose="premium-instructor-warning"
            showCta={false}
            title={title}
            body={body}
        />
    );
});

export default PremiumInstructorWarning;
