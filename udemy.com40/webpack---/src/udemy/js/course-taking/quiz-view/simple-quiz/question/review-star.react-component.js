import RatingStarIcon from '@udemy/icons/dist/rating-star.ud-icon';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './review-star.less';

@observer
export default class ReviewStar extends Component {
    static propTypes = {
        udStyle: PropTypes.oneOf(['transparent', 'subdued', 'accented']),
    };

    static defaultProps = {
        udStyle: 'subdued',
    };

    render() {
        const {udStyle, ...props} = this.props;
        return (
            <RatingStarIcon
                color="inherit"
                size="small"
                {...props}
                className={props.className}
                styleName={udStyle}
            />
        );
    }
}
