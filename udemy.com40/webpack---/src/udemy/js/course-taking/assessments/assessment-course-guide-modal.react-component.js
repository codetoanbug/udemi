import {LocalizedHtml} from '@udemy/i18n';
import ImportantIcon from '@udemy/icons/dist/important.ud-icon';
import {Image, Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import udLink from 'utils/ud-link';
import SystemMessage from 'utils/ud-system-message';

import './assessment-course-guide-modal.less';

const HighlightedContent = ({children}) => {
    return (
        <span styleName="highlighted-content">
            <ImportantIcon label={false} color="inherit" styleName="highlighted-icon" />
            {children}
        </span>
    );
};

@observer
export default class AssessmentCourseGuideModal extends React.Component {
    componentDidMount() {
        SystemMessage.hasSeen(SystemMessage.ids.assessmentCourseGuideModal).then(
            action((response) => {
                this.showModal = !response.data;
            }),
        );
    }

    @observable showModal = false;

    @autobind @action onClose() {
        SystemMessage.seen(SystemMessage.ids.assessmentCourseGuideModal);
        this.showModal = false;
    }

    renderTitle() {
        return ['personalized-guidance-modal-title', null];
    }

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.showModal}
                    title=""
                    requireExplicitAction={true}
                    styleName={'course-guide-modal'}
                    renderTitle={this.renderTitle}
                >
                    <Image
                        src={udLink.toStorageStaticAsset('assessments/recommended-for-you.jpg')}
                        srcSet={`${udLink.toStorageStaticAsset(
                            'assessments/recommended-for-you.jpg',
                        )} 1x, ${udLink.toStorageStaticAsset(
                            'assessments/recommended-for-you-2x.jpg',
                        )} 2x`}
                        alt=""
                        width={360}
                        height={270}
                    />
                    <h3 id="personalized-guidance-modal-title">{gettext('Recommended for you')}</h3>
                    <p>
                        <LocalizedHtml
                            html={gettext(
                                'Based on your most recent assessment results in this topic, some sections are <span class="highlight">highlighted</span> for you to focus on.',
                            )}
                            interpolate={{highlight: <HighlightedContent />}}
                        />
                    </p>
                    <Button onClick={this.onClose}>{gettext('Got it')}</Button>
                </Modal>
            </div>
        );
    }
}
