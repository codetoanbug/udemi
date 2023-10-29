import NextIcon from '@udemy/icons/dist/next.ud-icon';
import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import truncateWithEllipsis from 'base-components/ungraduated/text/truncate-with-ellipsis';

import {TRACKING_CATEGORIES} from '../constants';
import NextItemLink from '../curriculum/next-item-link.react-component';
import requires from '../registry/requires';
import {MAIN_CONTENT, TRACKING_ACTIONS} from './constants';
import ItemLink, {FakeLink} from './item-link.react-component';
import styles from './next-and-previous.less';

@requires('userActivityStore')
class LinkContainer extends React.Component {
    static propTypes = {
        userActivityStore: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.userActivityStore.addHideOnInactive(this.ref.current);
        this.props.userActivityStore.addActiveOnHover(this.ref.current);
    }

    ref = React.createRef();

    render() {
        const {userActivityStore, ...props} = this.props;
        return <div {...props} ref={this.ref} />;
    }
}

@requires('courseTakingStore')
@observer
export default class NextAndPrevious extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
    };

    @autobind
    trackPrevious() {
        this.props.courseTakingStore.track(
            TRACKING_CATEGORIES.NAVIGATION,
            TRACKING_ACTIONS.PREVIOUS,
        );
    }

    @autobind
    trackNext() {
        this.props.courseTakingStore.track(TRACKING_CATEGORIES.NAVIGATION, TRACKING_ACTIONS.NEXT);
    }

    @autobind
    finishCoursePortion() {
        this.props.courseTakingStore.setMainContentType(MAIN_CONTENT.END_SCREEN);
        this.trackNext();
    }

    @autobind
    renderTooltipContent({className, ...props}, ...args) {
        return Popover.defaultProps.renderContent(
            {className: classNames(className, 'ud-text-sm', styles.tooltip), ...props},
            ...args,
        );
    }

    get tooltipProps() {
        return {
            canToggleOnHover: true,
            a11yRole: 'description',
            withArrow: false,
            withPadding: false,
            renderContent: this.renderTooltipContent,
        };
    }

    get iconProps() {
        return {color: 'inherit', size: 'large'};
    }

    get previousLink() {
        const {previousCurriculumItem} = this.props.courseTakingStore;
        if (!previousCurriculumItem) {
            return null;
        }
        const link = (
            <Button
                componentClass={ItemLink}
                itemType={previousCurriculumItem.type}
                itemId={previousCurriculumItem.id}
                udStyle="primary"
                onClick={this.trackPrevious}
                data-purpose="go-to-previous"
                id="go-to-previous-item"
                styleName="button previous"
            >
                <PreviousIcon {...this.iconProps} label={gettext('Go to Previous lecture')} />
            </Button>
        );
        return (
            <LinkContainer styleName="container previous">
                <Popover {...this.tooltipProps} placement="right" trigger={link}>
                    {truncateWithEllipsis(previousCurriculumItem.displayTitle, 50)}
                </Popover>
            </LinkContainer>
        );
    }

    get nextLink() {
        const {
            mainContentType,
            isFinalReviewStageActive,
            isProgramTakingExperience,
        } = this.props.courseTakingStore;
        if (mainContentType === MAIN_CONTENT.END_SCREEN || isFinalReviewStageActive) {
            return null;
        }

        const {coursePortion, nextCurriculumItem} = this.props.courseTakingStore;

        if (isProgramTakingExperience && !nextCurriculumItem) {
            return null;
        }

        let LinkComponent = NextItemLink;
        let onClick = this.trackNext;
        let iconLabel = nextCurriculumItem
            ? gettext('Go to Next lecture')
            : gettext('Finish course');
        let tooltipContent = nextCurriculumItem
            ? truncateWithEllipsis(nextCurriculumItem.displayTitle, 50)
            : gettext('Finish course');
        if (coursePortion && !nextCurriculumItem) {
            LinkComponent = FakeLink;
            onClick = this.finishCoursePortion;
            iconLabel = gettext('Finish portion of course');
            tooltipContent = gettext('Finish portion of course');
        }

        const link = (
            <Button
                componentClass={LinkComponent}
                udStyle="primary"
                onClick={onClick}
                data-purpose="go-to-next"
                id="go-to-next-item"
                styleName="button next"
            >
                <NextIcon {...this.iconProps} label={iconLabel} />
            </Button>
        );
        return (
            <LinkContainer styleName="container next">
                <Popover {...this.tooltipProps} placement="left" trigger={link}>
                    {tooltipContent}
                </Popover>
            </LinkContainer>
        );
    }

    render() {
        return (
            <>
                {this.previousLink}
                {this.nextLink}
            </>
        );
    }
}
