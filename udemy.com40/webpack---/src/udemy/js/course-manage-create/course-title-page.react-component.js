import {TextInputWithCounter, FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './create-course-flow.less';

@observer
export default class CourseTitlePage extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    @autobind
    onChange(e) {
        this.props.store.updateData('title', e.target.value);
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    headerText = gettext('How about a working title?');
    subHeadText = gettext(
        "It's ok if you can't think of a good title now. You can change it later.",
    );

    render() {
        return (
            <div>
                <h1
                    className="ud-heading-serif-xl"
                    styleName="header-text"
                    data-purpose="header-text"
                >
                    {this.headerText}
                </h1>
                <p styleName="subhead-text" data-purpose="subhead-text">
                    {this.subHeadText}
                </p>
                <form styleName="response-form" onSubmit={this.handleSubmit}>
                    <FormGroup
                        label={gettext('Course title')}
                        labelProps={{className: 'ud-sr-only'}}
                    >
                        <TextInputWithCounter
                            value={this.props.store.pageData.title || ''}
                            placeholder={gettext('e.g. Learn Photoshop CS6 from Scratch')}
                            maxLength={60}
                            onChange={this.onChange}
                        />
                    </FormGroup>
                </form>
            </div>
        );
    }
}
