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
export default class InfoPanelDesktop extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
    };

    render() {
        const {learningPath, isMobileViewportSize} = this.props.learningPathStore;
        const {itemsCount, owner, editors, totalDuration} = learningPath;

        if (isMobileViewportSize) {
            return null;
        }

        return (
            <div
                styleName="info-panel-container-desktop"
                data-purpose="info-panel-desktop"
                id="info-panel-desktop"
            >
                <div styleName="info-panel-left">
                    {learningPath.isProPath ? (
                        <div styleName="info-panel-column">
                            <div className="ud-heading-sm" styleName="editors-heading">
                                {gettext('Curated by')}
                            </div>
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
                        </div>
                    ) : (
                        <div styleName="info-panel-column">
                            <div styleName="editors-heading">
                                <EditorsHeading numEditors={editors.length} />
                            </div>
                            <div styleName="flex-align-center">
                                <Editors owner={owner} editors={editors} />
                            </div>
                        </div>
                    )}
                    <div styleName="info-panel-column">
                        <div className="ud-heading-sm" styleName="overview-heading">
                            {gettext('Overview')}
                        </div>
                        <div styleName="flex-align-center">
                            <div styleName="overview">
                                <Overview totalDuration={totalDuration} itemsCount={itemsCount} />
                            </div>

                            <DiscoverabilityToggle data-purpose="discoverability" />
                        </div>
                    </div>
                </div>
                <div styleName="flex-align-center actions-column">
                    <Actions data-purpose="actions" />
                </div>
            </div>
        );
    }
}
