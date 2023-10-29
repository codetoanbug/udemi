import {NewBadge} from '@udemy/browse-course';
import {Tracker} from '@udemy/event-tracking';
import {withI18n} from '@udemy/i18n';
import {Link} from '@udemy/react-core-components';
import {UnitTitle, CourseUnit} from '@udemy/react-discovery-units';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {OccupationModal} from 'occupation/components/occupation-modal/occupation-modal.react-component';
import {OccupationFlowProgressionEvent} from 'occupation/events';
import {OccupationVisibilityStore} from 'occupation/stores/occupation-visibility/occupation-visibility.mobx-store';
import {PERSONALIZE_URL} from 'personalize/constants';

import styles from './occupation-unit.less';

@observer
class OccupationUnit extends Component {
    static propTypes = {
        unit: PropTypes.object.isRequired,
        className: PropTypes.string,
        showSubTitle: PropTypes.bool,
        showNewBadge: PropTypes.bool,
        enableLearnerGoalCollection: PropTypes.bool,
        gettext: PropTypes.func.isRequired,
    };

    static defaultProps = {
        className: undefined,
        showSubTitle: false,
        showNewBadge: false,
        enableLearnerGoalCollection: false,
    };

    constructor(props) {
        super(props);
        this.occupationVisibilityStore = new OccupationVisibilityStore();
    }

    handleClick = () => {
        this.handleEventTracking();
        this.occupationVisibilityStore.openModal();
    };

    handleEventTracking() {
        Tracker.publishEvent(
            new OccupationFlowProgressionEvent({
                progression: 0,
                selection: 'edit',
                selectionType: 'edit',
            }),
        );
    }

    render() {
        /**
         * LIHP and Occupation Result pages render this component, and the component
         * decides to trigger modal via query param or occupationVisibilityStore.
         */
        const {
            unit,
            className,
            enableLearnerGoalCollection,
            showSubTitle,
            showNewBadge,
            gettext,
        } = this.props;
        const occupationUnit = {
            ...unit,
            actionLink: {
                text: gettext('Edit occupation'),
                buttonProps: {
                    className: 'ud-link-underline',
                    componentClass: enableLearnerGoalCollection ? Link : 'button',
                    to: enableLearnerGoalCollection ? PERSONALIZE_URL : undefined,
                    onClick: enableLearnerGoalCollection ? undefined : this.handleClick,
                },
            },
        };

        return (
            <div className={className}>
                <UnitTitle
                    unit={occupationUnit}
                    className={classNames(styles['title-wrapper'], {
                        [styles['bottom-margin']]: !showSubTitle,
                    })}
                />
                {showSubTitle && (
                    <div className={styles['secondary-text']} data-purpose="sub-title">
                        {showNewBadge && <NewBadge />}
                        <span className="ud-text-xs">{gettext('Inspired by your selections')}</span>
                    </div>
                )}
                <OccupationModal occupationVisibilityStore={this.occupationVisibilityStore} />
                <CourseUnit {...this.props} showTitle={false} />
            </div>
        );
    }
}

export default withI18n(OccupationUnit);
