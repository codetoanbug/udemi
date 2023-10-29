import AssignmentIcon from '@udemy/icons/dist/assignment.ud-icon';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPathStore from 'learning-path/learning-path.mobx-store';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import './assessment-autosuggest.less';

@inject('learningPathStore')
@observer
export default class AssessmentAutosuggestResult extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        assessment: PropTypes.shape({
            id: PropTypes.string,
            title: PropTypes.string,
            slug: PropTypes.string,
            description: PropTypes.string,
        }).isRequired,
    };

    render() {
        const {assessment, learningPathStore} = this.props;

        return (
            <span styleName="assessment-card-container" data-purpose="assessment-menu-item">
                {!learningPathStore.isMobileViewportSize && (
                    <span styleName="assessment-icon">
                        <AssignmentIcon label={false} size="large" styleName="icon" />
                    </span>
                )}
                <span styleName="assessment-details">
                    <span
                        className="ud-heading-md"
                        styleName="row title"
                        data-purpose="assessment-title"
                    >
                        {assessment.title}
                    </span>
                    <span
                        className="ud-text-xs"
                        styleName="row description"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'assessment-details:assessment-description',
                            dataPurpose: 'assessment-description',
                            html: `<p>${assessment.description
                                .replace(/<[^>]+(>|$)/g, ' ')
                                .replace(/\s+/g, ' ')
                                .trim()}</p>`,
                        })}
                    />
                </span>
            </span>
        );
    }
}
