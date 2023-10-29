import {getUniqueId, findFocusables, ForcedTabOrder} from '@udemy/design-system-utils';
import {Tracker} from '@udemy/event-tracking';
import {withI18n, WithI18nProps} from '@udemy/i18n';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {BlockList, Button} from '@udemy/react-core-components';
import {
    Popover,
    RenderContentProps,
    defaultRenderContent,
    Popper,
} from '@udemy/react-popup-components';
import classNames from 'classnames';
import React, {Component} from 'react';

import {sendLabDiscoveryCardClickEvent} from 'browse/components/my-learning-unit/utils';
import {QuickViewBoxOpenEvent} from 'browse/events';
import {UI_REGION} from 'browse/ui-regions';
import {sendLabSelectedEvent} from 'labs/utils';

import styles from './lab-details-quick-view-box.less';
import {LabDetailsQuickViewBoxProps, LabCardTrackingProps} from './types';

interface TabOrder {
    findTriggerNode: () => HTMLElement | null | undefined;
    findFirstFocusableInContent: () => HTMLElement | null | undefined;
    findLastFocusableInContent: () => HTMLElement | null | undefined;
}

interface LabDetailsListProps {
    details: string[];
}

export const LabDetailsList = ({details}: LabDetailsListProps) => (
    <BlockList size="small" padding="tight">
        {details.map((detail: string, i: number) => (
            <BlockList.Item
                key={i}
                icon={<TickIcon label={false} color="neutral" />}
                data-purpose="quick-view-box-lab-details"
            >
                {detail}
            </BlockList.Item>
        ))}
    </BlockList>
);

class InternalLabDetailsQuickViewBox extends Component<
    LabDetailsQuickViewBoxProps & LabCardTrackingProps & WithI18nProps
