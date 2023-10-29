import {Link} from '@udemy/react-core-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import requires from '../registry/requires';

import './progress-bar.less';

@withRouter
@requires('practiceViewStore')
@observer
export default class ProgressBar extends Component {
    static propTypes = {
        practiceViewStore: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        className: PropTypes.string,
    };

    static defaultProps = {
        className: null,
    };

    render() {
        const {baseUrl, isWizardComplete} = this.props.practiceViewStore;
        const baseUrlPrefix = baseUrl.replace(/\/$/, '');
        const currentPath = this.props.location.pathname
            .replace(baseUrl, '')
            .replace(/^\//, '')
            .replace(/\/$/, '');
        const renderItem = (path, text) => (
            <li styleName={classNames({active: currentPath === path})}>
                <Link className="ud-link-neutral" to={`${baseUrlPrefix}/${path}`}>
                    {text}
                </Link>
            </li>
        );

        return (
            <ul
                className={classNames('ud-unstyled-list', this.props.className)}
                styleName={classNames('nav-wizard', {complete: isWizardComplete})}
            >
                {renderItem('introduction', gettext('Instructions'))}
                {renderItem('submission', gettext('Submission'))}
                {renderItem('instructor-solution', gettext('Instructor example'))}
                {renderItem('give-feedback', gettext('Give feedback'))}
            </ul>
        );
    }
}
