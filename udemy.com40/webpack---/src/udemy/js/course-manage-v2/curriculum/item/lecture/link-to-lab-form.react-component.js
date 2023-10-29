import IntersectionObserver from '@researchgate/react-intersection-observer';
import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import {Checkbox} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {Popover} from '@udemy/react-popup-components';
import autobind from 'autobind-decorator';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CurriculumLectureModel from './curriculum-lecture.mobx-model';
import LinkToLabStore from './link-to-lab.mobx-store';

import './link-to-lab.less';

@observer
export default class LinkToLabForm extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumLectureModel).isRequired,
    };

    loadCalled = false;

    @observable
    linkToLabStore = new LinkToLabStore(
        this.props.curriculumItem._class,
        this.props.curriculumItem.id,
        this.props.curriculumItem.course.id,
    );

    loadDataIfInView = ({isIntersecting}) => {
        if (isIntersecting && !this.loadCalled) {
            this.linkToLabStore.loadLabInfo();
            this.loadCalled = true;
        }
    };

    @autobind
    onToggle(event) {
        const {curriculumItem} = this.props;
        if (event.target.checked) {
            this.linkToLabStore.linkToLab(curriculumItem.title);
        } else {
            this.linkToLabStore.unlinkLab(curriculumItem.title);
        }
    }

    render() {
        return (
            <IntersectionObserver onChange={this.loadDataIfInView}>
                <div styleName="link-to-lab" data-purpose="link-to-lab">
                    {this.linkToLabStore.error ? (
                        <AlertBanner
                            showCta={false}
                            udStyle="error"
                            styleName="error"
                            title={gettext('Error fetching Workspace information')}
                        />
                    ) : null}
                    <Checkbox
                        onChange={this.onToggle}
                        disabled={this.linkToLabStore.isLoading}
                        checked={this.linkToLabStore.isLinked}
                    >
                        <span styleName="title">
                            <strong>
                                {gettext('Lecture content is compatible with Workspaces')}
                            </strong>
                            <Popover
                                a11yRole="description"
                                canToggleOnHover={true}
                                placement="bottom"
                                styleName="info-tooltip"
                                trigger={<InfoOutlineIcon label={gettext('Get info')} />}
                            >
                                {gettext(
                                    'This lecture will be highlighted for Udemy Business Pro learners to signal an active learning moment that is compatible with Udemy Workspaces in your course.',
                                )}
                            </Popover>
                        </span>
                    </Checkbox>
                </div>
            </IntersectionObserver>
        );
    }
}
