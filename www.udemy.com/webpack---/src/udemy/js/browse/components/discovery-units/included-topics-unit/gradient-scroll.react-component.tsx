import React, {useState} from 'react';

import styles from './gradient-scroll.less';

export interface GradientScrollProps {
    children: JSX.Element;
    threshold?: number;
    enabled?: boolean;
}

export const GradientScroll = ({children, threshold = 10, enabled = true}: GradientScrollProps) => {
    const [scrollAnchor, setScrollAnchor] = useState<'left' | 'right' | undefined>('left');

    const handleScroll = (e: Event) => {
        const {scrollLeft, scrollWidth, offsetWidth} = e.target as HTMLDivElement;

        if (scrollLeft <= threshold) {
            setScrollAnchor('left');
        } else if (scrollLeft >= scrollWidth - offsetWidth - threshold) {
            setScrollAnchor('right');
        } else if (scrollAnchor) {
            setScrollAnchor(undefined);
        }
    };

    const root = React.cloneElement(children, {onScroll: handleScroll});

    let gradients;

    if (enabled) {
        gradients = (
            <>
                {scrollAnchor !== 'right' && (
                    <div className={styles['gradient-right']} data-purpose="gradient-right" />
                )}
                {scrollAnchor !== 'left' && (
                    <div className={styles['gradient-left']} data-purpose="gradient-left" />
                )}
            </>
        );
    }

    return (
        <div className={styles['gradient-container']}>
            {root}
            {gradients}
        </div>
    );
};
