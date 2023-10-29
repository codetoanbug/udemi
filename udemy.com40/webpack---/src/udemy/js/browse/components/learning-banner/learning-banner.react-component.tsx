import {Button, Image} from '@udemy/react-core-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import styles from './learning-banner.less';

interface LearningBannerProps {
    cta: string;
    text: string;
    title: string;
    compact?: boolean;
    imgSet?: string;
    imgSrc?: string;
    link?: string;
    onBannerClick?: () => void;
}

@observer
export class LearningBanner extends Component<LearningBannerProps> {
    static defaultProps = {
        compact: false,
    };

    render() {
        const {compact, cta, imgSet, imgSrc, link, onBannerClick, text, title} = this.props;
        const headerClass = compact ? 'ud-heading-lg' : 'ud-heading-xl';

        return (
            <div className={classNames(styles.content, compact ? styles.compact : '')}>
                <div className={styles['content-cta-wrapper']}>
                    <div className={styles.copy}>
                        <h2
                            className={classNames(headerClass, styles.title)}
                            data-purpose="banner-title"
                        >
                            {title}
                        </h2>
                        <div className={styles.description}>{text}</div>
                    </div>
                    <Button componentClass="a" href={link} onClick={onBannerClick}>
                        {cta}
                    </Button>
                </div>
                {imgSrc && (
                    <div className={styles['image-container']}>
                        <Image alt="" src={imgSrc} srcSet={imgSet} />
                    </div>
                )}
            </div>
        );
    }
}
