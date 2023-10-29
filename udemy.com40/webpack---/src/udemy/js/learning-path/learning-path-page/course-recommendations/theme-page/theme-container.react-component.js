import {getUniqueId} from '@udemy/design-system-utils';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {Image, Button} from '@udemy/react-core-components';
import {Tooltip} from '@udemy/react-popup-components';
import {pxToRem} from '@udemy/styles';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, extendObservable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

import withMatchMediaClientOnly from 'base-components/responsive/match-media.react-component';

import {addDefaultSrc} from '../utils';
import './theme-container.less';

export const ThemeTile = (props) => {
    const [id] = useState(getUniqueId('theme-tile'));
    return (
        <div
            styleName={classNames('theme-tile-container', {checked: props.checked})}
            data-purpose={props.theme.title}
        >
            <input
                id={id}
                className="ud-sr-only"
                type="checkbox"
                name={props.theme.titleEnglish}
                checked={props.checked}
                onChange={props.onChange}
            />
            <label htmlFor={id} styleName="theme-tile">
                <div styleName="theme-image-container">
                    <Image
                        src={props.theme.imageUrl}
                        alt=""
                        width={168}
                        height={168}
                        onError={addDefaultSrc}
                    />
                </div>
                <div styleName="theme-title">{props.theme.title}</div>
            </label>
            {props.theme.description && (
                <span styleName="tooltip-container">
                    <Tooltip
                        placement="top"
                        detachFromTarget={true}
                        trigger={
                            <span styleName="tooltip-icon-container">
                                <InfoIcon label={gettext('Get info')} color="inherit" />
                            </span>
                        }
                    >
                        {props.theme.description}
                    </Tooltip>
                </span>
            )}
        </div>
    );
};

ThemeTile.propTypes = {
    checked: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

@withMatchMediaClientOnly({isSmMax: 'sm-max'})
@observer
export default class ThemeContainer extends React.Component {
    static propTypes = {
        updateTheme: PropTypes.func.isRequired,
        themes: PropTypes.array.isRequired,
        isSmMax: PropTypes.bool.isRequired,

        showCount: PropTypes.number,
        showAll: PropTypes.bool,
    };

    static defaultProps = {
        showCount: 3,
        showAll: false,
    };

    constructor(props) {
        super(props);
        extendObservable(this, {isExpanded: this.props.showAll});
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.showAll && !this.isExpanded) {
            this.toggleExpansion();
        }
    }

    @autobind
    calculateHeight() {
        const {showCount, themes, showAll, isSmMax} = this.props;

        // If you change any of these heights, please change them in theme-container.less, too
        const tileHeight = isSmMax ? 155 + 8 : 180 + 8;

        let height = 'auto';
        if (showCount < themes.length && !this.isExpanded && !showAll) {
            // We divide by 3 to have a good looking bottom fade, e.g:
            // showCount 5 = 2 rows, showCount 3 = 1 row
            const rowCount = Math.ceil(showCount / 3);
            const offset = 32;
            height = tileHeight * rowCount + offset;
            return `${pxToRem(height)}rem`;
        }
        return height;
    }

    @autobind
    updateTheme(event) {
        this.props.updateTheme(event.target.name, event.target.checked);
    }

    @autobind
    @action
    toggleExpansion() {
        this.isExpanded = !this.isExpanded;
    }

    render() {
        const shouldShowExpand = !this.props.showAll && !this.isExpanded;

        return (
            <div>
                <div
                    styleName={classNames('themes-container', {'bottom-fade': !this.isExpanded})}
                    style={{height: this.calculateHeight()}}
                >
                    {this.props.themes.map((theme) => (
                        <div key={`theme-${theme.titleEnglish}`} styleName="theme-column">
                            <ThemeTile
                                checked={theme.checked}
                                theme={theme}
                                onChange={this.updateTheme}
                            />
                        </div>
                    ))}
                </div>
                {shouldShowExpand && (
                    <div styleName="view-all-btn-container">
                        <Button onClick={this.toggleExpansion} udStyle="ghost">
                            {gettext('View all')}
                            <ExpandIcon label={false} />
                        </Button>
                    </div>
                )}
            </div>
        );
    }
}
