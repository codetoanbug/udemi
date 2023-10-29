import CollapseIcon from '@udemy/icons/dist/collapse.ud-icon';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Duration} from '@udemy/react-date-time-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import EditableText from '../../editable-text.react-component';
import LearningPathSection from '../../learning-path-section.mobx-model';
import {
    SECTION_TITLE_PLACEHOLDER,
    DESCRIPTION_PLACEHOLDER,
    LEARNING_PATH_TITLE_MAXLENGH,
} from '../constants';
import OrderBar from './order-bar.react-component';

import './section.less';

@inject('learningPathStore')
@observer
export default class SectionCard extends React.Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        section: PropTypes.instanceOf(LearningPathSection).isRequired,
        learningPathStore: PropTypes.shape({
            isEditModeEnabled: PropTypes.bool.isRequired,
        }).isRequired,
    };

    @autobind
    toggleExpanded() {
        const {section} = this.props;
        return section.toggleExpanded();
    }

    renderSummaryPanel() {
        const {itemsCount, totalDuration, isExpanded} = this.props.section;
        const ToggleIcon = isExpanded ? ExpandIcon : CollapseIcon;
        return (
            <Button
                className="no-drag ud-text-md"
                styleName="expand-button"
                udStyle="ghost"
                onClick={this.toggleExpanded}
            >
                <ToggleIcon
                    size="medium"
                    label={isExpanded ? gettext('Collapse') : gettext('Expand')}
                />
                <span data-purpose="section-summary">
                    <span styleName="items-number">
                        {ninterpolate('%(itemsCount)s item', '%(itemsCount)s items', itemsCount, {
                            itemsCount,
                        })}
                    </span>
                    <Duration
                        data-purpose="learning-path-duration"
                        styleName="duration"
                        // Total duration is in minutes - component only accepts seconds so need to * 60
                        numSeconds={totalDuration * 60}
                    />
                </span>
            </Button>
        );
    }

    renderEditMode() {
        const {learningPathStore, section} = this.props;
        const {id, title, description, setTitle, setDescription} = section;

        return (
            <>
                <div>
                    <EditableText
                        placeholder={SECTION_TITLE_PLACEHOLDER.TEXT}
                        className={
                            learningPathStore.isMobileViewportSize
                                ? 'ud-heading-lg'
                                : 'ud-heading-xl'
                        }
                        styleName="title"
                        elementType="h2"
                        value={title}
                        id={`section-title-${id}`}
                        onChange={setTitle}
                        shouldSavePlaceholderAsValue={true}
                        maxLength={LEARNING_PATH_TITLE_MAXLENGH}
                    />
                    <EditableText
                        placeholder={DESCRIPTION_PLACEHOLDER.TEXT}
                        styleName="description"
                        elementType="p"
                        id={`section-title-${id}`}
                        value={description}
                        onChange={setDescription}
                    />
                    {this.renderSummaryPanel()}
                </div>
            </>
        );
    }

    renderViewMode() {
        const {learningPathStore, section} = this.props;
        const {title, description} = section;
        return (
            <>
                <h2
                    className={
                        learningPathStore.isMobileViewportSize ? 'ud-heading-lg' : 'ud-heading-xl'
                    }
                    styleName="title"
                >
                    {title}
                </h2>
                {description && <p styleName="description">{description}</p>}
                {this.renderSummaryPanel()}
            </>
        );
    }

    render() {
        const {isEditModeEnabled} = this.props.learningPathStore;

        return (
            <div styleName="card-wrapper">
                <OrderBar index={this.props.index} text={`${this.props.index + 1}`} />
                <div styleName="card-container" aria-label={gettext('Section card')}>
                    {isEditModeEnabled ? this.renderEditMode() : this.renderViewMode()}
                </div>
            </div>
        );
    }
}
