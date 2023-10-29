import {getLinkPaths} from '@udemy/instructor';
import {Accordion} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import getConfigData from 'utils/get-config-data';
import qs from 'utils/query-params';

import SecondaryMenuItem from './secondary-menu-item.react-component';
import './side-nav.less';

const udConfig = getConfigData();

@withRouter
@observer
export default class SecondaryMenuPerformance extends Component {
    static propTypes = {
        useHttpLinks: PropTypes.bool,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired,
            search: PropTypes.string.isRequired,
        }).isRequired,
        performanceEnabled: PropTypes.bool.isRequired,
        isDisplayPracticeInsightsNewPageWithFunnelViewEnabled: PropTypes.bool,
    };

    static defaultProps = {
        useHttpLinks: false,
        isDisplayPracticeInsightsNewPageWithFunnelViewEnabled: false,
    };

    getActiveClass(url) {
        const location = this.props.location.pathname;
        return classNames('subnav-button', {active: location.startsWith(url)});
    }

    getAccordionTitleClass(urls) {
        const location = this.props.location.pathname;
        let isActive = false;
        for (const i in urls) {
            if (location.startsWith(urls[i])) {
                isActive = true;
                break;
            }
        }
        return classNames('subnav-accordion-title', {active: isActive});
    }

    getActiveClassInAccordionMenu(url) {
        const location = this.props.location.pathname;
        return classNames('subnav-accordion-button', {active: location.startsWith(url)});
    }

    render() {
        const {
            useHttpLinks,
            location,
            performanceEnabled,
            isDisplayPracticeInsightsNewPageWithFunnelViewEnabled,
        } = this.props;
        const isReviewsEnabled = udConfig.brand.is_add_reviews_enabled;
        const primaryResource = 'performance';
        const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
        const paths = getLinkPaths(queryParams);
        const basePath = `/${primaryResource}`;

        return (
            <ul className="ud-unstyled-list" styleName="menu secondary-menu">
                {performanceEnabled && (
                    <SecondaryMenuItem
                        useHttpLinks={useHttpLinks}
                        to={`${basePath}${paths.overviewPath}`}
                        resource="overview"
                        primaryResource={primaryResource}
                        text={gettext('Overview')}
                        styleName={this.getActiveClass('/performance/overview')}
                    />
                )}
                {performanceEnabled && (
                    <SecondaryMenuItem
                        useHttpLinks={useHttpLinks}
                        to={`${basePath}${paths.studentsPath}`}
                        resource="students"
                        primaryResource={primaryResource}
                        text={gettext('Students')}
                        styleName={this.getActiveClass('/performance/students')}
                    />
                )}
                {isReviewsEnabled && (
                    <SecondaryMenuItem
                        useHttpLinks={useHttpLinks}
                        to={`${basePath}${paths.reviewsPath}`}
                        resource="reviews"
                        primaryResource={primaryResource}
                        text={gettext('Reviews')}
                        styleName={this.getActiveClass('/performance/reviews/')}
                    />
                )}
                {!isDisplayPracticeInsightsNewPageWithFunnelViewEnabled && (
                    <SecondaryMenuItem
                        useHttpLinks={useHttpLinks}
                        to={`${basePath}${paths.engagementPath}`}
                        resource="engagement"
                        primaryResource={primaryResource}
                        text={gettext('Course engagement')}
                        styleName={this.getActiveClass('/performance/engagement')}
                    />
                )}
                {isDisplayPracticeInsightsNewPageWithFunnelViewEnabled && (
                    <Accordion size={'medium'}>
                        <Accordion.Panel
                            title="Engagement"
                            styleName={this.getAccordionTitleClass([
                                '/performance/engagement',
                                '/performance/practice-insights',
                            ])}
                        >
                            <div>
                                <SecondaryMenuItem
                                    useHttpLinks={useHttpLinks}
                                    to={`${basePath}${paths.engagementPath}`}
                                    resource="engagement"
                                    primaryResource={primaryResource}
                                    text={gettext('Course engagement')}
                                    styleName={this.getActiveClassInAccordionMenu(
                                        '/performance/engagement',
                                    )}
                                />
                            </div>
                            <div>
                                <SecondaryMenuItem
                                    useHttpLinks={useHttpLinks}
                                    to={`${basePath}${paths.practiceInsightsPath}`}
                                    resource="practice-insights"
                                    primaryResource={primaryResource}
                                    text={gettext('Practice insights')}
                                    styleName={this.getActiveClassInAccordionMenu(
                                        '/performance/practice-insights',
                                    )}
                                />
                            </div>
                        </Accordion.Panel>
                    </Accordion>
                )}
                {performanceEnabled && (
                    <SecondaryMenuItem
                        useHttpLinks={useHttpLinks}
                        to={`${basePath}${paths.conversionPath}`}
                        resource="conversion"
                        primaryResource={primaryResource}
                        text={gettext('Traffic & conversion')}
                        styleName={this.getActiveClass('/performance/conversion')}
                    />
                )}
            </ul>
        );
    }
}
