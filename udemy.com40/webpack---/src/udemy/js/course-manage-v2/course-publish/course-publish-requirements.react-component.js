import {LocalizedHtml} from '@udemy/i18n';
import {observer, PropTypes as mobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import escapeHtml from 'utils/escape/escape-html';

import {COMPLETE_THESE_STEPS, ALMOST_READY, SUPPORT_PAGE_LINK} from './constants';

const ErrorList = ({errorMessages}) => (
    <ul data-purpose="error-message">
        {errorMessages.map((errorMessage, id) => (
            <li key={id}>{errorMessage}</li>
        ))}
    </ul>
);
ErrorList.propTypes = {
    errorMessages: mobxTypes.arrayOrObservableArray.isRequired,
};

const RequirementErrors = ({missingPublishRequirements}) => (
    <ul className="ud-text-with-links">
        {Object.keys(missingPublishRequirements)
            .filter((requirement) => !!missingPublishRequirements[requirement].error_messages)
            .map((requirement, index) => (
                <li key={index}>
                    <p>
                        <LocalizedHtml
                            html={interpolate(
                                gettext(
                                    'On the <a class="pageLink">%(pageName)s</a> page, you must',
                                ),
                                {pageName: escapeHtml(requirement)},
                                true,
                            )}
                            interpolate={{
                                pageLink: (
                                    <a
                                        href={missingPublishRequirements[requirement].url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    />
                                ),
                            }}
                        />
                    </p>
                    <ErrorList
                        data-purpose="error-list"
                        errorMessages={missingPublishRequirements[requirement].error_messages}
                    />
                </li>
            ))}
    </ul>
);
RequirementErrors.propTypes = {
    missingPublishRequirements: PropTypes.object.isRequired,
};

@observer
export default class CoursePublishRequirements extends Component {
    static propTypes = {
        missingPublishRequirements: PropTypes.object.isRequired,
    };

    render() {
        return (
            <>
                <p data-purpose="publish-almost-ready">{ALMOST_READY}</p>
                <RequirementErrors
                    missingPublishRequirements={this.props.missingPublishRequirements}
                />
                <p>{COMPLETE_THESE_STEPS}</p>
                <p className="ud-text-with-links">
                    <LocalizedHtml
                        data-purpose="publish-support-link"
                        html={gettext(
                            'Still having problems? <a class="pageLink">Check out this Support page</a>',
                        )}
                        interpolate={{
                            pageLink: (
                                <a
                                    href={SUPPORT_PAGE_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                        }}
                    />
                </p>
            </>
        );
    }
}
