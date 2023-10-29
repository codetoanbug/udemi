import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {
    getAdditionalFeatureDescriptionForVertical,
    getAdditionalUsageTermsForVerticalAndProvider,
    getLearnMoreWorkspacesTextForVertical,
} from 'labs/utils';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import LabsStore from '../labs.mobx-store';

import './messages.less';

@observer
export default class LegalMessage extends React.Component {
    static propTypes = {
        labsStore: PropTypes.instanceOf(LabsStore).isRequired,
    };

    @autobind
    getAdditionalUsageTerms(vertical, provider) {
        const additionalUsageTerms = getAdditionalUsageTermsForVerticalAndProvider(
            vertical,
            provider,
        );
        return (
            <span
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'workspaces-message',
                    html: additionalUsageTerms,
                })}
            />
        );
    }

    render() {
        const {vertical, provider} = this.props.labsStore.labs[0];
        const additionalFeatureDescription = getAdditionalFeatureDescriptionForVertical(vertical);
        const learnMoreAboutWorkspacesText = getLearnMoreWorkspacesTextForVertical(vertical);

        return (
            <div data-purpose="workspaces-legal-message" styleName="legal">
                <h3 styleName="workspaces-message-title" className="ud-heading-md">
                    {gettext('Terms and conditions')}
                </h3>
                <p>
                    {gettext(
                        'With Udemy Workspaces, you’ll be able to practice hands-on activities during this course.',
                    )}{' '}
                    {additionalFeatureDescription}{' '}
                    <span
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'workspaces-message',
                            html: learnMoreAboutWorkspacesText,
                        })}
                    />
                </p>
                <p>
                    {gettext(
                        'Be sure to only use Workspaces for the activities specified in this course.',
                    )}{' '}
                    {this.getAdditionalUsageTerms(vertical, provider)}
                </p>
            </div>
        );
    }
}
