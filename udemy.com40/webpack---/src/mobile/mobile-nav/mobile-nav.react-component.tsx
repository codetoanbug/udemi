import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import NextIcon from '@udemy/icons/dist/next.ud-icon';
import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import {Avatar, BlockList, BlockListItemProps} from '@udemy/react-core-components';
import {SideDrawer, SideDrawerProps, SubDrawer} from '@udemy/react-dialog-components';

import {useHeaderStore} from '../../hooks/use-header-store';
import {useMobileNavStore} from '../../hooks/use-mobile-nav-store';
import styles from './mobile-nav.module.less';

export interface MobileNavProps {
    children: React.ReactNode;
    onToggle: SideDrawerProps['onToggle'];
    subDrawers: SideDrawerProps['subDrawers'];
}

export const MobileNav = React.forwardRef<HTMLElement, MobileNavProps>((props, ref) => {
    const {gettext} = useI18n();
    return (
        <SideDrawer
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={ref as any}
            id="header-toggle-side-nav"
            mainDrawerId="header-toggle-side-nav-main"
            title={gettext('Site navigation')}
            side="left"
            className={styles.nav}
            {...props}
        />
    );
});

export interface MobileNavSectionHeadingProps {
    children: React.ReactNode;
}

export const MobileNavSectionHeading = ({children, ...props}: MobileNavSectionHeadingProps) => {
    return (
        <h2 className={`ud-heading-sm ${styles['nav-section-heading']}`} {...props}>
            {children}
        </h2>
    );
};

export interface MobileNavSectionProps {
    children: React.ReactNode;
    padding?: 'tight' | 'normal' | 'loose';
    className?: string;
}

export const MobileNavSection = (props: MobileNavSectionProps) => {
    return (
        <BlockList
            className={styles['nav-section']}
            size="large"
            iconAlignment="right"
            {...props}
        />
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MobileNavItemProps = BlockListItemProps<any>;

export const MobileNavItem = (props: MobileNavItemProps) => {
    const defaultProps: MobileNavItemProps = {color: 'neutral'};
    const {gettext} = useI18n();
    if ('cssToggleId' in props) {
        defaultProps.componentClass = 'button';
        defaultProps.icon = <NextIcon label={gettext('Expand')} />;
    }
    return <BlockList.Item {...defaultProps} className={styles['nav-item']} {...props} />;
};

export type MobileNavBackItemProps = BlockListItemProps<'button'>;

export const MobileNavBackItem = (props: MobileNavBackItemProps) => {
    const {gettext} = useI18n();
    return (
        <BlockList.Item
            componentClass="button"
            cssToggleId="header-toggle-side-nav-main"
            color="neutral"
            icon={<PreviousIcon label={gettext('Go back')} />}
            className={`${styles['nav-item']} ${styles.highlighted}`}
            {...props}
        />
    );
};

export interface MobileNavL1NavProps {
    id: string;
    children: React.ReactNode;
    title?: string;
}

export const MobileNavL1Nav = ({title, children, ...props}: MobileNavL1NavProps) => {
    const mobileNavStore = useMobileNavStore();
    const onSelect = () => mobileNavStore.ensureLevelIsLoaded(2);
    const {gettext} = useI18n();
    title = title ?? gettext('Menu');
    return (
        <SubDrawer level={1} className={styles.nav} onSelect={onSelect} {...props}>
            <BlockList size="large" padding="loose">
                <MobileNavBackItem>{title}</MobileNavBackItem>
            </BlockList>
            {children}
        </SubDrawer>
    );
};

export interface MobileNavL2NavProps {
    id: string;
    l1NavId: string;
    l1NavTitle: string;
    children: React.ReactNode;
}

export const MobileNavL2Nav = ({
    id,
    l1NavId,
    l1NavTitle,
    children,
    ...props
}: MobileNavL2NavProps) => {
    const {gettext} = useI18n();
    return (
        <SubDrawer id={id} level={2} className={styles.nav} {...props}>
            <BlockList size="large" padding="loose">
                <MobileNavBackItem>{gettext('Menu')}</MobileNavBackItem>
                <MobileNavBackItem
                    cssToggleId={l1NavId}
                    className={`${styles['nav-item']} ${styles.underlined}`}
                >
                    {l1NavTitle}
                </MobileNavBackItem>
            </BlockList>
            {children}
        </SubDrawer>
    );
};

export const MobileNavWelcomeSection = observer(({badge, ...props}) => {
    const {gettext, interpolate} = useI18n();
    const headerStore = useHeaderStore();
    const {user} = headerStore.userSpecificContext;
    if (!user || !user.id) {
        return null;
    }
    return (
        <MobileNavSection padding="loose" className={styles['welcome-section']}>
            <MobileNavItem {...props} className={`${styles['nav-item']} ${styles.highlighted}`}>
                <span className={styles['welcome-section-content']}>
                    <span style={{display: 'inline-flex', position: 'relative'}}>
                        <Avatar user={user} alt="NONE" />
                        {badge}
                    </span>
                    <span style={{flex: 1}}>
                        <span className={`ud-heading-md ${styles['profile-name']}`}>
                            {interpolate(gettext('Hi, %(name)s'), {name: user.display_name}, true)}
                        </span>
                        <span className={`ud-text-sm ${styles['profile-welcome']}`}>
                            {gettext('Welcome back')}
                        </span>
                    </span>
                </span>
            </MobileNavItem>
        </MobileNavSection>
    );
});
