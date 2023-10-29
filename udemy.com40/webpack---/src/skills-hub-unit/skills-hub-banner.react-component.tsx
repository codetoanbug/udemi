import classNames from 'classnames';
import React, {ReactNode} from 'react';

import {Button} from '@udemy/react-core-components';

import styles from './skills-hub-banner.module.less';

export interface SkillsHubBannerProps {
    /**
     * The ID of the topic to display. It will be used for eventing purposes
     *
     * @remarks
     * Note that, if you don't fire a click event, you don't need to pass this prop.
     */
    topicId?: number;
    /** The main title of the banner.*/
    topicTagline?: string | ReactNode;
    /** The secondary description to display.*/
    topicDescription?: string;
    /** Text to display on a CTA, if any.*/
    ctaText?: string;
    /** Place for the CTA to link, if any.*/
    ctaLink?: string;
    /** Callback to fire when the CTA is clicked, if any.*/
    onCtaClick?: (topicId?: number) => void;
}

/**
 *
 * The SkillsHubBanner component.
 *
 * @remarks
 *
 * This is currently used to render a banner above/around the SkillsHubUnit.
 */
export const SkillsHubBanner = ({
    topicId,
    topicTagline,
    topicDescription,
    ctaText,
    ctaLink,
    onCtaClick,
}: SkillsHubBannerProps) => {
    return (
        <div className={styles['banner-wrapper']}>
            <div className={styles.content}>
                <h2 className={classNames('ud-heading-xl', styles.tagline)}>{topicTagline}</h2>
                <p className={classNames('ud-text-md', styles.description)}>{topicDescription}</p>
            </div>
            <Button
                componentClass="a"
                href={ctaLink}
                size="medium"
                udStyle="secondary"
                onClick={() => onCtaClick?.(topicId)}
            >
                {ctaText}
            </Button>
        </div>
    );
};
