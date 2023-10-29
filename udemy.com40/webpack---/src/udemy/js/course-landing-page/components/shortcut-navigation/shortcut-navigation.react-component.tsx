import Observer from '@researchgate/react-intersection-observer';
import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {Button, ButtonProps} from '@udemy/react-core-components';
import {SmartBarSpacer} from '@udemy/smart-bar';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, MouseEvent} from 'react';

import {
    ShortcutNavigationImpressionEvent,
    ShortcutNavigationClickEvent,
} from 'course-landing-page/events';
import getRequestData from 'utils/get-request-data';

import styles from './shortcut-navigation.less';

interface ShortcutNavigationProps {
    courseTrackingId?: string;
    className?: string;
    // document prop to only be used in testing for providing document handle
    document?: HTMLElement;
}

@observer
export class ShortcutNavigation extends Component<ShortcutNavigationProps> {
    componentDidMount() {
        const clientSideDocument = this.props.document ?? document;
        const isMobile = getRequestData().isMobile;
        if (isMobile) {
            clientSideDocument
                .querySelectorAll('.in-page-offset-anchor')
                .forEach((node) => node.classList.add('is-mobile'));
        }
        const marks = clientSideDocument?.querySelectorAll('.in-page-offset-anchor');
        for (const mark of marks) {
            this.marks[mark.id] = mark as HTMLElement;
        }
    }

    @observable activeSection?: string;
    @observable floatingButtonsIsVisible = false;
    marks: Record<string, HTMLElement> = {};

    @autobind
    @action
    handleClick(ev: MouseEvent<HTMLElement>) {
        const {target} = ev.currentTarget.dataset;
        this.activeSection = target;
        if (target && this.marks[target]) {
            this.marks[target].scrollIntoView({behavior: 'smooth'});
            if (this.props.courseTrackingId) {
                Tracker.publishEvent(
                    new ShortcutNavigationClickEvent(this.props.courseTrackingId, target),
                );
            }
        }
    }

    @autobind
    @action
    handleIntersection(entry: IntersectionObserverEntry) {
        const {top} = entry.boundingClientRect;

        if (this.activeSection && top >= 0) {
            this.marks[this.activeSection].blur();
            this.activeSection = undefined;
        }

        // If our top is negative that means we have scrolled past our mark
        this.floatingButtonsIsVisible = top < 0;
    }

    @autobind
    trackShortcutNavigationImpression() {
        if (!this.props.courseTrackingId) {
            return;
        }

        Tracker.publishEvent(new ShortcutNavigationImpressionEvent(this.props.courseTrackingId));
    }

    render() {
        const isMobile = getRequestData().isMobile;

        const sharedButtonProps: ButtonProps = {
            size: isMobile ? 'medium' : 'large',
            typography: isMobile ? 'ud-heading-xs' : 'ud-heading-sm',
            udStyle: 'ghost',
            className: styles['shortcut-button'],
            onClick: this.handleClick,
        };

        // Targets are .in-page-offset-anchor placed in the DOM.
        return (
            <>
                <Observer onChange={this.handleIntersection}>
                    <span className={styles.mark} />
                </Observer>
                {/* Required duplication to maintain height of element so content doesnt jitter */}
                <TrackImpression trackFunc={this.trackShortcutNavigationImpression}>
                    <div className={styles['shortcut-navigation-buttons-wrapper']}>
                        <ShortcutNavigationContent
                            containerClassName={this.props.className}
                            activeSection={this.activeSection}
                            sharedButtonProps={sharedButtonProps}
                        />
                    </div>
                </TrackImpression>
                {this.floatingButtonsIsVisible && (
                    <div className={styles['floating-shortcut-navigation-buttons-container']}>
                        <SmartBarSpacer />
                        <div
                            className={
                                styles['floating-shortcut-navigation-buttons-content-container']
                            }
                        >
                            <ShortcutNavigationContent
                                containerClassName={this.props.className}
                                activeSection={this.activeSection}
                                sharedButtonProps={sharedButtonProps}
                            />
                        </div>
                    </div>
                )}
            </>
        );
    }
}

interface ShortcutNavigationContentProps {
    containerClassName?: string;
    activeSection?: string;
    sharedButtonProps: ButtonProps;
}

export const ShortcutNavigationContent = observer(
    ({containerClassName, activeSection, sharedButtonProps}: ShortcutNavigationContentProps) => {
        const isMobile = getRequestData().isMobile;
        const {className: buttonClassName, size, typography, udStyle, onClick} = sharedButtonProps;
        return (
            <div className={styles['shortcut-navigation-buttons-content-container']}>
                <div
                    className={classNames(
                        containerClassName,
                        styles['shortcut-navigation-buttons-content'],
                    )}
                >
                    <div
                        className={classNames(
                            styles['shortcut-navigation-buttons'],
                            isMobile ? styles['is-mobile'] : null,
                        )}
                    >
                        <Button
                            data-target="what-you-will-learn"
                            className={classNames(
                                buttonClassName,
                                activeSection === 'what-you-will-learn' ? styles.active : null,
                            )}
                            size={size}
                            typography={typography}
                            udStyle={udStyle}
                            onClick={onClick}
                        >
                            {gettext('Overview')}
                        </Button>
                        <Button
                            data-target="objective"
                            className={classNames(
                                buttonClassName,
                                activeSection === 'objective' ? styles.active : null,
                            )}
                            size={size}
                            typography={typography}
                            udStyle={udStyle}
                            onClick={onClick}
                        >
                            {gettext('Curriculum')}
                        </Button>
                        <Button
                            data-target="instructor"
                            className={classNames(
                                buttonClassName,
                                activeSection === 'instructor' ? styles.active : null,
                            )}
                            size={size}
                            typography={typography}
                            udStyle={udStyle}
                            onClick={onClick}
                        >
                            {gettext('Instructor')}
                        </Button>
                        <Button
                            data-target="reviews"
                            className={classNames(
                                buttonClassName,
                                activeSection === 'reviews' ? styles.active : null,
                            )}
                            size={size}
                            typography={typography}
                            udStyle={udStyle}
                            onClick={onClick}
                        >
                            {gettext('Reviews')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    },
);
