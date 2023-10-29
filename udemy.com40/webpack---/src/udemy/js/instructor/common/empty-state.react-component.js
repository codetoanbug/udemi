import {Image} from '@udemy/react-core-components';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './empty-state.less';

export default class EmptyState extends Component {
    static propTypes = {
        headerText: PropTypes.string,
        subText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        src: PropTypes.string,
        src2x: PropTypes.string,
    };

    static defaultProps = {
        headerText: null,
        subText: null,
        src: null,
        src2x: null,
    };

    render() {
        const {headerText, subText, src, src2x} = this.props;
        return (
            <div styleName="empty-state">
                {src && (
                    <Image
                        src={src}
                        srcSet={src2x && `${src} 1x, ${src2x} 2x`}
                        alt=""
                        width={240}
                        height={180}
                    />
                )}
                {headerText && <h3 className="ud-heading-lg">{headerText}</h3>}
                {subText && <p styleName="empty-text">{subText}</p>}
            </div>
        );
    }
}
