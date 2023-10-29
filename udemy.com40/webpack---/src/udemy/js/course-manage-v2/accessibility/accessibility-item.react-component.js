import {LocalizedHtml} from '@udemy/i18n';
import {Checkbox} from '@udemy/react-form-components';
import {Accordion} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './accessibility.less';

@observer
export default class AccessibilityItem extends Component {
    static propTypes = {
        itemData: PropTypes.object.isRequired,
        accessibilityStore: PropTypes.object.isRequired,
    };

    @autobind
    onChange(event) {
        this.props.accessibilityStore.setSetting(this.props.itemData.setting, event.target.checked);
    }

    render() {
        const {
            setting,
            title,
            tips,
            checkboxTitle,
            learnMoreText,
            learnMoreLink,
        } = this.props.itemData;

        return (
            <>
                <Accordion styleName="accordion">
                    <Accordion.Panel title={title}>
                        <ul>
                            {tips.map((tip, idx) => (
                                <li key={idx}>{tip}</li>
                            ))}
                        </ul>
                        <div styleName="item-learn-more">
                            <LocalizedHtml
                                html={learnMoreText}
                                interpolate={{
                                    learnMoreLink,
                                }}
                            />
                        </div>
                    </Accordion.Panel>
                </Accordion>
                <Checkbox
                    size="small"
                    onChange={this.onChange}
                    checked={!!this.props.accessibilityStore.settings.get(setting)}
                    styleName="checkbox"
                >
                    {checkboxTitle}
                </Checkbox>
            </>
        );
    }
}
