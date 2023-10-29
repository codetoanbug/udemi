import {RelativeDuration} from '@udemy/react-date-time-components';
import PropTypes from 'prop-types';
import React from 'react';

import {ITEM_TYPES} from '../../../curriculum/constants';
import ItemLink from '../../../curriculum/item-link.react-component';
import './question-metadata.less';

export default class QuestionMetadata extends React.Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        curriculumItem: PropTypes.object,
        created: PropTypes.string,
    };

    static defaultProps = {
        curriculumItem: undefined,
        created: undefined,
    };

    get userLink() {
        const {user} = this.props;
        if (user.isBanned) {
            return <span data-purpose="user-tag">{gettext('Udemy User')}</span>;
        }
        return (
            <a href={user.url} target="_blank" rel="noopener noreferrer" data-purpose="user-tag">
                {user.name}
            </a>
        );
    }

    get relatedCurriculumItemLink() {
        const {curriculumItem} = this.props;
        let titleWithIndex;

        switch (curriculumItem.type) {
            case ITEM_TYPES.LECTURE:
                titleWithIndex = interpolate(
                    gettext('Lecture %(lectureNum)s'),
                    {lectureNum: curriculumItem.objectIndex},
                    true,
                );
                break;
            case ITEM_TYPES.QUIZ:
                titleWithIndex = interpolate(
                    gettext('Quiz %(quizNum)s'),
                    {quizNum: curriculumItem.objectIndex},
                    true,
                );
                break;
            case ITEM_TYPES.PRACTICE:
                titleWithIndex = interpolate(
                    gettext('Assignment %(assignmentNum)s'),
                    {assignmentNum: curriculumItem.objectIndex},
                    true,
                );
                break;
            default:
                return null;
        }

        return (
            <ItemLink
                itemType={curriculumItem.type}
                itemId={curriculumItem.id}
                data-purpose="item-link"
            >
                {titleWithIndex}
            </ItemLink>
        );
    }

    render() {
        return (
            <div className="ud-text-xs ud-text-with-links" styleName="metadata">
                {this.userLink}
                {this.props.curriculumItem && (
                    <>
                        {' \u00b7 '}
                        {this.relatedCurriculumItemLink}
                    </>
                )}
                {this.props.created && (
                    <>
                        {' \u00b7 '}
                        <RelativeDuration datetime={this.props.created} />
                    </>
                )}
            </div>
        );
    }
}
