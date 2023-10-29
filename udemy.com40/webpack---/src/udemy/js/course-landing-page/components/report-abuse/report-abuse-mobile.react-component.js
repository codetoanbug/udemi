import {Button} from '@udemy/react-core-components';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {reportAbuseLink} from 'report-abuse/urls';
import getConfigData from 'utils/get-config-data';
import {noop} from 'utils/noop';
import udLink from 'utils/ud-link';
import udMe from 'utils/ud-me';

import './report-abuse.less';

@observer
export default class ReportAbuseMobile extends Component {
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

    componentDidMount() {
        this.setReturnUrl();
    }

    @observable returnUrl;

    @action
    setReturnUrl() {
        this.returnUrl = typeof window !== 'undefined' ? window.location.href : '/';
    }

    get url() {
        const source = 'course_landing_page';
        const nextUrl = reportAbuseLink({
            ...this.props,
            extraParams: {source, return_link: this.returnUrl},
        });

        if (udMe.is_authenticated) {
            return nextUrl;
        }

        return udLink.toAuth({
            showLogin: true,
            nextUrl,
            returnUrl: this.returnUrl,
            source,
            responseType: 'html',
        });
    }

    render() {
        if (!getConfigData().features.report_abuse) {
            return null;
        }
        const {
            className,
            fullWidthButton,
            size,
            text = gettext('Report abuse'),
            udStyle,
        } = this.props;
        const button = (
            <Button
                className={className}
                componentClass="a"
                href={this.url}
                size={size}
                udStyle={udStyle}
                onClick={this.props.onClick}
                data-purpose="report-abuse-link"
            >
                {text}
            </Button>
        );

        if (fullWidthButton) {
            return (
                <div className="component-margin component-border">
                    <div styleName="report-abuse-full-width">{button}</div>
                </div>
            );
        }

        return button;
    }
}
