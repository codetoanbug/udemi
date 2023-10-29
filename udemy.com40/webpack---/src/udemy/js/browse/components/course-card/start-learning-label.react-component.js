import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './start-learning-label.less';

const StartLearningLabel = ({className}) => {
    const isMobileMax = useMatchMedia('mobile-max');
    const {gettext} = useI18n();
    return (
        <div
            className={classNames(
                `ud-heading-sm ${className}`,
                styles['start-learning-label'],
                className ? '' : styles['label-position'],
            )}
        >
            {!isMobileMax ? (
                <Button size="small" udStyle="secondary">
                    {gettext('Start learning')}
                </Button>
            ) : (
                gettext('Start learning')
            )}
        </div>
    );
};
StartLearningLabel.propTypes = {
    className: PropTypes.string,
};
StartLearningLabel.defaultProps = {
    className: '',
};

export default StartLearningLabel;
