import classnames from 'classnames';
import React, {useEffect, useRef, useState} from 'react';
import './animated-collapse.less';

interface Props {
    collapsed: boolean;
    collapseDirection: 'width' | 'height';
    children: JSX.Element;
    minHeight?: string;
    height?: string;
}

export const TRANSITION_DURATION = 400; // transition duration @animation-duration-slow
export const AUTO_CLOSE_DISTANCE = 40; // if panel resized smaller than this size, panel will take closed state

const AnimatedCollapseByWidth: React.FC<Props> = ({collapsed, collapseDirection, children}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState<string>(collapsed ? '0px' : 'auto');
    const [transformWidth, setTransformWidth] = useState<string>('auto');

    useEffect(() => {
        if (collapsed) {
            setWidth(`${ref.current?.scrollWidth}px`);
            setTransformWidth(`${ref.current?.scrollWidth}px`);
            setTimeout(() => setWidth('0px'), 10);
            setTimeout(
                () => setTransformWidth(`${ref.current?.scrollWidth}px`),
                TRANSITION_DURATION + 10,
            );
        } else {
            setWidth(`${ref.current?.scrollWidth}px`);
            setTimeout(() => {
                setWidth('auto');
                setTransformWidth('auto');
            }, TRANSITION_DURATION);
        }
    }, [collapsed, ref]);

    return (
        <div
            ref={ref}
            styleName={classnames('outer', {
                'full-height': collapseDirection === 'width',
                'full-width': collapseDirection === 'height',
                'width-transition': collapseDirection === 'width',
                'height-transition': collapseDirection === 'height',
            })}
            style={{
                width,
                transform: width === '0px' ? `translateX(-${transformWidth})` : 'unset',
            }}
        >
            <div
                styleName={classnames('inner', {
                    'full-height': collapseDirection === 'width',
                    'full-width': collapseDirection === 'height',
                })}
                style={{width: 'auto'}}
            >
                {children}
            </div>
        </div>
    );
};

const AnimatedCollapseByHeight: React.FC<Props> = ({
    collapsed,
    collapseDirection,
    minHeight,
    height: specifiedHeight,
    children,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<string>(
        collapsed ? minHeight ?? '0px' : specifiedHeight ?? 'auto',
    );
    const [firstTime, setFirstTime] = useState<boolean>(true);

    useEffect(
        (() => {
            if (firstTime) {
                setFirstTime(false);
                return;
            }
            if (collapsed) {
                if (height === minHeight ?? '0px') return;
                setHeight(`${ref.current?.scrollHeight}px`);
                setTimeout(() => setHeight(minHeight ?? '0px'), 10);
            } else {
                if (height === 'auto' || (specifiedHeight && height === specifiedHeight)) return;
                setHeight(specifiedHeight ?? `${ref.current?.scrollHeight}px`);
                setTimeout(() => {
                    setHeight(specifiedHeight ?? 'auto');
                }, TRANSITION_DURATION);
            }
        }) as VoidFunction,
        [collapsed],
    );

    useEffect(
        (() => {
            if (firstTime) {
                setFirstTime(false);
                return;
            }
            if (collapsed) return;
            setHeight(specifiedHeight?.includes('px') ? 'auto' : specifiedHeight ?? 'auto');
        }) as VoidFunction,
        [specifiedHeight],
    );

    return (
        <div
            styleName={classnames('outer', {
                'full-height': collapseDirection === 'width',
                'full-width': collapseDirection === 'height',
                'width-transition': collapseDirection === 'width',
                'height-transition': collapseDirection === 'height',
            })}
            style={{height}}
        >
            <div
                ref={ref}
                styleName={classnames('inner', {
                    'full-height': collapseDirection === 'width',
                    'full-width': collapseDirection === 'height',
                })}
                style={{height: specifiedHeight ? '100%' : 'auto'}}
            >
                {children}
            </div>
        </div>
    );
};

export const AnimatedCollapse: React.FC<Props> = (props) => (
    <>
        {props.collapseDirection === 'width' ? (
            <AnimatedCollapseByWidth {...props} />
        ) : (
            <AnimatedCollapseByHeight {...props} />
        )}
    </>
);
