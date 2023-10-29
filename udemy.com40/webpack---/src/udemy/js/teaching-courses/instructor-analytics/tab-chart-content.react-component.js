import NextIcon from '@udemy/icons/dist/next.ud-icon';
import {Button} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './tab-chart.less';

@observer
export default class TabChartContent extends Component {
    static propTypes = {
        content: PropTypes.element.isRequired,
        link: PropTypes.string,
        linkLabel: PropTypes.string,
        inAppLink: PropTypes.bool,
        baseUrl: PropTypes.string,
    };

    static defaultProps = {
        link: null,
        linkLabel: null,
        inAppLink: false,
        baseUrl: '',
    };

    render() {
        const link = this.props.inAppLink
            ? `${this.props.baseUrl}${this.props.link}`
            : this.props.link;
        return (
            <div>
                <div styleName="content">{this.props.content}</div>
                {this.props.link && (
                    <div styleName="footer" data-purpose="report-link">
                        <Button
                            udStyle="ghost"
                            componentClass="a"
                            href={link}
                            typography="ud-text-md"
                        >
                            {this.props.linkLabel}
                            <NextIcon label={false} />
                        </Button>
                    </div>
                )}
            </div>
        );
    }
}
