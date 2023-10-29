import BulletIcon from '@udemy/icons/dist/bullet.ud-icon';
import {BlockList} from '@udemy/react-core-components';
import {Accordion} from '@udemy/react-reveal-components';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {DEVICE_TYPE_MOBILE, getDeviceType} from 'browse/lib/device-type';
import {isomorphic} from 'utils/isomorphic-rendering';

import './requirements.less';

@isomorphic
export default class Requirements extends Component {
    static propTypes = {
        prerequisites: PropTypes.array,
        isCollapsible: PropTypes.bool,
        className: PropTypes.string,
        titleTypography: PropTypes.oneOf(['ud-heading-lg', 'ud-heading-xl']),
        onAccordionToggle: PropTypes.func,
    };

    static defaultProps = {
        prerequisites: [],
        isCollapsible: false,
        className: 'component-margin',
        titleTypography: 'ud-heading-xl',
        onAccordionToggle: undefined,
    };

    get accordionSize() {
        let size;
        switch (this.props.titleTypography) {
            case 'ud-heading-lg':
                size = 'large';
                break;
            case 'ud-heading-xl':
            default:
                size = 'xlarge';
        }
        return size;
    }

    render() {
        const {prerequisites, className, titleTypography, onAccordionToggle} = this.props;
        const isCollapsible = getDeviceType() === DEVICE_TYPE_MOBILE || this.props.isCollapsible;
        if (!prerequisites.length) {
            return null;
        }
        const title = gettext('Requirements');
        const requirements = prerequisites.map((item, index) => (
            <BlockList.Item key={index} icon={<BulletIcon label={false} />}>
                {item}
            </BlockList.Item>
        ));
        if (!isCollapsible) {
            return (
                <div className={className}>
                    <h2
                        styleName="title"
                        data-purpose="requirements-title"
                        className={titleTypography}
                    >
                        {title}
                    </h2>
                    <BlockList size="small" padding="tight">
                        {requirements}
                    </BlockList>
                </div>
            );
        }
        return (
            <Accordion size={this.accordionSize} className={className}>
                <Accordion.Panel title={title} onToggle={onAccordionToggle}>
                    <BlockList size="small" padding="tight">
                        {requirements}
                    </BlockList>
                </Accordion.Panel>
            </Accordion>
        );
    }
}
