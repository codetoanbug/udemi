import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import AjaxModal from 'base-components/dialog/ajax-modal.react-component';
import {OccupationVisibilityStore} from 'occupation/stores/occupation-visibility/occupation-visibility.mobx-store';

import styles from './occupation-modal.less';

interface OccupationModalProps {
    occupationVisibilityStore: OccupationVisibilityStore;
}
@observer
export class OccupationModal extends React.Component<OccupationModalProps> {
    static propTypes = {
        occupationVisibilityStore: PropTypes.object.isRequired,
    };

    preloadScreen() {
        return import(
            /* webpackChunkName: "occupation-pages-occupation-explorer-udlite-app" */ 'occupation/pages/occupation-explorer/udlite-app'
        );
    }

    render() {
        const {occupationVisibilityStore} = this.props;
        return (
            <Provider isAjaxModal={true}>
                <AjaxModal
                    className={styles['occupation-modal']}
                    labelledById="occupation-modal"
                    url={occupationVisibilityStore.modalURL}
                    isOpen={occupationVisibilityStore.isModalOpen}
                    onClose={occupationVisibilityStore.closeModal}
                    fullPage={true}
                    requireExplicitAction={true}
                    preloader={this.preloadScreen}
                />
            </Provider>
        );
    }
}
