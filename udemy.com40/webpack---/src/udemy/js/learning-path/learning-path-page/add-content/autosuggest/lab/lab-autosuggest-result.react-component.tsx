import LabIcon from '@udemy/icons/dist/labs.ud-icon';
import {inject, observer} from 'mobx-react';
import React from 'react';

import LearningPathStore from 'learning-path/learning-path.mobx-store';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {LabType} from './types';
import './lab-autosuggest.less';

interface LabAutosuggestResultProps {
    learningPathStore: LearningPathStore;
    lab: LabType;
}

@inject('learningPathStore')
@observer
export class LabAutosuggestResult extends React.Component<LabAutosuggestResultProps> {
    static defaultProps = {
        learningPathStore: LearningPathStore,
    };

    render() {
        const {lab, learningPathStore} = this.props;

        return (
            <span styleName="lab-card-container" data-purpose="lab-menu-item">
                {!learningPathStore.isMobileViewportSize && (
                    <span styleName="lab-icon">
                        <LabIcon label={false} size="large" styleName="icon" />
                    </span>
                )}
                <span styleName="lab-details">
                    <span className="ud-heading-md" styleName="row title" data-purpose="lab-title">
                        {lab.title}
                    </span>
                    {lab.labOverview && (
                        <span
                            className="ud-text-xs"
                            styleName="row description"
                            {...safelySetInnerHTML({
                                descriptionOfCaller: 'lab-details:lab-description',
                                dataPurpose: 'lab-description',
                                html: `<p>${lab.labOverview
                                    .replace(/<[^>]+(>|$)/g, ' ')
                                    .replace(/\s+/g, ' ')
                                    .trim()}</p>`,
                            })}
                        />
                    )}
                </span>
            </span>
        );
    }
}
