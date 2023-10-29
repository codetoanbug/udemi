import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Carousel from 'base-components/carousel/carousel.react-component';
import {withMatchMedia} from 'base-components/responsive/match-media.react-component';
import instructorTokens from 'instructor/variables';
import getRequestData from 'utils/get-request-data';

import './responsive-card-carousel.less';

@observer
class CardList extends Component {
    @observable isExpanded = false;

    @autobind
    @action
    onClickSeeMore() {
        this.isExpanded = true;
    }

    render() {
        let items = React.Children.toArray(this.props.children);
        if (!this.isExpanded) {
            items = items.slice(0, 3);
        }

        return (
            <div styleName="list">
                {items}
                {!this.isExpanded && (
                    <Button udStyle="secondary" onClick={this.onClickSeeMore} styleName="see-more">
                        {gettext('See more')}
                        <ExpandIcon label={false} />
                    </Button>
                )}
            </div>
        );
    }
}

@withMatchMedia({
    isMobileSize: `(max-width: ${instructorTokens['breakpoint-instructor-mobile-max']})`,
})
export default class ResponsiveCardCarousel extends Component {
    static propTypes = {
        isMobileSize: PropTypes.oneOfType([PropTypes.bool, PropTypes.instanceOf(null)]),
        renderItems: PropTypes.func.isRequired,
    };

    static defaultProps = {
        isMobileSize: null,
    };

    render() {
        if (this.props.isMobileSize) {
            return <CardList>{this.props.renderItems(true)}</CardList>;
        }

        const udRequest = getRequestData();
        return <Carousel showPager={!udRequest.isMobile}>{this.props.renderItems(false)}</Carousel>;
    }
}
