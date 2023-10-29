import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import React from 'react';

import './section-topic.less';

import {TopicModel} from './topic.mobx-model';

interface SectionTopicProps {
    topic: TopicModel;
    locked?: boolean;
    onDelete: (topic: TopicModel) => void;
    onAdd: (topic: TopicModel) => void;
}

export class SectionTopic extends React.Component<SectionTopicProps> {
    @autobind
    addTopic(event: React.MouseEvent) {
        event.preventDefault();
        this.props.onAdd(this.props.topic);
    }

    @autobind
    deleteTopic(event: React.MouseEvent) {
        event.preventDefault();
        this.props.onDelete(this.props.topic);
    }

    render() {
        let clickAction, icon;
        const name = <span styleName="ellipsis">{this.props.topic.defaultName}</span>;
        if (!this.props.locked) {
            icon = <CloseIcon label={gettext('Deselect')} />;
            clickAction = this.deleteTopic;
        }

        return (
            <Button
                componentClass={clickAction ? 'button' : 'div'}
                round={true}
                size="small"
                styleName="section-topic"
                data-purpose={`topic-id-${this.props.topic.id}`}
                onClick={clickAction}
            >
                {name}
                {icon}
            </Button>
        );
    }
}
