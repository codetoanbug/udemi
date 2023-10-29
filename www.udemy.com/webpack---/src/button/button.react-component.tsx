/* eslint-disable @typescript-eslint/naming-convention */
import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';

import {BaseIconProps, isIcon} from '../base-icon/base-icon.react-component';
import {RouterLink, UdemyLinkProps} from '../router-link/router-link.react-component';

// Note: Button CSS is served up via the react-core-components.global.css file;

/** ButtonStyle in JavaScript components where previously they referenced Button.propTypes.udStyle */
export const ButtonStyle = [
    'primary',
    'secondary',
    'ghost',
    'white-solid',
    'white-outline',
    'brand',
    'link',
    'link-underline',
] as const;
/** Style of the Button  */
export type ButtonStyleType = typeof ButtonStyle[number];

/** ButtonSize in JS components where previously they referenced Button.propTypes.size */
export const ButtonSize = ['xsmall', 'small', 'medium', 'large'] as const;
/** Size of the Button  */
export type ButtonSizeType = typeof ButtonSize[number];

/** Core Button styles used by all buttons before the discrimination union kicks in between HTML and LinkRouter props */
interface ButtonCommonProps extends React.ComponentPropsWithoutRef<'button'> {
    /** onClick Event Handler for Button */
    onClick?: React.MouseEventHandler<HTMLElement>;
    /**
     * Corresponds to id prop in `CheckedStateCheckbox` and `CheckedStateRadioGroup`.
     * Maintained for legacy `CheckedState` mechanism */
    cssToggleId?: string;
    /** Determines if the button is rounded (circular) */
    round?: boolean;
    /**
     * Size of the button.
     * See {@link ButtonSizeType| the ButtonSizeType type} for more details.
     */
    size?: ButtonSizeType;
    /**
     * Style of the button.
     * See {@link ButtonStyleType| the ButtonStyleType type} for more details.
     */
    udStyle?: ButtonStyleType;
    /**
     * Optional override with one of the UDLite typography classes.
     * Ex: ud-heading-xx or ud-text-xx classname. */
    typography?: string;
    // Ideally we would be using Typescript Polymorphic Components for these:
    /** HTML `href` attribute */
    href?: string;
    /** HTML `target` attribute */
    target?: string;
    /** HTML `rel` attribute */
    rel?: string;
    /** HTML `disabled attribute */
    disabled?: boolean;
}

/** The original duo of potential `componentClass` properties for Button */
export interface ButtonHtmlProps extends ButtonCommonProps {
    /** The type of HTML or React.ElementType to render the button as in the DOM. React.ElementType is used for more unusual componentClass values like 'span', 'div', 'label' or a custom component */
    componentClass?: 'button' | 'a' | React.ElementType;
}

/** This interface has a required `to` property, only used when a router `Link` is passed in as `componentClass` */
export interface ButtonRouterLinkProps extends ButtonCommonProps {
    /** `react-router-dom` `to` property */
    to: UdemyLinkProps['to'];
    /** Hardset any Button using a `to` property to use the `RouterLink` */
    componentClass?: typeof RouterLink;
}
// This is called a "Discriminated Union" See: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
/** The type union used to create props for a Button component. */
export type ButtonProps = ButtonHtmlProps | ButtonRouterLinkProps;

interface ButtonPropsDefaults {
    onTouchStart: () => void;
    type: string | undefined;
    'aria-disabled'?: boolean | null;
}

/**
 * The Button Component. A wonderfully complex polymorphic React component. Choose your own
 * adventure as to what type of component to render via the `componentClass` property.
 *
 * @remarks
 *
 * `Button` will modify icons passed as children to make sure their color and size props
 * are set. Note that this behavior will fail if those icons are not direct children (e.g.,
 * icons wrapped in a React.Fragment).
 **/
export class Button extends React.Component<ButtonProps> {
    static defaultProps = {
        componentClass: 'button',
        cssToggleId: null,
        onClick: null,
        round: false,
        size: 'large',
        udStyle: 'primary',
        typography: null,
    };

