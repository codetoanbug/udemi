import {FormGroup, Select} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

@observer
export default class RatingsFilter extends Component {
    static propTypes = {
        store: PropTypes.shape({
            onRatingSelected: PropTypes.func.isRequired,
            selectedRating: PropTypes.number,
        }).isRequired,
    };

    @autobind
    onChange(event) {
        event.target.value
            ? this.props.store.onRatingSelected(Number(event.target.value))
            : this.props.store.onRatingSelected();
    }

    render() {
        const ratings = [
            {
                text: gettext('All ratings'),
                value: '',
            },
            {
                text: gettext('Five stars'),
                value: '5',
            },
            {
                text: gettext('Four stars'),
                value: '4',
            },
            {
                text: gettext('Three stars'),
                value: '3',
            },
            {
                text: gettext('Two stars'),
                value: '2',
            },
            {
                text: gettext('One star'),
                value: '1',
            },
        ];
        const options = ratings.map((rating, i) => (
            <option key={i} value={rating.value}>
                {rating.text}
            </option>
        ));

        return (
            <FormGroup label={gettext('Filter ratings')}>
                <Select
                    required={false}
                    onChange={this.onChange}
                    value={this.props.store.selectedRating || ''}
                >
                    {options}
                </Select>
            </FormGroup>
        );
    }
}
