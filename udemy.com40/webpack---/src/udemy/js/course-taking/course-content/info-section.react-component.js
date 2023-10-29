import {Accordion} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './info-section.less';

export default class InfoSection extends Component {
    static propTypes = {
        useAlternateStyle: PropTypes.bool,
    };

    static defaultProps = {
        useAlternateStyle: false,
    };

    render() {
        const {useAlternateStyle, ...props} = this.props;
        return (
            <Accordion>
                <Accordion.Panel
                    defaultExpanded={true}
                    {...props}
                    styleName={classNames(
                        props.className,
                        'section',
                        useAlternateStyle ? 'alternate' : 'default',
                    )}
                />
            </Accordion>
        );
    }
}
