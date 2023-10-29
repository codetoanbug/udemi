import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CurriculumItemControls from './curriculum-item-controls.react-component';

import './curriculum-item-footer.less';

@observer
export default class CurriculumItemFooter extends React.Component {
    static propTypes = {
        renderLeftButtons: PropTypes.func,
        renderRightButtons: PropTypes.func,
    };

    static defaultProps = {
        renderLeftButtons: () => null,
        renderRightButtons: () => null,
    };

    render() {
        const {renderLeftButtons, renderRightButtons, ...props} = this.props;
        return (
            <footer className="ct-dashboard-separator" styleName="flex-align-center footer">
                {renderLeftButtons()}
                <div styleName="flex-align-center right">
                    {renderRightButtons()}
                    <div styleName="flex-align-center">
                        <CurriculumItemControls {...props} />
                    </div>
                </div>
            </footer>
        );
    }
}
