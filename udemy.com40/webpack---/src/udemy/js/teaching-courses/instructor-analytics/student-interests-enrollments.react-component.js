import {Button} from '@udemy/react-core-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {DEFAULT_DATA_SCOPE_FILTER, MKINSIGHTS_URL} from './constants';
import StudentEnrollments from './student-enrollments.react-component';
import StudentInterests from './student-interests.react-component';
import './instructor-analytics.less';

@inject('store')
@observer
export default class StudentInterestsEnrollments extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        dataScope: PropTypes.string,
    };

    static defaultProps = {
        dataScope: DEFAULT_DATA_SCOPE_FILTER,
    };

    renderNoInterestsNoCourses() {
        return (
            <div styleName="no-data">
                <h3>{gettext('No data yet...')}</h3>
                <p
                    styleName="no-data-subtitle"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'student-interests-enrollments:mkinsights-link',
                        html: interpolate(
                            gettext(
                                'Check back soon to see what other topics your students are enrolling in. In the meantime, ' +
                                    'check out %(linkOpenTag)s Marketplace Insights%(linkCloseTag)s, a tool that lets you gauge student interest across ' +
                                    'our entire marketplace.',
                            ),
                            {
                                linkOpenTag: `<a class="ud-link-underline" href="${MKINSIGHTS_URL}">`,
                                linkCloseTag: '</a>',
                            },
                            true,
                        ),
                    })}
                />
                <Button
                    componentClass="a"
                    href={MKINSIGHTS_URL}
                    udStyle="secondary"
                    styleName="no-data-cta"
                >
                    {gettext('Go to Marketplace Insights')}
                </Button>
            </div>
        );
    }

    render() {
        const {interests, enrollments} = this.props.store.studentStore;
        return (
            <div data-purpose="student-interests-enrollments">
                <div styleName="heading">
                    <h2 className="ud-heading-lg">{gettext('Additional student interests')}</h2>
                </div>
                {interests.metrics.length === 0 && enrollments.courses.length === 0 ? (
                    this.renderNoInterestsNoCourses()
                ) : (
                    <>
                        <StudentInterests dataScope={this.props.dataScope} />
                        <StudentEnrollments />
                    </>
                )}
            </div>
        );
    }
}
