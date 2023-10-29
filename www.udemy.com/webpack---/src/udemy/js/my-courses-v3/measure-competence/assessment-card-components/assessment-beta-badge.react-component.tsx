import {useI18n} from '@udemy/i18n';
import {Badge} from '@udemy/react-messaging-components';
import {Tooltip} from '@udemy/react-popup-components';
import React from 'react';

import styles from './assessment-beta-badge.less';

export const AssessmentBetaBadge = () => {
    const {gettext} = useI18n();
    return (
        <>
            <Tooltip
                canToggleOnHover={true}
                placement="bottom-start"
                udStyle="white"
                detachFromTarget={true}
                trigger={
                    <button className={styles['beta-badge']}>
                        <Badge>{gettext('Beta')}</Badge>
                    </button>
                }
            >
                {gettext(
                    'This assessment is new. Your data will help us to continue making improvements.',
                )}
            </Tooltip>
            {/* Adding span for screen reader virtual pc cursor users to hear the tooltip message.
                The prop detachFromTarget={true} appends the tooltip message to the end of the document in order for
                the tooltip element to break out of `overflow: hidden` containers. This is a quick fix to keep the
                tooltip message below the trigger element. */}
            <span className="ud-sr-only">
                {gettext(
                    'This assessment is new. Your data will help us to continue making improvements.',
                )}
            </span>
        </>
    );
};
