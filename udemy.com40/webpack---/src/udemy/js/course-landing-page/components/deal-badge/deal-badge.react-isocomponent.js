import {Badge} from '@udemy/react-messaging-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import injectCourseLandingPageData from 'course-landing-page/components/inject-course-landing-component-context';
import {isomorphic} from 'utils/isomorphic-rendering';

import styles from './deal-badge.less';

const DEAL_BADGE_COLORS = ['black', 'coral', 'orange', 'purple', 'teal'];

@observer
class BaseDealBadge extends React.Component {
    static propTypes = {
        color: PropTypes.oneOf(DEAL_BADGE_COLORS),
        text: PropTypes.string,
    };

    static defaultProps = {
        color: undefined,
        text: undefined,
    };

    render() {
        const {color, text} = this.props;
        if (!color || !text) {
            return null;
        }

        return (
            <Badge className={styles[color]} data-purpose="deal-badge">
                {text}
            </Badge>
        );
    }
}

export const CacheableDealBadge = injectCourseLandingPageData(
    'deal_badge',
    true,
)(({data}) => <BaseDealBadge {...data} />);
const DealBadge = isomorphic(injectCourseLandingPageData('deal_badge', true)(BaseDealBadge));
export default DealBadge;
