import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {FormGroup} from '@udemy/react-form-components';
import {Popover} from '@udemy/react-popup-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {SectionHasTopicStore} from './section-has-topic.mobx-store';
import {SectionTopics} from './section-topics.react-component';
import './section-topic-form-input.less';

interface SectionTopicFormInputProps {
    sectionHasTopicStore: SectionHasTopicStore;
}

@observer
export class SectionTopicFormInput extends React.Component<SectionTopicFormInputProps> {
    renderTopic(descriptionOfCaller: string, html: string, icon: React.ReactElement) {
        return (
            <span styleName={classNames({'topic-with-icon': !!icon})}>
                <span {...safelySetInnerHTML({descriptionOfCaller, html})} />
                {icon && <span styleName="icon-container">{icon}</span>}
            </span>
        );
    }

    renderTooltip() {
        return (
            <Popover
                a11yRole="description"
                canToggleOnHover={true}
                placement="right"
                trigger={<InfoIcon label={gettext('Get info')} />}
            >
                <div className="ud-text-sm ud-text-with-links">
                    {gettext(
                        'The section topic should communicate the main concept the section is about.\n' +
                            'Do not select a section topic for sections that do not result in a learning objective such as ones covering  course outline, prerequisites, set-up, and closing remarks.\n' +
                            'e.g. In a "Python Bootcamp" course, a section on using Python libraries to scrape web content should have "Web Scraping" as its section topic.',
                    )}
                </div>
            </Popover>
        );
    }

    render() {
        return (
            <FormGroup
                styleName="section-topic-form-container"
                udStyle="fieldset"
                label={this.renderTopic(
                    'topic-input:what-is-taught',
                    gettext('What topics are taught in this section?'),
                    this.renderTooltip(),
                )}
            >
                <SectionTopics sectionHasTopicStore={this.props.sectionHasTopicStore} />
            </FormGroup>
        );
    }
}
