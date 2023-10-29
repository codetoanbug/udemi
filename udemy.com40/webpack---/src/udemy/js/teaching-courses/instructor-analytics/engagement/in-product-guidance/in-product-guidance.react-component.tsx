import {Button} from '@udemy/react-core-components';
import {Badge} from '@udemy/react-messaging-components';
import React from 'react';

import './in-product-guidance.less';

interface InProductGuidanceProps {
    title: string;
    description: string;
    badgeText: string;
    badgeColorClass?: string;
    handleClick: () => void;
}
export const InProductGuidance = ({
    title,
    description,
    badgeText,
    badgeColorClass = 'green',
    handleClick,
}: InProductGuidanceProps) => {
    return (
        <div styleName="wrapper">
            <div>
                <Badge styleName={badgeColorClass}>{badgeText}</Badge>
            </div>
            <div styleName="content">
                <div className="ud-heading-md">{title}</div>
                <div className="ud-text-sm" styleName="description">
                    {description}
                </div>
                <Button udStyle="link" styleName="dismiss" size={'small'} onClick={handleClick}>
                    {gettext('Dismiss')}
                </Button>
            </div>
        </div>
    );
};
