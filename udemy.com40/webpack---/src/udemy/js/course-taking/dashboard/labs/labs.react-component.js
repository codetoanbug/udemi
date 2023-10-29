import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import requires from 'course-taking/registry/requires.js';
import {USER_TYPES} from 'labs/constants';
import {LAYOUT_COURSE_TAKING} from 'labs/lab-launcher/constants';
import LabLauncherStore from 'labs/lab-launcher/lab-launcher.mobx-store';
import LabLauncher from 'labs/lab-launcher/lab-launcher.react-component';
import {LabVerticalSystemEvent} from 'labs/system-event/lab-vertical-system-event.react-component';
import SystemMessage from 'utils/ud-system-message';

import CourseTakingStore from '../../course-taking.mobx-store';
import './labs.less';
import LabsStore from './labs.mobx-store';
import FeedbackAlert from './messages/feedback-alert.react-component';
import LegalMessage from './messages/legal-message.react-component';
import NearingUsageLimitAlert from './messages/nearing-usage-limit-alert.react-component';
import OptimizeUsageMessage from './messages/optimize-usage-message.react-component';
import OutOfResourcesAlert from './messages/out-of-resources-alert.react-component';
import WorkspaceCompatibleLecturesMessage from './messages/workspace-compatible-lectures-message.react-component';

@requires('courseTakingStore')
@observer
export default class Labs extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.instanceOf(CourseTakingStore).isRequired,
        labsStore: PropTypes.instanceOf(LabsStore).isRequired,
        labLauncherStore: PropTypes.instanceOf(LabLauncherStore),
    };

    static defaultProps = {
        labLauncherStore: undefined,
    };

    componentDidMount() {
        SystemMessage.hasSeen(SystemMessage.ids.hasSeenLabsAlmostOutOfResourcesNotification).then(
            action((response) => {
                if (!response.data) {
                    this.props.labsStore.setHasSeenLabsAlmostOutOfResourcesNotification(false);
                }
            }),
        );
    }

    @autobind
    setIsLabOutOfResources(value = true) {
        this.props.labsStore.setIsLabOutOfResources(value);
    }

    @autobind
    setIsLabAlmostOutOfResources(value = true) {
        this.props.labsStore.setIsLabAlmostOutOfResources(value);
    }

    render() {
        if (this.props.courseTakingStore.isLoading || this.props.labsStore.isLoading) {
            return <Loader block={true} size="xxlarge" data-purpose="lab-loader" />;
        }
        return (
            <div>
                {this.props.labsStore.hasLabs && (
                    <LabVerticalSystemEvent
                        store={this.props.labsStore.labVerticalSystemEventStore}
                        layout="banner"
                    />
                )}
                {this.props.labsStore.allWorkspaceEnabledLectures?.length > 0 && (
                    <WorkspaceCompatibleLecturesMessage />
                )}
                <div styleName="labs">
                    {this.props.labsStore?.labs?.length > 0 &&
                        this.props.labsStore.labs.map((lab) => {
                            return (
                                !this.props.labsStore?.isLabOutOfResources && (
                                    <LabLauncher
                                        userType={USER_TYPES.STUDENT}
                                        lab={lab}
                                        layout={LAYOUT_COURSE_TAKING}
                                        setIsLabOutOfResources={this.setIsLabOutOfResources}
                                        setIsLabAlmostOutOfResources={
                                            this.setIsLabAlmostOutOfResources
                                        }
                                        key={lab.id}
                                        labLauncherStore={this.props.labLauncherStore}
                                    />
                                )
                            );
                        })}
                </div>
                {this.props.labsStore.isLabAlmostOutOfResources &&
                    !this.props.labsStore.hasSeenLabsAlmostOutOfResourcesNotification && (
                        <NearingUsageLimitAlert labsStore={this.props.labsStore} />
                    )}
                {!this.props.labsStore?.isLabOutOfResources && (
                    <OptimizeUsageMessage labsStore={this.props.labsStore} />
                )}
                {this.props.labsStore?.labs.length > 0 &&
                    this.props.labsStore?.isLabOutOfResources && (
                        <OutOfResourcesAlert labsStore={this.props.labsStore} />
                    )}
                <LegalMessage labsStore={this.props.labsStore} />
                <FeedbackAlert
                    labsStore={this.props.labsStore}
                    currentCurriculumItemType={
                        this.props.courseTakingStore.currentCurriculumItemType
                    }
                    currentCurriculumItemId={this.props.courseTakingStore.currentCurriculumItemId}
                />
            </div>
        );
    }
}
