import {onEscape} from '@udemy/design-system-utils';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import UdemySymbolIcon from '@udemy/icons/dist/udemy-symbol.ud-icon';
import {Avatar, Button, IconButton} from '@udemy/react-core-components';
import {AlertBannerContent} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import {PropTypes} from 'prop-types';
import React from 'react';

import {showErrorToast} from 'organization-common/toasts';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import getRequestData from 'utils/get-request-data';
import udLink from 'utils/ud-link';

import {CHANGE_LOG_TEXT, CHANGE_LOG_ACTION} from '../constants';
import LearningPathStore from '../learning-path.mobx-store';
import {
    COURSE_CONTENT_TYPE,
    COURSE_PORTION_CONTENT_TYPE,
    USER_CONTENT_TYPE,
    ASSESSMENT_CONTENT_TYPE,
    ASSESSMENT_COLLECTION_BASE_PATH,
    HISTORY_LOG_LAUNCH_DATE,
    LAB_CONTENT_TYPE,
    LEARNING_PATH_ERROR_MESSAGES,
} from './constants';

import './history-log-panel.less';

@inject('learningPathStore')
@observer
export default class HistoryLogPanel extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        isHistoryLogLoadingError: PropTypes.bool.isRequired,
        isHistoryLogVisible: PropTypes.bool.isRequired,
    };

    componentDidUpdate() {
        if (this.props.isHistoryLogVisible) {
            this.logRef.focus();
            if (this.props.isHistoryLogLoadingError) {
                showErrorToast(LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_EDIT_HISTORY);
            }
        }
    }

    /**
     * Returns fully interpolated message to display for the given log
     * @param {*} log
     */
    getLogText(log) {
        const logText = CHANGE_LOG_TEXT[log.action];

        if (logText) {
            // named fields for the placeholders for in formatted logText message
            const formatArgs = {};
            if (log.user_details) {
                formatArgs.user_name = `<b>${log.user_details.display_name}</b>`;
            }

            // add to the interpolateArgs, the args for formatting strings related to courses
            const relatedObject = log.related_object;
            const relatedObjectType = log.related_object_type;
            if (relatedObject && relatedObjectType) {
                if (relatedObjectType === COURSE_CONTENT_TYPE) {
                    formatArgs.course = this.getRelatedSectionItemTitleText(relatedObject);
                } else if (relatedObjectType === COURSE_PORTION_CONTENT_TYPE) {
                    formatArgs.course = this.getRelatedSectionItemTitleText(relatedObject.course);
                } else if (relatedObjectType === USER_CONTENT_TYPE) {
                    formatArgs.new_editor = `<span>${relatedObject.display_name}</span>`;
                } else if (relatedObjectType === ASSESSMENT_CONTENT_TYPE) {
                    relatedObject.url = `${ASSESSMENT_COLLECTION_BASE_PATH}${relatedObject.slug}/`;
                    formatArgs.assessment = this.getRelatedSectionItemTitleText(relatedObject);
                } else if (relatedObjectType === LAB_CONTENT_TYPE) {
                    formatArgs.lab = this.getRelatedSectionItemTitleText(relatedObject);
                }
            }
            return interpolate(logText, formatArgs, true);
        }
    }

    getRelatedSectionItemTitleText(relatedItemObj) {
        return `<a href="${relatedItemObj.url}">${relatedItemObj.title}</a>`;
    }

    renderLaunchDate(date) {
        const locale = getRequestData().locale.replace('_', '-') || 'en-US';
        const dateOptions = {year: 'numeric', month: 'short', day: 'numeric'};
        return date.toLocaleDateString(locale, dateOptions);
    }

    renderLogDate(date) {
        const locale = getRequestData().locale.replace('_', '-') || 'en-US';
        const dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
        const dateString = date.toLocaleDateString(locale, dateOptions);
        const timeOptions = {hour: 'numeric', minute: 'numeric'};
        const timeString = date.toLocaleTimeString(locale, timeOptions);
        return `${dateString} ${timeString}`;
    }

    renderAlertEmptyLogs() {
        const launchDate = this.renderLaunchDate(HISTORY_LOG_LAUNCH_DATE);

        // using AlertBannerContent because the Alert component dismiss by default after clicking on the action button
        return (
            <AlertBannerContent
                udStyle="information"
                title={interpolate(
                    gettext('Edits made prior to %(launchDate)s are not listed.'),
                    {launchDate},
                    true,
                )}
                body={gettext('Edits done to the path by editors will be tracked here')}
                dismissButtonProps={false}
                ctaText={gettext('Learn more')}
                actionButtonProps={{
                    href: udLink.toSupportLink('history_log', true),
                    componentClass: 'a',
                    target: '_blank',
                }}
                styleName="alert-empty-log"
            />
        );
    }

    udemyActionLogDetails(logText, dateCreated, action) {
        const isCourseCollectionUpdate = [
            CHANGE_LOG_ACTION.COURSE_REMOVED,
            CHANGE_LOG_ACTION.COURSE_READDED,
        ].includes(action);
        return (
            <div data-purpose="system-action" styleName="history-log-item">
                <UdemySymbolIcon size="large" label={false} />
                <div styleName="history-log-item-content">
                    <div
                        className="ud-text-sm ud-text-with-links"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'learning-path-history-log:log-item',
                            html: logText,
                        })}
                    />
                    <div className="ud-text-xs" styleName="created-date">
                        {this.renderLogDate(dateCreated)}
                    </div>
                    {isCourseCollectionUpdate && (
                        <div styleName="learn-more-button" data-purpose="learn-more-button">
                            <Button
                                componentClass="a"
                                size="small"
                                udStyle="secondary"
                                href={udLink.toSupportLink('course_removal', true)}
                                target="_blank"
                            >
                                {gettext('Learn more')}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    userActionLogDetails(logText, dateCreated, userDetails) {
        return (
            <div data-purpose="user-action" styleName="history-log-item">
                <Avatar size="small" user={userDetails} alt="DISPLAY_NAME" />
                <div styleName="history-log-item-content">
                    <div
                        className="ud-text-sm ud-text-with-links"
                        styleName="user-action-log-text"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'learning-path-history-log:log-item',
                            html: logText,
                        })}
                    />
                    <div className="ud-text-xs" styleName="created-date">
                        {this.renderLogDate(dateCreated)}
                    </div>
                </div>
            </div>
        );
    }

    renderHistoryLogContent() {
        const {
            historyLogs,
            wasPathCreatedBeforeHistoryLogLaunch,
        } = this.props.learningPathStore.learningPath;

        return (
            <>
                {historyLogs.map((log, index) => {
                    const logText = this.getLogText(log);
                    if (!logText) {
                        return null;
                    }

                    const isUdemyActionUpdate = [
                        CHANGE_LOG_ACTION.COURSE_REMOVED,
                        CHANGE_LOG_ACTION.COURSE_READDED,
                        CHANGE_LOG_ACTION.EDITOR_FEATURED_SYSTEM,
                    ].includes(log.action);
                    const dateCreated = new Date(log.created * 1000);
                    const logDetails = isUdemyActionUpdate
                        ? this.udemyActionLogDetails(logText, dateCreated, log.action)
                        : this.userActionLogDetails(logText, dateCreated, log.user_details);
                    return (
                        <div key={index} data-purpose="log">
                            {logDetails}
                        </div>
                    );
                })}
                {wasPathCreatedBeforeHistoryLogLaunch && this.renderAlertEmptyLogs()}
            </>
        );
    }

    @autobind
    hidePanel() {
        this.props.learningPathStore.learningPath.hideHistoryLog();
    }

    @autobind
    onKeyDown(event) {
        onEscape(this.hidePanel)(event);
    }

    render() {
        const isPanelVisible = this.props.isHistoryLogVisible;

        return (
            <div
                styleName={classNames('history-log-wrapper', {
                    visible: isPanelVisible,
                })}
                tabIndex="0"
                onKeyDown={this.onKeyDown}
                ref={(ref) => {
                    this.logRef = ref;
                }}
            >
                <IconButton
                    styleName={classNames('close-button', {
                        visible: isPanelVisible,
                    })}
                    data-purpose="close-btn"
                    round={true}
                    udStyle="white-solid"
                    onClick={this.hidePanel}
                >
                    <CloseIcon color="neutral" label={'close-history-log'} />
                </IconButton>
                <div styleName="history-log">
                    <div className="ud-heading-lg" styleName="history-log-heading">
                        {gettext('Edit history')}
                    </div>
                    {this.props.learningPathStore.learningPath.isHistoryLogLoading ? (
                        <Loader block={true} size="xlarge" />
                    ) : (
                        this.renderHistoryLogContent()
                    )}
                </div>
            </div>
        );
    }
}
