import {BaseIconProps} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import styles from './value-props.module.less';

/** The size of the rendered {@link ValueProp} */
type ValuePropSize = 'small' | 'large';

export interface ValuePropsProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The size of the rendered {@link ValueProp}.
     * @see {@link ValuePropSize} */
    size: ValuePropSize;
}

/**
 * ### The ValueProp component.
 */
export const ValueProps = ({size, children}: ValuePropsProps) => {
    const valuePropsChildren = React.Children.toArray(children);
    const isSmallWithoutIcons =
        size === 'small' &&
        !valuePropsChildren.every(
            (child) => (child as React.ReactElement<SmallValuePropProps>).props.icon,
        );
    return (
        <div
            className={classNames(styles.props, styles[`props--${size}`], {
                [styles['props--small-no-icons']]: isSmallWithoutIcons,
            })}
        >
            {React.Children.map(children, (child, index) =>
                React.cloneElement(child as React.ReactElement, {key: index, size}),
            )}
        </div>
    );
};

/** The React prop interface for small ValueProps.Prop */
interface SmallValuePropProps {
    /** Headline to display for Value proposition */
    headline: string;
    /**
     * Optional icon to display with Value Prop.
     *
     * @remarks
     * You must set an `icon` prop if `text` is not set.
     */
    icon?: React.ElementType<Omit<BaseIconProps, 'glyph'>>;
    /** Optional additional text for the ValueProps */
    text?: React.ReactNode;
}

/** Smaller rendering of a ValueProp.Prop */
const SmallValueProp = ({icon: IconComponent, headline, text}: SmallValuePropProps) => {
    return (
        <div className={styles.prop}>
            {IconComponent && (
                <div className={classNames(styles.graphic, {[styles.centered]: !text})}>
                    <div className={styles.icon}>
                        <IconComponent label={false} color="neutral" size="medium" />
                    </div>
                </div>
            )}
            <div className={classNames(styles.body, {[styles.centered]: !text})}>
                <div className="ud-heading-md">{headline}</div>
                {text && <div className={classNames('ud-text-sm', styles.text)}>{text}</div>}
            </div>
        </div>
    );
};

/** The React prop interface for large ValueProps.Props */
interface LargeValuePropProps {
    /** Headline to display for Value proposition */
    headline: string;
    /** Optional image to display for large Value proposition */
    image?: React.ReactElement;
    /** Optional icon to display for large Value proposition */
    icon?: React.ElementType<Omit<BaseIconProps, 'glyph'>>;
    /** Optional additional text for the ValueProps */
    text?: React.ReactNode;
    /** Optional Call to Action text for the ValueProps */
    cta?: React.ReactNode;
}

/** Larger rendering of a ValueProp.Prop */
const LargeValueProp = ({image, icon: IconComponent, headline, text, cta}: LargeValuePropProps) => {
    let graphic;

    if (!image && !IconComponent && !text) {
        throw new Error(
            'At least one of following props: `image`, `icon`, `text` must be provided for LargeValueProps.',
        );
    }

    if (image) {
        graphic = React.cloneElement(image, {width: 100, height: 100});
    } else if (IconComponent) {
        graphic = (
            <div className={styles.icon}>
                <IconComponent label={false} color="neutral" size="xlarge" />
            </div>
        );
    }
    return (
        <div className={styles.prop}>
            {graphic && <div className={styles.graphic}>{graphic}</div>}
            <div className={classNames('ud-heading-lg', styles.body)}>{headline}</div>
            {text && <div className={classNames(styles.body, styles.text)}>{text}</div>}
            {cta && <div className={styles.cta}>{cta}</div>}
        </div>
    );
};

/**
 * Common React prop interface for the ValueProps.Prop component.
 *
 * @internal
 *
 * @remarks
 * A user will never interact with this interface directly.
 */
interface CommonValuePropProps {
    /**
     * The size of the ValueProp.
     * @remarks
     * This wil be passed in via the `React.cloneElement` in {@link ValueProps}. */
    size?: ValuePropSize;
}

type ValuePropProps = CommonValuePropProps & (LargeValuePropProps | SmallValuePropProps);

/**
 * ### The ValueProp component.
 *
 * @remarks
 * Exposed to users as `ValueProps.Prop`.
 * Rendering of {@link SmallValueProp} or {@link LargeValueProp} is based of the `size` prop.
 */
const ValueProp = ({size = 'small', ...props}: ValuePropProps) => {
    return size === 'small' ? <SmallValueProp {...props} /> : <LargeValueProp {...props} />;
};

ValueProps.Prop = ValueProp;
