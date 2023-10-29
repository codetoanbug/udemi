import {Modal} from '@udemy/react-dialog-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import ListPathEditors from '../learning-path-page/list-path-editors.react-component';
import LearningPath from '../learning-path.mobx-model';

import './path-editors-modals.less';

/**
 * A modal component that displays path editors (used only for Mobile)
 */

@observer
export default class MobilePathEditorsModal extends React.Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
    };

    render() {
        const {isVisible, onHide, learningPath} = this.props;

        return (
            <Modal title={gettext('Editors')} isOpen={isVisible} onClose={onHide}>
                <ListPathEditors owner={learningPath.owner} editors={learningPath.editors} />
            </Modal>
        );
    }
}
