import {Button} from '@udemy/react-core-components';
import React from 'react';

import {isMobileBrowser} from 'utils/user-agent/get-is-mobile-browser';

import NextItemLink from './curriculum/next-item-link.react-component';

import './unsupported-item.less';

export default class UnsupportedItem extends React.Component {
    constructor(props) {
        super(props);
        // Add this as an object property to make it testable.
        this.isMobileBrowser = isMobileBrowser;
    }

    render() {
        return (
            <div styleName="container">
                <h2 className="ud-heading-md" styleName="title">
                    {this.isMobileBrowser
                        ? gettext('This exercise is not available on this device')
                        : gettext(
                              'This exercise is not supported on this browser size, to continue with the exercise increase your browser size',
                          )}
                </h2>
                <Button componentClass={NextItemLink} udStyle="brand">
                    {gettext('Next lecture')}
                </Button>
            </div>
        );
    }
}
