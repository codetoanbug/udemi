import {Button} from '@udemy/react-core-components';
import {ModalTrigger} from '@udemy/react-dialog-components';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AjaxModal from 'base-components/dialog/ajax-modal.react-component';

export default class ExportLecturesLink extends Component {
    static propTypes = {
        popupUrl: PropTypes.string.isRequired,
    };

    render() {
        return (
            <ModalTrigger
                trigger={
                    <Button name="export" udStyle="secondary">
                        {gettext('Export lectures')}
                    </Button>
                }
                renderModal={(props) => (
                    <AjaxModal
                        {...props}
                        labelledById="export-lectures-title"
                        url={this.props.popupUrl}
                    />
                )}
            />
        );
    }
}
