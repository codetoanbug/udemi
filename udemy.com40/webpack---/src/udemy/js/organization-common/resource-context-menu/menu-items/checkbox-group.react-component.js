import {FormGroup} from '@udemy/react-form-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './checkbox-group.less';

const CheckboxGroup = (props) => {
    const checkboxGroupItems = React.Children.map(props.children, (child) => child || null);
    if (!checkboxGroupItems || checkboxGroupItems.length === 0) {
        return null;
    }
    if (props.label) {
        return (
            <FormGroup udStyle="fieldset" {...props} className={props.className}>
                <div className={styles.container}>{checkboxGroupItems}</div>
            </FormGroup>
        );
    }
    return (
        <div {...props} className={classNames(props.className, styles.container)}>
            {checkboxGroupItems}
        </div>
    );
};

CheckboxGroup.propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
};
CheckboxGroup.defaultProps = {
    label: undefined,
    className: undefined,
};

export default CheckboxGroup;
