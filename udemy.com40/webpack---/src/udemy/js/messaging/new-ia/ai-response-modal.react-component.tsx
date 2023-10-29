import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {Badge} from '@udemy/react-messaging-components';
import {observer} from 'mobx-react';
import React from 'react';
import './ai-response-modal.less';

interface AIResponseModalProps {
    response: string;
    isOpen?: boolean;
    onPost: () => void;
    onHide: () => void;
}

export const AIResponseModal = observer(
    ({response = 'Anonymous', isOpen = true, onPost, onHide}: AIResponseModalProps) => {
        const betaBadge = <Badge styleName="badge">{'Beta'}</Badge>;
        function shareFeedbackLink() {
            const userId = UD?.me?.id;
            return `https://survey.alchemer.com/s3/7536605/UB-opportunity-page-ICSAT/?user_id=${userId}`;
        }
        return (
            <Modal
                data-purpose="ai-response-modal-component"
                title={null}
                isOpen={isOpen}
                onClose={onHide}
                styleName={'ai-response'}
            >
                <div styleName={'title'}>
                    {'AI generated answer'} {betaBadge}
                    <Button
                        udStyle="link-underline"
                        typography="ud-text-sm"
                        componentClass="a"
                        href={shareFeedbackLink()}
                        target="_blank"
                        size="xsmall"
                    >
                        {'Share feedback'}
                    </Button>
                </div>
                <div data-purpose="description" styleName={'description'}>
                    {
                        'The answer below is generated from your course captions, Q&A forum discussions, and the quiz assessment questions of the course (if applicable). Learners will not see any indication of this answer being created.'
                    }
                </div>
                <div data-purpose="editable-response" styleName={'editable-response-area'}>
                    <div data-purpose="ai-response" styleName={'response-area'}>
                        {response}
                    </div>
                    <div data-purpose="edit">
                        <Button size={'xsmall'} type="button" udStyle="primary">
                            {'Edit answer'}
                        </Button>
                    </div>
                </div>
                <div data-purpose="cancel-or-post" styleName={'cancel-or-post'}>
                    <Button
                        size="small"
                        className="ud-link-neutral"
                        udStyle="ghost"
                        data-purpose="cancel"
                        onClick={onHide}
                    >
                        {'Cancel'}
                    </Button>
                    <Button
                        size="small"
                        type="button"
                        udStyle="primary"
                        onClick={onPost}
                        data-purpose="post"
                    >
                        {'Post'}
                    </Button>
                </div>
            </Modal>
        );
    },
);
