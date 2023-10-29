import React, {BaseSyntheticEvent, ChangeEventHandler, useEffect, useRef, useState} from 'react';

import {Tracker} from '@udemy/event-tracking';
import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import {Radio} from '@udemy/react-form-components';
import {Popover} from '@udemy/react-popup-components';
import {ShowMore} from '@udemy/react-reveal-components';

import {
    FinancialIncentiveBadge,
    OpportunityTypeBadge,
} from '../opportunity-badges/opportunity-badge.react-component';
import {EmbeddedSupplyGapOpportunity} from '../types';
import {
    EventSupplyGapOpportunity,
    EventSupplyGapOpportunityFilters,
    SupplyGapOpportunityPresented,
} from './events';
import styles from './opportunity-card.module.less';

interface HeaderProps {
    id: string;
    isSelectable?: boolean;
    title: string;
    checked: boolean;
    onSelectChange: (event: BaseSyntheticEvent) => void;
    children: React.ReactNode;
}

const Header = ({id, isSelectable, title, checked, onSelectChange, children}: HeaderProps) => {
    const onChange: ChangeEventHandler<HTMLInputElement> = (event: BaseSyntheticEvent) => {
        onSelectChange(event);
    };
    return (
        <div className={styles['card-header']}>
            <div className={styles['card-radio']}>
                {isSelectable ? (
                    <Radio
                        data-testid={`opportunity-card-radio-${id}`}
                        size="small"
                        checked={checked}
                        value={id}
                        onChange={onChange}
                    />
                ) : null}
            </div>
            <div>
                <b className={styles['card-header-title']}>{title}</b>
                <div className={styles['card-header-badges']}>{children}</div>
            </div>
        </div>
    );
};

const Details = ({
    children,
    defaultExpanded = false,
    embeddedSupplyGapOpportunity,
}: {
    children: React.ReactNode;
    defaultExpanded: boolean;
    embeddedSupplyGapOpportunity: EmbeddedSupplyGapOpportunity;
}) => {
    const handleShowMoreToggle = (isExpanded: boolean) => {
        const opportunity: EventSupplyGapOpportunity = {
            id: 0, // This is not used anymore, but we still need to pass it
            courseLanguage: embeddedSupplyGapOpportunity.courseLanguage,
            domain: embeddedSupplyGapOpportunity.domain,
            subject: embeddedSupplyGapOpportunity.subject,
            uniqueOpportunityId: embeddedSupplyGapOpportunity.id,
        };
        const opportunityFilters: EventSupplyGapOpportunityFilters = {
            isFinancialIncentiveEligible: false, // This is not used anymore, but we still need to pass it
        };
        Tracker.publishEvent(
            new SupplyGapOpportunityPresented(
                'ub-content-opportunity-card',
                opportunity,
                opportunityFilters,
                isExpanded,
            ),
        );
    };
    return (
        <ShowMore
            collapsedHeight={10}
            moreButtonLabel={'Show details'}
            lessButtonLabel={'Hide details'}
            defaultExpanded={defaultExpanded}
            onToggle={handleShowMoreToggle}
        >
            <div className={styles['card-details']}>{children}</div>
        </ShowMore>
    );
};

const DetailItem = ({
    label,
    value,
    tooltip,
}: {
    label: string;
    value: string | undefined;
    tooltip: string;
}) => {
    return (
        <div className={styles['card-detail-unit']}>
            <div className={styles['card-detail-unit-bold']}>
                <strong>{label}</strong>{' '}
                <Popover
                    trigger={<InfoOutlineIcon />}
                    className={styles['tooltip-icon']}
                    canToggleOnHover={true}
                    placement="bottom"
                    withArrow={false}
                    detachFromTarget={true}
                >
                    {tooltip}
                </Popover>
            </div>
            <p className={styles['max-width-full']}>{value}</p>
        </div>
    );
};

interface FeaturesGridProps {
    className?: string;
    children: React.ReactNode;
}
const FeaturesGrid = ({className, children}: FeaturesGridProps) => {
    return <div className={className}>{children}</div>;
};

const FeatureGridItem = ({
    label,
    value,
    tooltip,
}: {
    label: string;
    value: string | undefined;
    tooltip: string | undefined;
}) => {
    return (
        <div className={styles['card-features-grid-item']}>
            <strong>{label}</strong>
            {tooltip && (
                <Popover
                    trigger={<InfoOutlineIcon />}
                    className={styles['tooltip-icon']}
                    canToggleOnHover={true}
                    placement="bottom"
                    withArrow={false}
                    detachFromTarget={true}
                >
                    {tooltip}
                </Popover>
            )}
            <p>{value}</p>
        </div>
    );
};

