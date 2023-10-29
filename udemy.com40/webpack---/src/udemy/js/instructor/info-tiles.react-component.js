import {Tracker} from '@udemy/event-tracking';
import {ExpressiveIcon} from '@udemy/icons-expressive';
import {Link} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {InstructorPageActionEvent, UBContentOpportunitiesSelected} from 'instructor/events';

import './info-tiles.less';

class InfoTile extends Component {
    static propTypes = {
        url: PropTypes.string.isRequired,
        icon: PropTypes.elementType,
        label: PropTypes.string.isRequired,
        info: PropTypes.string.isRequired,
        trackPage: PropTypes.string.isRequired,
        trackEvent: PropTypes.string.isRequired,
        useRouterLink: PropTypes.bool,
        openInNewTab: PropTypes.bool,
        expressiveIcon: PropTypes.string,
        dataPurpose: PropTypes.string,
    };

    static defaultProps = {
        icon: null,
        openInNewTab: true,
        useRouterLink: false,
        expressiveIcon: null,
        dataPurpose: null,
    };

    @autobind
    trackClick() {
        if (this.props.trackEvent === 'content_opportunities') {
            Tracker.publishEvent(new UBContentOpportunitiesSelected());
        }

        Tracker.publishEvent(
            new InstructorPageActionEvent({
                page: this.props.trackPage,
                action: this.props.trackEvent,
            }),
        );
    }

    render() {
        const {
            url,
            icon: Icon,
            label,
            info,
            openInNewTab,
            useRouterLink,
            expressiveIcon,
            dataPurpose,
        } = this.props;
        let LinkComponent;
        const linkProps = {};
        if (useRouterLink) {
            LinkComponent = Link;
            linkProps.to = url;
        } else {
            LinkComponent = 'a';
            linkProps.href = url;
        }
        if (openInNewTab) {
            linkProps.target = '_blank';
            linkProps.rel = 'noopener noreferrer';
        }
        return (
            <div styleName="info-tile-wrapper" data-purpose={dataPurpose || null}>
                <LinkComponent {...linkProps} onClick={this.trackClick} styleName="info-tile">
                    {expressiveIcon ? (
                        <ExpressiveIcon name={expressiveIcon} width="52" height="52" />
                    ) : (
                        <Icon label={false} size="xlarge" />
                    )}
                    <h3 className="ud-heading-md">{label}</h3>
                    <div styleName="info">{info}</div>
                </LinkComponent>
            </div>
        );
    }
}

export default function InfoTiles({children}) {
    return <div styleName="info-tiles">{children}</div>;
}

InfoTiles.Tile = InfoTile;
