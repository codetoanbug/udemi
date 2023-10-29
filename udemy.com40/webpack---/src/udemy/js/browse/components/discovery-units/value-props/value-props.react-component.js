import {withMatchMedia} from '@udemy/hooks';
import {withI18n} from '@udemy/i18n';
import LifetimeIcon from '@udemy/icons/dist/lifetime.ud-icon';
import RatingStarIcon from '@udemy/icons/dist/rating-star.ud-icon';
import SolidArrowRightIcon from '@udemy/icons/dist/solid-arrow-right.ud-icon';
import {ValueProps as ValuePropsBase} from '@udemy/react-structure-components';
import {withUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {getNumericSiteStat} from 'utils/site-stats';

import styles from './value-props.less';

@withMatchMedia({isMobileMax: 'mobile-max'})
@observer
class ValueProps extends Component {
    static propTypes = {
        className: PropTypes.string,
        gettext: PropTypes.func.isRequired,
        interpolate: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
        isMobileMax: PropTypes.bool,
    };

    static defaultProps = {
        className: undefined,
        isMobileMax: null,
    };

    @computed
    get isFirstVisitWithinSevenDays() {
        const {me: udMe, visiting: udVisiting} = this.props.udData;
        if (udVisiting.isLoading || udMe.isLoading) {
            return false;
        }
        const firstVisitTime = new Date(udVisiting.first_visit_time).getTime();

        const userCreatedTime = new Date(udMe.created || new Date()).getTime();
        const timeToUse = firstVisitTime < userCreatedTime ? firstVisitTime : userCreatedTime;
        const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        const now = new Date();
        return now - timeToUse < sevenDaysInMilliseconds;
    }

    render() {
        const {gettext, interpolate, udData, isMobileMax} = this.props;
        // eslint-disable-next-line camelcase
        const {Config, site_stats} = udData;
        const shouldHideIcons = isMobileMax === null ? true : isMobileMax;
        if (!this.isFirstVisitWithinSevenDays) {
            // We can't return null here due to the usage of <Observer> in <InfiniteScrollContainer>
            // Observer needs a real DOM node.  So we render a div with a class that lets us
            // maintain styles for discovery units.
            return <div className="discovery-unit-empty-render" />;
        }

        // Note, `ud-full-viewport-container` provided by scaffolding.global.less from `@udemy/styles`
        const defaultStyles = classNames(
            this.props.className,
            'ud-full-viewport-container browse-value-props',
        );
        return (
            <div className={classNames(defaultStyles, styles.wrapper)} data-purpose="value-props">
                <h2 className={classNames('ud-heading-serif-xl', styles.title)}>
                    {gettext('Why learn on Udemy?')}
                </h2>
                <div className="ud-container">
                    <ValuePropsBase size="small">
                        <ValuePropsBase.Prop
                            icon={shouldHideIcons ? null : SolidArrowRightIcon}
                            headline={interpolate(
                                gettext(
                                    'Learn in-demand skills with over %(numCoursesSiteStat)s video courses',
                                ),
                                {
                                    numCoursesSiteStat: `${getNumericSiteStat(
                                        'num_courses_rounded',
                                        {
                                            Config,
                                            site_stats,
                                        },
                                    )}`,
                                },
                                true,
                            )}
                        />
                        <ValuePropsBase.Prop
                            icon={shouldHideIcons ? null : RatingStarIcon}
                            headline={gettext('Choose courses taught by real-world experts')}
                        />
                        <ValuePropsBase.Prop
                            icon={shouldHideIcons ? null : LifetimeIcon}
                            headline={gettext(
                                'Learn at your own pace, with lifetime access on mobile and desktop',
                            )}
                        />
                    </ValuePropsBase>
                </div>
            </div>
        );
    }
}

export default withI18n(withUDData(ValueProps));