> {
    static defaultProps = {
        showQuickViewBox: true,
        preventQuickViewBoxOpenEvent: false,
    };

    private popoverRef = React.createRef<Popper>();
    triggerButtonId = getUniqueId('trigger-button');

    onCloseButtonClick = () => {
        this.popoverRef.current?.ref.current?.onClose();
        document.getElementById(this.triggerButtonId)?.focus();
    };

    onTriggerButtonClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        this.popoverRef.current?.ref.current?.onFocusOpen(event.currentTarget);
        event.preventDefault();
    };

    getTabOrder = ({
        findTriggerNode,
        findFirstFocusableInContent,
        findLastFocusableInContent,
    }: TabOrder) => {
        const triggerButton = document.getElementById(this.triggerButtonId);
        const findTriggerButton = () => {
            // We only want to re-order the tab flow when entering the popover content from outside; if we shift-tab when
            // on the first element, we want to let the popover's tab order handle it, rather than
            // returning to the trigger button. So, only return the trigger button if we're
            // trying to tab off of the trigger button.
            return document.activeElement === triggerButton ? triggerButton : null;
        };

        const findNextFocusableOutsideTriggerNode = () => {
            const triggerNode = findTriggerNode();
            if (this.popoverRef.current?.ref.current?.isOpen && triggerNode) {
                const focusablesInTriggerNode = findFocusables(triggerNode);
                const lastFocusableInTriggerNode =
                    focusablesInTriggerNode[focusablesInTriggerNode.length - 1];
                const allFocusableElements = findFocusables(document.documentElement);
                const lastFocusableIndex = allFocusableElements.findIndex(
                    (e) => e === lastFocusableInTriggerNode,
                );
                if (lastFocusableIndex === -1) {
                    return null;
                }
                if (lastFocusableIndex === allFocusableElements.length - 1) {
                    return allFocusableElements[0];
                }
                return allFocusableElements[lastFocusableIndex + 1];
            }
        };
        return [
            [findTriggerNode, findFirstFocusableInContent],
            [findTriggerButton, findFirstFocusableInContent],
            [findLastFocusableInContent, findNextFocusableOutsideTriggerNode],
        ] as ForcedTabOrder[];
    };

    trackQuickViewBoxOpenEvent = () => {
        if (this.props.preventQuickViewBoxOpenEvent) {
            return;
        }

        Tracker.publishEvent(
            new QuickViewBoxOpenEvent({
                id: parseInt(this.props.lab.id, 10),
                trackingId: this.props.lab.metadata?.trackingId,
                type: 'lab',
            }),
        );
    };

    trackCTAClick = () => {
        sendLabDiscoveryCardClickEvent({
            courseId: this.props.sourceCourseId,
            labId: parseInt(this.props.lab.id, 10),
            trackingId: this.props.lab.metadata?.trackingId,
            uiRegion: UI_REGION.QUICK_PREVIEW,
            sourcePageId: this.props.sourcePageId,
            sourcePageType: this.props.sourcePageType,
        });
        sendLabSelectedEvent({
            lab: this.props.lab,
            uiRegion: UI_REGION.QUICK_PREVIEW,
            trackingId: this.props.lab.metadata?.trackingId,
            sourcePageId: this.props.sourcePageId,
            sourcePageType: this.props.sourcePageType,
        });
    };

    renderContent({className, ...props}: RenderContentProps) {
        return defaultRenderContent({
            className: classNames(className, styles['popover-wrapper']),
            ...props,
        });
    }

    getLabCard(triggerButtonId: string) {
        const {gettext} = this.props;
        const child = React.Children.only(this.props.labCard) as React.ReactElement;
        return React.cloneElement(child, {
            popoverTrigger: (
                <Button
                    className={classNames('ud-link-underline', styles['popover-interaction-btn'])}
                    typography="ud-heading-xs"
                    data-purpose="open-lab-details-popover"
                    udStyle="link-underline"
                    size="xsmall"
                    id={triggerButtonId}
                    onClick={this.onTriggerButtonClick}
                >
                    <span>{gettext('Show lab details')}</span>
                </Button>
            ),
        });
    }

    render() {
        const {gettext} = this.props;
        if (!this.props.showQuickViewBox) {
            return this.props.labCard;
        }

        const {activities, id, titleAutoslug, whatYouWillDo} = this.props.lab;
        /**
         * GraphQL endpoint for labs returns `activities` (array)
         * REST endpoint for labs returns `whatYouWillDo` (object with `items` prop)
         */
        const activitiesToDisplay = activities ?? whatYouWillDo?.items;
        const labDetailUrl = titleAutoslug ? `/labs/${titleAutoslug}/overview/` : `/labs/${id}/`;

        const popoverContent = (
            <div data-purpose="lab-details-content">
                {activitiesToDisplay?.length ? (
                    <>
                        <h2 className={classNames('ud-heading-lg', styles['content-header'])}>
                            {gettext('What you’ll do:')}
                        </h2>
                        <div className={classNames('ud-text-sm', styles.details)}>
                            <LabDetailsList details={activitiesToDisplay} />
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className={classNames('ud-heading-lg', styles['content-header'])}>
                            {gettext('See more details on the lab page')}
                        </h2>
                        <div
                            className={classNames('ud-text-sm', styles.details)}
                            data-purpose="learn-more"
                        >
                            {gettext('Click on the lab card to learn more.')}
                        </div>
                    </>
                )}
                <div className={styles.cta}>
                    <div className={styles['practice-this-lab']}>
                        <Button
                            componentClass="a"
                            className={styles['cta-button']}
                            data-purpose="go-to-lab-button"
                            udStyle={'brand'}
                            href={labDetailUrl}
                            onClick={this.trackCTAClick}
                        >
                            {gettext('Practice this lab')}
                        </Button>
                    </div>
                </div>
                <Button
                    className={classNames('ud-link-underline', styles['popover-interaction-btn'])}
                    data-purpose="close-lab-details-popover"
                    typography="ud-heading-xs"
                    udStyle="ghost"
                    size="xsmall"
                    onClick={this.onCloseButtonClick}
                >
                    <span>{gettext('Close dialog')}</span>
                </Button>
            </div>
        );
        const popoverTrigger = (
            <div data-purpose="lab-details-popover-trigger">
                {this.getLabCard(this.triggerButtonId)}
            </div>
        );
        return (
            <Popover
                placement={'top'}
                trigger={popoverTrigger}
                canToggleOnHover={true}
                canOnlyToggleOnHover={true}
                detachFromTarget={true}
                toggleStrategy="add-remove"
                onFirstOpen={this.trackQuickViewBoxOpenEvent}
                renderContent={this.renderContent}
                ref={this.popoverRef}
                getTabOrder={this.getTabOrder}
            >
                {popoverContent}
            </Popover>
        );
    }
}

export const LabDetailsQuickViewBox = withI18n(InternalLabDetailsQuickViewBox);
