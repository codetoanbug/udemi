import React from 'react';

import {useI18n} from '@udemy/i18n';

import styles from './no-content.module.less';
import {NoOpportunitySvg} from './no-opportunity.react-component';
import {OpportunityErrorSvg} from './opportunity-error-svg.react-component';

export interface NoContentProps {
    dataTestId?: string;
    svgImage: React.ReactNode;
    title: string;
    description: string | string[];
}

export const NoContent = ({dataTestId, svgImage, title, description}: NoContentProps) => {
    return (
        <div data-testid={dataTestId} className={styles['container']}>
            {svgImage}
            <div className={styles['title']}>
                <b>{title}</b>
            </div>
            <div className={styles['description']}>
                {typeof description === 'string' ? (
                    <p>{description}</p>
                ) : (
                    description.map((item, index) => <p key={index}>{item}</p>)
                )}
            </div>
        </div>
    );
};

export const NoOpportunity = () => {
    const {gettext} = useI18n();
    return (
        <NoContent
            dataTestId="no-opportunity"
            svgImage={<NoOpportunitySvg />}
            title={gettext('No opportunities to show')}
            description={gettext(
                'Try changing your filters or come back later to check out new opportunities',
            )}
        />
    );
};

export const OpportunityError = () => {
    const {gettext} = useI18n();
    return (
        <NoContent
            dataTestId="opportunity-error"
            svgImage={<OpportunityErrorSvg />}
            title={gettext('Looks like there is a problem!')}
            description={[
                gettext('We cannot show the list due to a problem. Come back'),
                gettext('later to check out new opportunities.'),
            ]}
        />
    );
};
