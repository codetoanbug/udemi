import {FormGroup, Select} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import './course-labels.less';

@observer
export default class PrimaryLabelSelect extends Component {
    static propTypes = {
        primaryLabel: PropTypes.object,
        labels: PropTypes.array.isRequired,
        placeholderCopy: PropTypes.string,
        onPrimaryLabelChange: PropTypes.func,
        locked: PropTypes.bool,
    };

    static defaultProps = {
        primaryLabel: null,
        placeholderCopy: gettext('Select a primary topic'),
        onPrimaryLabelChange: noop,
        locked: false,
    };

    @autobind
    onChange(event) {
        const oldPrimary = this.props.primaryLabel;
        let newPrimary;
        if (event.target.value === '') {
            newPrimary = null;
        } else {
            newPrimary = this.props.labels.find(
                (chl) => chl.label.id === parseInt(event.target.value, 10),
            );
        }
        this.props.onPrimaryLabelChange(oldPrimary, newPrimary);
    }

    render() {
        const {primaryLabel} = this.props;
        return (
            <div styleName="primary-label-selects">
                <div styleName="primary-label-select">
                    <FormGroup
                        label={this.props.placeholderCopy}
                        labelProps={{className: 'ud-sr-only'}}
                    >
                        <Select
                            name="labels_primary"
                            value={primaryLabel === null ? '' : primaryLabel.label.id}
                            onChange={this.onChange}
                            data-purpose="primary-label-input"
                            disabled={this.props.locked}
                        >
                            <option value="">{this.props.placeholderCopy}</option>
                            {this.props.labels.map((chl) => (
                                <option key={chl.label.id} value={chl.label.id}>
                                    {/* eslint-disable-next-line gettext/no-variable-string */}
                                    {gettext(chl.label.title)}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                </div>
            </div>
        );
    }
}
