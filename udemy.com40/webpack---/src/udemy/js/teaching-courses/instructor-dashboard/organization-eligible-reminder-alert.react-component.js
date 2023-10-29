import {LocalizedHtml} from '@udemy/i18n';
import {Link} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import escapeHtml from 'utils/escape/escape-html';
import SystemMessage from 'utils/ud-system-message';

@observer
export default class OrganizationEligibleReminderAlert extends Component {
    static propTypes = {
        course: PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            show_organization_eligible_reminder: PropTypes.bool.isRequired,
        }).isRequired,
    };

    @autobind
    onAction() {
        SystemMessage.seen(SystemMessage.ids.organizationEligibleReminder, {
            obj_id: this.props.course.id,
            obj_type: 'course',
        });
    }

    render() {
        if (!this.props.course.show_organization_eligible_reminder) {
            return null;
        }

        return (
            <AlertBanner
                ctaText={gettext('Dismiss')}
                dismissButtonProps={false}
                onAction={this.onAction}
                title={ngettext(
                    'Please ensure your course meets Udemy Business requirements.',
                    'Please ensure your courses meet Udemy Business requirements.',
                    1,
                )}
                body={
                    <LocalizedHtml
                        html={interpolate(
                            gettext(
                                '<p>As a reminder, you have opted in to the Udemy Business program, which ' +
                                    'means %(course)s is eligible for inclusion in a subscription-based ' +
                                    'course collection used by hundreds of companies. (Note that opting in ' +
                                    'to these programs does not guarantee participation.)</p><p>Please ' +
                                    'ensure this course meets our <a class="exclusivityRequirementsLink">' +
                                    'exclusivity requirements</a> and that you are aware of the <a class=' +
                                    '"terminationRequirementsLink">termination requirements</a>. If it ' +
                                    'does not, please use the ineligibility form in your ' +
                                    '<a class="courseSettingsLink">course settings</a> to let us know.</p>',
                            ),
                            {course: escapeHtml(this.props.course.title)},
                            true,
                        )}
                        interpolate={{
                            exclusivityRequirementsLink: (
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ud-link-underline"
                                    href="https://support.udemy.com/hc/en-us/articles/115013339928#ufb-en"
                                />
                            ),
                            terminationRequirementsLink: (
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ud-link-underline"
                                    href="https://support.udemy.com/hc/en-us/articles/115013339928#ufb-en"
                                />
                            ),
                            courseSettingsLink: (
                                <Link
                                    className="ud-link-underline"
                                    to={`/course/${this.props.course.id}/manage/settings/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                        }}
                    />
                }
            />
        );
    }
}
