import {LocalizedHtml} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import style from './empty-assertion-style.less';

interface EmptyAssertionStateProps {
    onClick: () => void;
}

export const EmptyAssertionState: React.FC<EmptyAssertionStateProps> = (prop) => {
    return (
        <div
            className={classNames('ud-text-md', style['assertion-empty-state-text'])}
            data-purpose="assertion-empty-state"
        >
            <LocalizedHtml
                html={interpolate(
                    gettext(
                        'Currently, there are no badges uploaded to your profile. ' +
                            'Begin your journey towards your certification goals or ' +
                            '<a class="link">upload your third-party</a> badges to your profile and impress your ' +
                            'manager and peers with your accomplishments. Start preparing for your next certificate today!',
                    ),
                    {},
                    true,
                )}
                interpolate={{
                    link: (
                        <Button
                            udStyle="link"
                            className="import-new-assertion-link"
                            typography="ud-text-md"
                            onClick={() => prop.onClick?.()}
                            data-purpose="empty-state-upload-badge-button"
                        />
                    ),
                }}
            />
        </div>
    );
};
