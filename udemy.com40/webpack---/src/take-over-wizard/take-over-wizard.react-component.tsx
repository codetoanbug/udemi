import {useI18n, I18nApi} from '@udemy/i18n';
import classNames from 'classnames';
import React from 'react';

import {MinimalHeader, MinimalHeaderProps} from '../minimal-header/minimal-header.react-component';
import styles from './take-over-wizard.module.less';

/** React prop interface for `TakeOverWizard` */
export interface TakeOverWizardProps {
    /** Props for the header of the `TakeOverWizard` */
    headerProps?: TakeOverWizardHeaderProps;
    /** Props for the footer of the `TakeOverWizard` */
    footerProps?: TakeOverWizardFooterProps;
    /** Child content of the `TakeOverWizard` */
    children?: React.ReactNode;
    /**
     * Flag to determine if the `TakeOverWizard` should take over entire screen height.
     *
     * @defaultValue true in `TakeOverWizard`
     *
     * @remarks
     * Set to false if loading TakeOverWizard in a Modal.
     */
    fullScreenHeight?: boolean;
}

/**
 * Props for the header of the `TakeOverWizard`
 *
 * @remarks
 * The `MinimalHeader` component is used for the header, this extends its interface
 */
export interface TakeOverWizardHeaderProps extends MinimalHeaderProps {
    /** Content to render in the center of the header, ex: "Step 1 of 2" */
    centerChildren?: React.ReactNode;
    /** Content to render on the right side of the header, ex: "Exit" */
    rightChildren?: React.ReactNode;
}

/** Props for the footer of `TakeOverWizard` */
export interface TakeOverWizardFooterProps {
    /** Content to render on the left side of the footer, ex: "Previous" button */
    leftChildren?: React.ReactNode;
    /** Content to render on the right side of the footer, ex: "Continue" button */
    rightChildren?: React.ReactNode;
    /**
     * Flag to determine if the footer is "sticky" to its container
     *
     * @defaultValue
     * `true` in `TakeOverWizard`
     */
    sticky?: boolean;
}

/**
 * ### TakeOverWizard
 *
 * @remarks
 * A component that renders a header, footer, and child content, with a meter progress indicator.
 * This component is mostly meant for use within a full page Modal.
 */
export const TakeOverWizard = ({fullScreenHeight = true, ...props}: TakeOverWizardProps) => {
    const renderHeader = ({centerChildren, rightChildren, ...props}: TakeOverWizardHeaderProps) => {
        return (
            <div className={styles.header}>
                <MinimalHeader {...props}>
                    {centerChildren && (
                        <div className={classNames('ud-text-lg', styles['header-center-content'])}>
                            <div className={styles['header-text']}>{centerChildren}</div>
                        </div>
                    )}
                    {rightChildren}
                </MinimalHeader>
            </div>
        );
    };

    const renderFooter = ({
        leftChildren,
        rightChildren,
        sticky = true,
    }: TakeOverWizardFooterProps) => {
        return !leftChildren && !rightChildren ? null : (
            <div className={classNames(styles.footer, {[styles['static-footer']]: !sticky})}>
                {leftChildren ?? <div style={{flex: 1}} />}
                {rightChildren}
            </div>
        );
    };

    return (
        <div
            className={classNames(
                styles.container,
                fullScreenHeight ? styles['container-full'] : '',
            )}
        >
            {props.headerProps && renderHeader(props.headerProps)}
            <div className={classNames('ud-container', styles.content)}>{props.children}</div>
            {props.footerProps && renderFooter(props.footerProps)}
        </div>
    );
};

/**
 * Default interpolation function for full page frame meter label
 *
 * @param params - interpolation params (see `interpolate` method in I18nAPI
 * @param I18nApi - destructured `gettext` and `interpolate` methods for accessing translations
 * @param template - template string to interpolate with params
 * @returns an interpolated string
 */
export function getWizardMeterLabel(
    params: unknown,
    {gettext, interpolate}: {gettext: I18nApi['gettext']; interpolate: I18nApi['interpolate']},
    template: string | undefined = undefined,
) {
    return interpolate(template ?? gettext('Step %(value)s of %(max)s'), params, true);
}

/**
 * React prop interface for internal `HeaderText` component.
 * @internal
 */
interface WizardHeaderTextProps {
    /** Object for named tokens or array for positional tokens in the interpolated string */
    interpolateSource: unknown;
    /** String to interpolate for long text description */
    longTemplate?: string;
    /** String to interpolate for short text description */
    shortTemplate?: string;
}

/**
 * Internal component for using i18n hook
 * @internal
 */
const WizardHeaderText = ({interpolateSource, ...props}: WizardHeaderTextProps) => {
    const {gettext, pgettext, interpolate} = useI18n();
    const {
        longTemplate = gettext('Step %(value)s of %(max)s'),
        shortTemplate = pgettext('E.g. 1 / 4, short for 1 out of 4', '%(value)s/%(max)s'),
    } = props;

    return (
        <>
            <span className={styles['text-long']}>
                {interpolate(longTemplate, interpolateSource, true)}
            </span>
            <span className={styles['text-short']}>
                {interpolate(shortTemplate, interpolateSource, true)}
            </span>
        </>
    );
};

/** Function to render `HeaderText` component */
export const getWizardHeaderText = (
    params: WizardHeaderTextProps['interpolateSource'],
    longTemplate: WizardHeaderTextProps['longTemplate'] = undefined,
    shortTemplate: WizardHeaderTextProps['shortTemplate'] = undefined,
) => (
    <WizardHeaderText
        interpolateSource={params}
        longTemplate={longTemplate}
        shortTemplate={shortTemplate}
    />
);
