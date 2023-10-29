import {Button} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ErrorBoundary from 'base-components/error-boundary/error-boundary.react-component';
import ReportAbuseModalTrigger from 'report-abuse/report-abuse-modal-trigger.react-component';
import getConfigData from 'utils/get-config-data';
import {noop} from 'utils/noop';

import './report-abuse.less';

@observer
export default class ReportAbuseDesktop extends Component {
    static propTypes = {
        className: PropTypes.string,
        fullWidthButton: PropTypes.bool,
        objectId: PropTypes.number.isRequired,
        objectType: PropTypes.string.isRequired,
        size: PropTypes.oneOf(['medium', 'large']),
        text: PropTypes.string,
        udStyle: PropTypes.oneOf(['secondary', 'ghost']),
        onClick: PropTypes.func,
    };

    static defaultProps = {
        className: '',
        fullWidthButton: false,
        size: 'medium',
        text: undefined,
        udStyle: 'ghost',
        onClick: noop,
    };

    render() {
        if (!getConfigData().features.report_abuse) {
            return null;
        }
        const {
            className,
            fullWidthButton,
            objectId,
            objectType,
            size,
            text = gettext('Report abuse'),
            udStyle,
        } = this.props;

        const button = (
            <ReportAbuseModalTrigger
                objectId={objectId}
                objectType={objectType}
                trigger={
                    <Button
                        className={className}
                        size={size}
                        udStyle={udStyle}
                        onClick={this.props.onClick}
                        data-purpose="report-abuse-link"
                    >
                        {text}
                    </Button>
                }
            />
        );

        let content = button;

        if (fullWidthButton) {
            content = (
                <div className="component-margin component-border">
                    <div styleName="report-abuse-full-width">{button}</div>
                </div>
            );
        }

        return <ErrorBoundary>{content}</ErrorBoundary>;
    }
}
