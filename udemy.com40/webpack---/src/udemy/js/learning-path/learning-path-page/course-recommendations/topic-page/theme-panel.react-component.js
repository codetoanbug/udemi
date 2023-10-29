import {Image} from '@udemy/react-core-components';
import {Accordion} from '@udemy/react-reveal-components';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {addDefaultSrc} from '../utils';
import TopicPanel from './topic-panel.react-component';

import '../course-recommendations.less';

@observer
export default class ThemePanel extends React.Component {
    static propTypes = {
        groupedTopics: PropTypes.array.isRequired,
    };

    @computed get title() {
        const [first] = this.props.groupedTopics;
        return first?.themeTitle;
    }

    @computed get imageUrl() {
        const [first] = this.props.groupedTopics;
        return first?.themeImageUrl;
    }

    @computed get description() {
        const [first] = this.props.groupedTopics;
        return first?.themeDescription;
    }

    render() {
        const {groupedTopics} = this.props;

        return (
            <div>
                <div styleName="theme-header">
                    <Image
                        styleName="theme-image"
                        src={this.imageUrl}
                        alt={this.title}
                        width={84}
                        height={84}
                        onError={addDefaultSrc}
                    />
                    <div>
                        <h2 className="ud-heading-lg">{this.title}</h2>
                        <p styleName="theme-description">{this.description}</p>
                    </div>
                </div>
                <Accordion size="medium">
                    {groupedTopics.map((topic, i) => {
                        return <TopicPanel topic={topic} key={`topic-${i}`} />;
                    })}
                </Accordion>
            </div>
        );
    }
}
