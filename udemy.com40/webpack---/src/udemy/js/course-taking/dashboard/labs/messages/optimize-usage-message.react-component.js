import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {getOptimizeUsageMessageForVertical} from 'labs/utils';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import LabsStore from '../labs.mobx-store';

import './messages.less';

@observer
export default class OptimizeUsageMessage extends React.Component {
    static propTypes = {
        labsStore: PropTypes.instanceOf(LabsStore).isRequired,
    };

    render() {
        return (
            <div data-purpose="labs-resource-notification">
                <h3 styleName="workspaces-message-title" className="ud-heading-md">
                    {gettext('Optimize your Udemy Workspaces usage')}
                </h3>
                <div
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'workspaces-message',
                        html: getOptimizeUsageMessageForVertical(
                            this.props.labsStore.labs[0].vertical,
                        ),
                    })}
                ></div>
            </div>
        );
    }
}