export interface OpportunityCardProps {
    /** True if checkbox will be visible */
    isSelectable?: boolean;
    /** The title of the card */
    data: EmbeddedSupplyGapOpportunity;
    isCardSelected: boolean;
    isIP: boolean;
    onSelectChange: (event: BaseSyntheticEvent) => void;
    defaultExpanded?: boolean;
}
export const OpportunityCard = (props: OpportunityCardProps) => {
    const isSelectable = props.isSelectable || false;
    const defaultExpanded = props.defaultExpanded || false;
    const {
        id,
        intendedAudience,
        keyContent,
        courseLanguage,
        domain,
        isFinancialIncentiveEligible,
        priorityLevel,
        courseInstructionalLevel,
        opportunityType,
        subject,
    } = props.data;
    const {isCardSelected, isIP, onSelectChange} = props;
    const featureGridItemsClassNames = `${styles['ip-features-grid']} ${styles['padding-top-middle']}`;

    const cardRef = useRef<HTMLDivElement | null>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [isMiddleWidth, setIsMiddleWidth] = useState(false);

    useEffect(() => {
        const updateContainerWidth = () => {
            if (cardRef.current) {
                const {width} = cardRef.current.getBoundingClientRect();
                if (width > 339 && width < 550) {
                    setContainerWidth(width);
                    setIsMiddleWidth(true);
                } else {
                    setIsMiddleWidth(false);
                }
            }
        };
        updateContainerWidth();
        window.addEventListener('resize', updateContainerWidth);

        return () => {
            window.removeEventListener('resize', updateContainerWidth);
        };
    }, []);

    useEffect(() => {
        if (containerWidth > 339 && containerWidth < 541) {
            setIsMiddleWidth(true);
        } else {
            setIsMiddleWidth(false);
        }
    }, [containerWidth]);

    const renderIPCardContent = (isMiddleWith: boolean) => {
        return (
            <>
                <FeaturesGrid className={featureGridItemsClassNames}>
                    <FeatureGridItem
                        label={'Course language: '}
                        value={courseLanguage}
                        tooltip={undefined}
                    />
                    <FeatureGridItem
                        label={'Financial Incentive: '}
                        value={isFinancialIncentiveEligible}
                        tooltip={
                            'Instructor Partners are eligible to apply for a financial incentive for courses on select subjects. The Udemy team will notify recipients pre-course creation and pay incentives upon publication. Watch for the next open application window to submit your application.'
                        }
                    />
                    <FeatureGridItem label={'Domain: '} value={domain} tooltip={undefined} />
                    {isMiddleWith && (
                        <FeatureGridItem
                            label={'Priority: '}
                            value={priorityLevel}
                            tooltip={undefined}
                        />
                    )}
                </FeaturesGrid>
                <Details
                    defaultExpanded={defaultExpanded}
                    embeddedSupplyGapOpportunity={props.data}
                >
                    <FeaturesGrid className={featureGridItemsClassNames}>
                        {!isMiddleWith && (
                            <FeatureGridItem
                                label={'Priority: '}
                                value={priorityLevel}
                                tooltip={undefined}
                            />
                        )}
                        <FeatureGridItem
                            label={'Course Level: '}
                            value={courseInstructionalLevel}
                            tooltip={undefined}
                        />
                    </FeaturesGrid>
                    <DetailItem
                        label={'Intended Learners: '}
                        value={intendedAudience}
                        tooltip={'Who will take this course? How will they use the skills taught?'}
                    />
                    <DetailItem
                        label={'Key content to include in course: '}
                        value={keyContent}
                        tooltip={
                            'What specific applications or related subjects should the course include to meet the demand among learners?'
                        }
                    />
                </Details>
            </>
        );
    };

    const renderNonIPCardContent = (isMiddleWith: boolean) => {
        return (
            <>
                <FeaturesGrid className={featureGridItemsClassNames}>
                    <FeatureGridItem
                        label={'Course language: '}
                        value={courseLanguage}
                        tooltip={undefined}
                    />
                    <FeatureGridItem
                        label={'Course Level: '}
                        value={courseInstructionalLevel}
                        tooltip={undefined}
                    />
                    <FeatureGridItem label={'Domain: '} value={domain} tooltip={undefined} />
                    {isMiddleWith && (
                        <FeatureGridItem
                            label={'Priority: '}
                            value={priorityLevel}
                            tooltip={undefined}
                        />
                    )}
                </FeaturesGrid>
                <Details
                    defaultExpanded={defaultExpanded}
                    embeddedSupplyGapOpportunity={props.data}
                >
                    <FeaturesGrid className={featureGridItemsClassNames}>
                        {!isMiddleWith && (
                            <FeatureGridItem
                                label={'Priority: '}
                                value={priorityLevel}
                                tooltip={undefined}
                            />
                        )}
                    </FeaturesGrid>
                    <DetailItem
                        label={'Intended Learners: '}
                        value={intendedAudience}
                        tooltip={'Who will take this course? How will they use the skills taught?'}
                    />
                    <DetailItem
                        label={'Key content to include in course: '}
                        value={keyContent}
                        tooltip={
                            'What specific applications or related subjects should the course include to meet the demand among learners?'
                        }
                    />
                </Details>
            </>
        );
    };

    return (
        <div ref={cardRef} data-testid="opportunity-card" className={styles['card']}>
            <Header
                id={id}
                isSelectable={isSelectable}
                title={subject}
                checked={isCardSelected}
                onSelectChange={onSelectChange}
            >
                <OpportunityTypeBadge opportunityType={opportunityType} />
                {isIP && isFinancialIncentiveEligible === 'Yes' && (
                    <FinancialIncentiveBadge data-testid="financial-incentive-badge" />
                )}
            </Header>
            {isIP ? renderIPCardContent(isMiddleWidth) : renderNonIPCardContent(isMiddleWidth)}
        </div>
    );
};