    componentDidMount() {
        // Maintained for legacy CheckedState mechanism:
        if (this.props.cssToggleId) {
            // DOM node found must be the one with attribute [data-css-toggle-id={cssToggleId}]
            // eslint-disable-next-line react/no-find-dom-node
            const button = ReactDOM.findDOMNode(this);

            // Remove non-React event handler for clicking on buttons with
            // data-css-toggle-id attribute. Once this mounts, then handle the click
            // event in handleClick and dispatch csstoggle events there.
            //
            // @ts-expect-error: TS does not know handleCSSToggleButtonClick
            const handleCSSToggleButtonClick = window.handleCSSToggleButtonClick;
            if (button && handleCSSToggleButtonClick) {
                button.removeEventListener('click', handleCSSToggleButtonClick);
            }
        }
    }

    // Maintained for legacy CheckedState mechanism
    handleCssToggleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        // Support CSS Toggle/Checked State mechanism by issuing csstoggle
        // event on the corresponding CheckedState component's rendered
        // element. Button prop cssToggleId == CheckedState prop id.
        // See @udemy/react-checked-state-components for more.
        const input = document.getElementById(this.props.cssToggleId ?? '');
        input?.dispatchEvent(new Event('csstoggle'));

        if (this.props.onClick) {
            this.props.onClick(event);
        }
    };

    render() {
        const {componentClass, cssToggleId, round, size, typography, udStyle, ...htmlPropsGiven} =
            this.props;

        // Empty onTouchStart needed for :active state to work on iOS:
        // https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari
        const htmlPropDefaults: ButtonPropsDefaults = {onTouchStart: noop, type: 'button'};
        const htmlPropOverrides: ButtonProps & {'data-css-toggle-id'?: string} = {};
        // Maintained for legacy CheckedState mechanism:
        if (cssToggleId) {
            // Binds button to corresponding CheckedState component
            htmlPropOverrides['data-css-toggle-id'] = cssToggleId;
            htmlPropOverrides.onClick = this.handleCssToggleClick;
        }
        if (htmlPropsGiven.disabled) {
            htmlPropOverrides.onClick = htmlPropOverrides.href = undefined;
            htmlPropOverrides.tabIndex = -1;
        }
        if (componentClass !== 'button') {
            htmlPropDefaults['aria-disabled'] = htmlPropsGiven.disabled;
            htmlPropOverrides.disabled = undefined;
            htmlPropOverrides.type = undefined;
        }

        const htmlProps = {...htmlPropDefaults, ...htmlPropsGiven, ...htmlPropOverrides};

        const children = React.Children.map(this.props.children, (child) => {
            if (typeof child === 'string') {
                // If child is naked text, wrap it in a span so we can target it with CSS
                return <span>{child}</span>;
            } else if (isIcon(child)) {
                const iconChild = child as React.ReactElement<BaseIconProps>;
                const iconProps: Omit<BaseIconProps, 'glyph' | 'label'> = {};
                if (iconChild && iconChild.props.size === undefined) {
                    // Set icon size accordingly if it doesn't have an explicit size
                    iconProps.size = size === 'large' ? 'small' : 'xsmall';
                }

                if (this.props['aria-label']) {
                    // Set icon label to false if the button has an aria-label
                    /** @ts-expect-error we are omitting `label` from type for `iconChild` above */
                    iconProps.label = false;
                }

                // Set icon color automatically if it doesn't have an explicit color
                if (iconChild.props.color === undefined) {
                    iconProps.color = 'inherit';
                }

                return React.cloneElement(iconChild, iconProps);
            }

            return child;
        });

        const ButtonComponent = componentClass as React.ElementType;

        return (
            <ButtonComponent
                {...htmlProps}
                className={classNames(
                    'ud-btn',
                    `ud-btn-${size}`,
                    `ud-btn-${udStyle}`,
                    round ? 'ud-btn-round' : null,
                    round && size === 'xsmall' ? 'ud-btn-round-xsmall' : null,
                    typography ?? (size === 'large' ? 'ud-heading-md' : 'ud-heading-sm'),
                    htmlProps.disabled || htmlProps['aria-disabled'] ? 'ud-btn-disabled' : null,
                    htmlProps.className,
                )}
            >
                {children}
            </ButtonComponent>
        );
    }
}
