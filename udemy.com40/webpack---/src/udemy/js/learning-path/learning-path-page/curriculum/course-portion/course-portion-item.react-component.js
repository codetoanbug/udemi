import {Duration} from '@udemy/react-date-time-components';
import {Checkbox} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CurriculumItem from 'course-taking/curriculum/curriculum-item.mobx-model';

import CoursePortionModalStore from './course-portion-modal.mobx-store';

import './course-portion-item.less';

@inject('coursePortionModalStore')
@observer
export default class CoursePortionItem extends React.Component {
    static propTypes = {
        coursePortionModalStore: PropTypes.instanceOf(CoursePortionModalStore).isRequired,
        curriculumItem: PropTypes.instanceOf(CurriculumItem).isRequired,
    };

    @autobind
    handleChange(e) {
        this.props.curriculumItem.setIsSelected(e.target.checked);
    }

    renderMetadataRow() {
        // Copied from course-taking
        const item = this.props.curriculumItem;
        const hasDuration = item.asset && item.asset.timeEstimation !== undefined;
        if (!item.iconComponent && !hasDuration) {
            return null;
        }

        return (
            <div styleName="metadata">
                {item.iconComponent && (
                    <span styleName="type">
                        <item.iconComponent label={false} size="xsmall" />
                    </span>
                )}
                {hasDuration && <Duration numSeconds={item.asset.timeEstimation} />}
            </div>
        );
    }

    render() {
        const {isSelected, displayTitle} = this.props.curriculumItem;
        const {isReadOnly} = this.props.coursePortionModalStore;

        return (
            <div styleName="container">
                <Checkbox
                    checked={isSelected}
                    onChange={this.handleChange}
                    disabled={isReadOnly}
                    title="item-checkbox"
                >
                    <div styleName="content">
                        <div styleName="title">{displayTitle}</div>
                        {this.renderMetadataRow()}
                    </div>
                </Checkbox>
            </div>
        );
    }
}
