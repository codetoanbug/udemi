import UdemySymbolIcon from '@udemy/icons/dist/udemy-symbol.ud-icon';
import {Duration} from '@udemy/react-date-time-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {EDITABLE_TYPES} from '../../constants';
import EditableText from '../../editable-text.react-component';
import LearningPathSectionItem from '../../learning-path-section-item.mobx-model';
import {isPathItemGoingToBeRetired} from '../../utils';
import {
    ASSESSMENT_CONTENT_TYPE,
    CONTENT_TYPE_CONFIG,
    COURSE_EDITABLE_CONTENT_TYPES,
    LAB_CONTENT_TYPE,
} from '../constants';
import ItemEditContent from './item-edit-content.react-component';

import './item-meta.less';

@observer
export default class ItemMeta extends React.Component {
    static propTypes = {
        item: PropTypes.instanceOf(LearningPathSectionItem).isRequired,
        isEditModeEnabled: PropTypes.bool.isRequired,
        isMobileViewportSize: PropTypes.bool.isRequired,
    };

    get firstItem() {
        const {numItems, numSelectedItems} = this.props.item.content;
        if (this.props.isMobileViewportSize) {
            return ninterpolate(
                '%(numSelectedItems)s / %(numItems)s item',
                '%(numSelectedItems)s / %(numItems)s items',
                numSelectedItems,
                {
                    numItems,
                    numSelectedItems,
                },
            );
        }
        return ninterpolate(
            '%(numSelectedItems)s of %(numItems)s item',
            '%(numSelectedItems)s of %(numItems)s items',
            numSelectedItems,
            {
                numItems,
                numSelectedItems,
            },
        );
    }

    renderCourseMeta() {
        const {isEditModeEnabled, isMobileViewportSize, item} = this.props;
        const {duration} = item;

        const isRetiredItemClass = classNames({
            'item--retired': isPathItemGoingToBeRetired(item),
        });

        return (
            <>
                <li styleName="icon item--no-decoration">
                    <UdemySymbolIcon size="small" label={false} />
                </li>
                <li styleName="item--no-decoration" className={isRetiredItemClass}>
                    {this.firstItem}
                </li>
                {isEditModeEnabled && (
                    <li
                        styleName="item--no-decoration edit-content-container"
                        className={isRetiredItemClass}
                    >
                        <ItemEditContent isMobileViewPortSize={isMobileViewportSize} item={item} />
                    </li>
                )}
                {!isMobileViewportSize && !!duration && (
                    <li className={isRetiredItemClass}>
                        <Duration numSeconds={duration * 60} />
                    </li>
                )}
            </>
        );
    }

    renderAssessmentMeta() {
        const {isMobileViewportSize, item} = this.props;
        const {duration} = item;

        return (
            <>
                <li styleName="icon item--no-decoration">
                    <UdemySymbolIcon size="small" label={false} />
                </li>
                <li styleName="item--no-decoration">{gettext('Assessment')}</li>
                {!isMobileViewportSize && !!duration && (
                    <li>
                        <Duration numSeconds={duration * 60} />
                    </li>
                )}
            </>
        );
    }

    renderLabMeta() {
        const {isMobileViewportSize, item} = this.props;
        const {duration} = item;

        return (
            <>
                <li styleName="icon item--no-decoration">
                    <UdemySymbolIcon size="small" label={false} />
                </li>
                <li styleName="item--no-decoration">{gettext('Lab')}</li>
                {!isMobileViewportSize && !!duration && (
                    <li>
                        <Duration numSeconds={duration * 60} />
                    </li>
                )}
            </>
        );
    }

    renderResourceMeta() {
        const {isEditModeEnabled, item} = this.props;
        const {type, duration, content, setContentLength} = item;

        return (
            <>
                <li styleName="type item--no-decoration">{CONTENT_TYPE_CONFIG[type].title}</li>
                <li styleName="resource-duration-container">
                    {isEditModeEnabled ? (
                        <>
                            <EditableText
                                placeholder="0"
                                shouldSavePlaceholderAsValue={true}
                                styleName="editable-resource-duration"
                                elementType="span"
                                id={`resource-duration-${content.id}`}
                                value={Number(duration).toString()}
                                onChange={setContentLength}
                                type={EDITABLE_TYPES.NUMBER}
                            />
                            {pgettext('Abbreviation for minutes', 'min')}
                        </>
                    ) : (
                        <Duration numSeconds={duration * 60} />
                    )}
                </li>
            </>
        );
    }

    render() {
        const {type} = this.props.item;
        const isCourse = COURSE_EDITABLE_CONTENT_TYPES.includes(type);

        let itemMeta;

        if (isCourse) {
            itemMeta = this.renderCourseMeta();
        } else if (type === ASSESSMENT_CONTENT_TYPE) {
            itemMeta = this.renderAssessmentMeta();
        } else if (type === LAB_CONTENT_TYPE) {
            itemMeta = this.renderLabMeta();
        } else {
            itemMeta = this.renderResourceMeta();
        }

        const styleName = classNames({
            container: true,
            'container--resource': !isCourse,
        });
        return (
            <div className="ud-text-sm" styleName={styleName}>
                <ul styleName="item-data" className="ud-unstyled-list">
                    {itemMeta}
                </ul>
            </div>
        );
    }
}
