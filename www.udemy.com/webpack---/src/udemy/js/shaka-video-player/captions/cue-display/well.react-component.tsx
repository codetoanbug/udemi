import {observe} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './well.less';

function addCSSPrefixes(name: any, value: any) {
    const capitalized = name[0].toUpperCase() + name.slice(1);
    return {
        [`Webkit${capitalized}`]: value,
        [`Moz${capitalized}`]: value,
        [`ms${capitalized}`]: value,
        [`O${capitalized}`]: value,
        [name]: value,
    };
}

interface WellProps {
    captionDisplayStore: any;
}

@inject('captionDisplayStore')
@observer
export class Well extends React.Component<WellProps> {
    static propTypes = {
        captionDisplayStore: PropTypes.object.isRequired,
    };

    constructor(props: any) {
        super(props);
        this.disposers = [];
    }

    componentDidMount() {
        // Whenever the cue text changes, we want to 'reset' the scroll back to the top, and we
        // want to do so immediately (i.e. without a sliding transition). Hence, hence we temporarily
        // remove the transition style until the new text has been re-rendered, and then add it back
        // when the cue position updates.
        this.disposers.push(
            observe(this.props.captionDisplayStore, 'cuePosition', () => {
                this.textRef.classList.add(styles['transition-active']);
            }),
            observe(this.props.captionDisplayStore, 'activeCueText', () => {
                this.textRef.classList.remove(styles['transition-active']);
                this.reset = true;
            }),
        );
    }

    componentWillUnmount() {
        this.disposers.forEach((disposer: any) => disposer());
    }

    containerRef: any;
    disposers: any;
    reset: any;
    textRef: any;

    addContainerRef = (ref: any) => {
        this.containerRef = ref;
    };

    addTextRef = (ref: any) => {
        this.textRef = ref;
    };

    render() {
        const {captionDisplayStore} = this.props;
        const scrollDistance =
            this.containerRef && this.textRef
                ? this.textRef.offsetHeight - this.containerRef.offsetHeight
                : 0;
        // The layout of the following logic looks a bit clumsy, but I found that mobx-react was
        // not responding correctly to changes in cuePosition when textStyle was defined within an
        // if statement.
        const textStyle = addCSSPrefixes(
            'transform',
            `translateY(-${scrollDistance * captionDisplayStore.cuePosition}px)`,
        );
        const defaultStyle = addCSSPrefixes('transform', 'none');
        const useStyle = scrollDistance && !this.reset;
        this.reset = false;
        return (
            <div
                styleName="container"
                style={{fontSize: captionDisplayStore.captionStyle.fontSize}}
                ref={this.addContainerRef}
            >
                <span
                    styleName="text transition-active"
                    style={useStyle ? textStyle : defaultStyle}
                    ref={this.addTextRef}
                >
                    {captionDisplayStore.activeCueText}
                </span>
            </div>
        );
    }
}
