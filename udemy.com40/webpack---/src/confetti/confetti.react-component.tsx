import {tokens} from '@udemy/styles';
import React from 'react';
import ReactConfetti, {Props as ReactConfettiProps} from 'react-confetti';
import Particle from 'react-confetti/dist/types/Particle';
import {createPortal} from 'react-dom';

import styles from './confetti.module.less';

export const drawConfettiShape = function (this: Particle, context: CanvasRenderingContext2D) {
    /**
     * These are the three integers assigned to different Particle types in react-confetti.
     * The internal logic chooses the type at random.
     */
    const PARTICLE_CIRCLE = 0;
    const PARTICLE_RECTANGLE = 1;
    const PARTICLE_TRIANGLE = 2;

    switch (this.shape) {
        case PARTICLE_CIRCLE: {
            this.radius = 4;
            context.beginPath();
            context.arc(0, 0, this.radius, 0, 2 * Math.PI);
            context.fill();
            break;
        }
        case PARTICLE_RECTANGLE: {
            this.w = 12;
            this.h = 6;
            context.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
            break;
        }
        case PARTICLE_TRIANGLE: {
            this.w = 6;
            this.h = 6;
            context.beginPath();
            context.moveTo(0, -this.h);
            context.lineTo(-this.w, this.h);
            context.lineTo(this.w, this.h);
            context.fill();
            break;
        }
    }
    context.closePath();
    context.restore();
};

/**
 * The React props interface for the Confetti component.  We currently only allow a user to set the
 * width and height (of the canvas drawn by react-confetti)
 *
 * @remarks
 * We set the following values in the `react-confetti` component (most are the component defaults)
 *
 * - `numberOfPieces` - `200`
 * - `colors` - `['color-orange-100', 'color-orange-200', 'color-orange-300']`
 * - `drawShape` - see {@link drawConfettiShape} for implementation
 * - `recycle` - `false`
 *
 * The rest are the react-confetti component defaults:
 * - `wind` - `0`
 * - `gravity` - `.1`
 * - `initialX` - `4`
 * - `initialY` - `10`
 * - `opacity` - `1`
 */
export interface ConfettiProps {
    /** The height of the HTML Canvas drawn */
    height?: ReactConfettiProps['height'];
    /** The width of the HTML Canvas drawn */
    width?: ReactConfettiProps['width'];
    /**
     * Flag to determine to create a portal to the body element for the canvas element
     *
     * @defaultValue `false` in Confetti
     */
    usePortal?: boolean;
}

/**
 * ### Confetti
 *
 * @remarks
 * The actor Rip Taylor would love this component.  This is commonly used on Udemy applications to celebration completion of a course.
 *
 * This component uses a third party plugin see {@link https://github.com/alampros/react-confetti}
 */
export const Confetti = ({width, height, usePortal = false}: ConfettiProps) => {
    const confetti = (
        <div className={styles.confetti}>
            <ReactConfetti
                width={width}
                height={height}
                colors={[
                    tokens['color-orange-100'],
                    tokens['color-orange-200'],
                    tokens['color-orange-300'],
                ]}
                recycle={false}
                drawShape={drawConfettiShape}
            />
        </div>
    );

    if (document && usePortal) {
        return createPortal(confetti, document.body);
    }

    return confetti;
};
