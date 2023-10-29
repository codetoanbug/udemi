import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React from 'react';

import {UFBNoticeClickEvent, UFBNoticeImpressionEvent} from 'browse/events';
import getRequestData from 'utils/get-request-data';

import './buy-for-team.less';

export default class BuyForTeam extends React.Component {
    static propTypes = {
        ufb_demo_link: PropTypes.string.isRequired,
        ufb_copy_context: PropTypes.shape({
            title: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
        }).isRequired,
        ufb_button_copy: PropTypes.string.isRequired,
        buy_for_team_ref: PropTypes.string.isRequired,
        isOnsiteRequestDemo: PropTypes.bool,
    };

    static defaultProps = {
        isOnsiteRequestDemo: false,
    };

    udRequest = getRequestData();

    @autobind
    handleClick() {
        const {buy_for_team_ref: buyForTeamRef, ufb_demo_link: ufbDemoLink} = this.props;
        Tracker.publishEvent(
            new UFBNoticeClickEvent({
                locale: this.udRequest.locale,
                placement: buyForTeamRef,
                url: ufbDemoLink.split('?')[0],
            }),
        );
    }

    @autobind
    trackImpression() {
        const {buy_for_team_ref: buyForTeamRef, ufb_demo_link: ufbDemoLink} = this.props;
        Tracker.publishEvent(
            new UFBNoticeImpressionEvent({
                locale: this.udRequest.locale,
                placement: buyForTeamRef,
                url: ufbDemoLink.split('?')[0],
            }),
        );
    }

    render() {
        const {isOnsiteRequestDemo} = this.props;
        return (
            <TrackImpression trackFunc={this.trackImpression}>
                <div>
                    <h2 className="ud-heading-lg" styleName="title">
                        {this.props.ufb_copy_context.title}
                    </h2>
                    <p className="ud-text-sm" styleName="content">
                        {this.props.ufb_copy_context.content}
                    </p>
                    <Button
                        componentClass="a"
                        data-purpose="ufb-link-button"
                        udStyle="secondary"
                        href={this.props.ufb_demo_link}
                        target={isOnsiteRequestDemo ? null : '_blank'}
                        styleName="button"
                        size="medium"
                        onClick={this.handleClick}
                    >
                        {this.props.ufb_button_copy}
                    </Button>
                </div>
            </TrackImpression>
        );
    }
}
