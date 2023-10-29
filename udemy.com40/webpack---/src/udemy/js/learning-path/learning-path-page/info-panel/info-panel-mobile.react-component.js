import {Image} from '@udemy/react-core-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {PRO_PATH_FAVICON} from '../../constants';
import LearningPathStore from '../../learning-path.mobx-store';
import {CARD_IMAGE_SIZE} from '../../list-page/constants';
import Actions from './actions.react-component';
import DiscoverabilityToggle from './discoverability-toggle.react-component';
import {Editors, EditorsHeading, Overview} from './info-panel-components.react-component';
import './info-panel.less';

@inject('learningPathStore')
@observer
export default class InfoPanelMobile extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
    };

    render() {
        const {
            learningPath,
            isMobileViewportSize,
            showMobilePathEditorsModal,
        } = this.props.learningPathStore;
        const {itemsCount, owner, editors, totalDuration} = learningPath;

        if (!isMobileViewportSize) {
            return null;
        }

        return (
            <div data-purpose="info-panel-mobile" styleName="info-panel-container-mobile">
                <div styleName="flex-align-center info-panel-top-mobile">
                    {learningPath.isProPath ? (
                        <div styleName="flex-align-center">
                            <Image
                                src={PRO_PATH_FAVICON}
                                alt={gettext('Udemy pro logo')}
                                width={CARD_IMAGE_SIZE}
                                height={CARD_IMAGE_SIZE}
                                styleName="info-panel-udemy-icon"
                            />
                            {'Udemy Business Pro'}
                        </div>
                    ) : (
                        <div styleName="flex-align-center">
                            <EditorsHeading numEditors={editors.length} />
                            <Editors
                                owner={owner}
                                editors={editors}
                                isMobileViewportSize={true}
                                showMobilePathEditorsModal={showMobilePathEditorsModal}
                            />
                        </div>
                    )}
                    <div styleName="flex-align-center">
                        <DiscoverabilityToggle data-purpose="discoverability" />
                    </div>
                </div>
                <div styleName="info-panel-fixed-bottom-mobile">
                    <div>
                        <div className="ud-heading-sm" styleName="overview-heading">
                            {gettext('Overview')}
                        </div>
                        <div>
                            <Overview totalDuration={totalDuration} itemsCount={itemsCount} />
                        </div>
                    </div>
                    <Actions data-purpose="actions" />
                </div>
            </div>
        );
    }
}
