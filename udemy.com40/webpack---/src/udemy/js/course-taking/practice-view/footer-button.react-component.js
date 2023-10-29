import {Button} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {ITEM_TYPES} from '../curriculum/constants';
import ItemLink from '../curriculum/item-link.react-component';
import requires from '../registry/requires';
import './practice.less';

@requires('practiceViewStore')
@observer
export default class FooterButton extends Component {
    static propTypes = {
        practiceViewStore: PropTypes.object.isRequired,
        url: PropTypes.string.isRequired,
    };

    render() {
        const {practiceViewStore, url, ...props} = this.props;
        return (
            <Button
                size="small"
                {...props}
                componentClass={ItemLink}
                itemType={ITEM_TYPES.PRACTICE}
                itemId={practiceViewStore.practice.id}
                subPath={url}
            />
        );
    }
}
