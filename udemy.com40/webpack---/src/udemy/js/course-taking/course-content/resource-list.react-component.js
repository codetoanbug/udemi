import {BlockList} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AssetModel from 'asset/asset.mobx-model';

import requires from '../registry/requires';
import Resource from './resource.react-component';

@requires('courseTakingStore')
@observer
export default class ResourceList extends Component {
    static propTypes = {
        resources: PropTypes.arrayOf(PropTypes.instanceOf(AssetModel)),
        className: PropTypes.string,
    };

    static defaultProps = {
        resources: [],
        className: null,
    };

    render() {
        const {className, resources, ...props} = this.props;
        if (!resources.length) {
            return null;
        }

        return (
            <BlockList className={className} size="large">
                {resources.map((resource) => (
                    <Resource
                        key={resource.id}
                        displayMode={Resource.DISPLAY.LIST}
                        resource={resource}
                        {...props}
                    />
                ))}
            </BlockList>
        );
    }
}
