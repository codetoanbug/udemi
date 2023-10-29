import LightBulbIcon from '@udemy/icons/dist/lightbulb.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import udIntercom from 'utils/ud-intercom';

import LearningPathStore from '../learning-path.mobx-store';
import {TIPS_INTERCOM_TOUR_ID} from './constants';
import styles from './header.less';
import pageEventTracker from './page-event-tracker';

@inject('learningPathStore')
@observer
export default class LearningPathHeader extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        isCreatingPath: PropTypes.bool,
    };

    static defaultProps = {
        isCreatingPath: false,
    };

    componentDidMount() {
        const {learningPathStore, isCreatingPath} = this.props;
        if (isCreatingPath && learningPathStore.isEditModeEnabled) {
            // focus on title after creation
            this._autoFocusInput(this.titleInputRef);
        }
    }

    handleTipsIconClick() {
        pageEventTracker.tipsIconClicked();

        // Tour is created on the Intercom platform here https://app.intercom.io/a/apps/sehj53dd/tours/881984
        return udIntercom.get({root: window}).then((intercom) => {
            intercom('startTour', TIPS_INTERCOM_TOUR_ID);
        });
    }

    _autoFocusInput(inputRef) {
        inputRef && inputRef.focus();
    }

    @autobind
    setTitleInputRef(ref) {
        this.titleInputRef = ref;
    }

    renderEditMode() {
        const {title, description} = this.props.learningPathStore.learningPath;
        const {isTabletViewportSize} = this.props.learningPathStore;
        return (
            <div className={styles['header-edit-view']} data-purpose="header-edit-view">
                <div data-purpose="path-header">
                    <h1 className={classNames('ud-heading-serif-xxl', styles.title)}>{title}</h1>
                    {description && (
                        <p className="ud-text-md" styleName="description">
                            {description}
                        </p>
                    )}
                </div>
                {!isTabletViewportSize && (
                    <IconButton
                        round={true}
                        udStyle="secondary"
                        onClick={this.handleTipsIconClick}
                        data-purpose="tips-icon"
                    >
                        <LightBulbIcon label={gettext('Onboarding tips')} size="large" />
                    </IconButton>
                )}
            </div>
        );
    }

    renderViewMode() {
        const {title, description} = this.props.learningPathStore.learningPath;
        return (
            <div data-purpose="path-header">
                <h1 className={classNames('ud-heading-serif-xxl', styles.title)}>{title}</h1>
                {description && (
                    <p className={classNames('ud-text-md', styles.description)}>{description}</p>
                )}
            </div>
        );
    }

    render() {
        return this.props.learningPathStore.isEditModeEnabled
            ? this.renderEditMode()
            : this.renderViewMode();
    }
}
